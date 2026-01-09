"use client";

import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Clock,
  Timer,
  RefreshCw,
  Activity,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CampaignCallRecord, CallStatus } from "@/lib/campaign-storage";

interface ActivityItem {
  id: string;
  type: "call_started" | "call_completed" | "call_failed" | "appointment_booked" | "queued";
  practitionerName: string;
  practitionerType: string;
  city: string;
  province: string;
  timestamp: string;
  duration?: number;
  appointmentTime?: string;
  record: CampaignCallRecord;
}

interface ActivityFeedProps {
  records: Record<string, CampaignCallRecord>;
  onItemClick?: (record: CampaignCallRecord) => void;
  maxItems?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

function getActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "call_started":
      return { icon: PhoneCall, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/50" };
    case "call_completed":
      return { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900/50" };
    case "call_failed":
      return { icon: XCircle, color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-900/50" };
    case "appointment_booked":
      return { icon: CalendarCheck, color: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900/50" };
    case "queued":
      return { icon: Timer, color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/50" };
    default:
      return { icon: Phone, color: "text-gray-500", bgColor: "bg-gray-100 dark:bg-gray-900/50" };
  }
}

function getActivityMessage(item: ActivityItem): string {
  switch (item.type) {
    case "call_started":
      return "Call started";
    case "call_completed":
      return item.duration ? `Call completed (${formatDuration(item.duration)})` : "Call completed";
    case "call_failed":
      return "Call failed";
    case "appointment_booked":
      return item.appointmentTime ? `Appointment booked for ${item.appointmentTime}` : "Appointment booked";
    case "queued":
      return "Added to queue";
    default:
      return "Activity recorded";
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return "just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  return `${diffDays}d ago`;
}

function ActivityItemComponent({
  item,
  onClick,
}: {
  item: ActivityItem;
  onClick?: () => void;
}) {
  const { icon: Icon, color, bgColor } = getActivityIcon(item.type);
  const message = getActivityMessage(item);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors",
        onClick && "cursor-pointer hover:bg-muted/50"
      )}
    >
      {/* Icon */}
      <div className={cn("flex-shrink-0 rounded-full p-2", bgColor)}>
        <Icon className={cn("w-4 h-4", color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-sm leading-tight">{item.practitionerName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{message}</p>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {timeAgo(item.timestamp)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
            {item.practitionerType}
          </Badge>
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5" />
            {item.city}, {item.province}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ActivityFeed({
  records,
  onItemClick,
  maxItems = 50,
  autoRefresh = false,
  refreshInterval = 10000,
}: ActivityFeedProps) {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Convert records to activity items
  const activities = useMemo(() => {
    const items: ActivityItem[] = [];

    Object.values(records).forEach((record) => {
      // Determine activity type based on status
      let type: ActivityItem["type"] = "queued";
      let timestamp = record.updated_at;

      switch (record.status) {
        case "in_progress":
          type = "call_started";
          timestamp = record.call_started_at || record.updated_at;
          break;
        case "completed":
          type = "call_completed";
          timestamp = record.call_ended_at || record.updated_at;
          break;
        case "booked":
        case "calendar_sent":
          type = "appointment_booked";
          timestamp = record.call_ended_at || record.updated_at;
          break;
        case "failed":
          type = "call_failed";
          timestamp = record.call_ended_at || record.updated_at;
          break;
        case "queued":
          type = "queued";
          break;
        default:
          return; // Skip not_called
      }

      items.push({
        id: `${record.practitioner_id}-${type}`,
        type,
        practitionerName: record.practitioner_name,
        practitionerType: record.practitioner_type,
        city: record.city,
        province: record.province,
        timestamp,
        duration: record.duration_seconds,
        appointmentTime: record.appointment_time,
        record,
      });
    });

    // Sort by timestamp descending
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return items.slice(0, maxItems);
  }, [records, maxItems, lastRefresh]);

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityItem[]> = {};

    activities.forEach((item) => {
      const date = new Date(item.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = "Yesterday";
      } else {
        key = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return groups;
  }, [activities]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastRefresh(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayActivities = activities.filter(
      (a) => new Date(a.timestamp).toDateString() === today
    );

    return {
      total: activities.length,
      today: todayActivities.length,
      completed: todayActivities.filter((a) => a.type === "call_completed").length,
      booked: todayActivities.filter((a) => a.type === "appointment_booked").length,
    };
  }, [activities]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Activity Feed</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
        {/* Quick Stats */}
        <div className="flex items-center gap-3 mt-2 text-xs">
          <span className="text-muted-foreground">Today:</span>
          <Badge variant="outline" className="gap-1">
            <Phone className="w-3 h-3" />
            {stats.today} calls
          </Badge>
          <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3" />
            {stats.completed}
          </Badge>
          <Badge variant="outline" className="gap-1 bg-purple-50 text-purple-700 border-purple-200">
            <CalendarCheck className="w-3 h-3" />
            {stats.booked}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="px-4 pb-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
                <p className="text-xs mt-1">Activity will appear here as calls are made</p>
              </div>
            ) : (
              Object.entries(groupedActivities).map(([date, items]) => (
                <div key={date} className="mb-4">
                  <div className="sticky top-0 bg-card py-2 z-10">
                    <h4 className="text-xs font-medium text-muted-foreground">{date}</h4>
                  </div>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <ActivityItemComponent
                        key={item.id}
                        item={item}
                        onClick={onItemClick ? () => onItemClick(item.record) : undefined}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Compact inline activity feed for sidebars
export function ActivityFeedCompact({
  records,
  onItemClick,
  maxItems = 5,
}: Pick<ActivityFeedProps, "records" | "onItemClick" | "maxItems">) {
  const activities = useMemo(() => {
    const items: ActivityItem[] = [];

    Object.values(records).forEach((record) => {
      if (record.status === "not_called") return;

      let type: ActivityItem["type"] = "queued";
      switch (record.status) {
        case "in_progress":
          type = "call_started";
          break;
        case "completed":
          type = "call_completed";
          break;
        case "booked":
        case "calendar_sent":
          type = "appointment_booked";
          break;
        case "failed":
          type = "call_failed";
          break;
      }

      items.push({
        id: record.practitioner_id,
        type,
        practitionerName: record.practitioner_name,
        practitionerType: record.practitioner_type,
        city: record.city,
        province: record.province,
        timestamp: record.updated_at,
        duration: record.duration_seconds,
        record,
      });
    });

    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return items.slice(0, maxItems);
  }, [records, maxItems]);

  if (activities.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((item) => {
        const { icon: Icon, color } = getActivityIcon(item.type);
        return (
          <div
            key={item.id}
            onClick={onItemClick ? () => onItemClick(item.record) : undefined}
            className={cn(
              "flex items-center gap-2 py-1.5",
              onItemClick && "cursor-pointer hover:bg-muted/50 rounded-md px-2 -mx-2"
            )}
          >
            <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", color)} />
            <span className="text-sm truncate flex-1">{item.practitionerName}</span>
            <span className="text-xs text-muted-foreground">{timeAgo(item.timestamp)}</span>
          </div>
        );
      })}
    </div>
  );
}
