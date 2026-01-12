"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Phone,
  PhoneOff,
  Clock,
  MapPin,
  Star,
  Calendar,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  XCircle,
  Timer,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CampaignCallRecord } from "@/lib/campaign-storage";
import { CallStatus } from "@/lib/db/types";

interface PipelineColumn {
  id: CallStatus;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}

const PIPELINE_COLUMNS: PipelineColumn[] = [
  {
    id: "not_called",
    title: "Not Called",
    icon: Phone,
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-900/50",
    borderColor: "border-gray-200 dark:border-gray-800",
  },
  {
    id: "queued",
    title: "Queued",
    icon: Timer,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  {
    id: "in_progress",
    title: "In Progress",
    icon: PhoneCall,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "completed",
    title: "Completed",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    id: "booked",
    title: "Booked",
    icon: CalendarCheck,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    id: "calendar_sent",
    title: "Calendar Sent",
    icon: Calendar,
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    borderColor: "border-teal-200 dark:border-teal-800",
  },
  {
    id: "voicemail",
    title: "Voicemail",
    icon: PhoneOff,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    id: "failed",
    title: "Failed",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
];

interface PipelineCardProps {
  record: CampaignCallRecord;
  onClick?: () => void;
}

function PipelineCard({ record, onClick }: PipelineCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          onClick={onClick}
          className="bg-white dark:bg-gray-900 rounded-lg border p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm leading-tight line-clamp-2">
                {record.practitioner_name}
              </h4>
              {record.appointment_booked && (
                <Calendar className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                {record.practitioner_type}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{record.city}</span>
              {record.duration_seconds && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(record.duration_seconds)}</span>
                </>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground/70">
              {timeAgo(record.updated_at)}
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="right">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold">{record.practitioner_name}</h4>
            <p className="text-sm text-muted-foreground">{record.practitioner_type}</p>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{record.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{record.city}, {record.province}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{record.phone}</span>
            </div>
          </div>
          {record.duration_seconds && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Call duration: {formatDuration(record.duration_seconds)}</span>
            </div>
          )}
          {record.appointment_booked && record.appointment_time && (
            <div className="flex items-center gap-2 text-sm text-purple-600">
              <Calendar className="w-4 h-4" />
              <span>Appointment: {record.appointment_time}</span>
            </div>
          )}
          {record.summary && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground font-medium mb-1">Summary</p>
              <p className="text-sm line-clamp-3">{record.summary}</p>
            </div>
          )}
          <div className="pt-2 border-t flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Last updated: {new Date(record.updated_at).toLocaleString()}
            </span>
            {onClick && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClick}>
                View Details
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

interface PipelineBoardProps {
  records: Record<string, CampaignCallRecord>;
  onCardClick?: (record: CampaignCallRecord) => void;
}

export function PipelineBoard({ records, onCardClick }: PipelineBoardProps) {
  // Group records by status
  const groupedRecords = useMemo(() => {
    const groups: Record<CallStatus, CampaignCallRecord[]> = {
      not_called: [],
      queued: [],
      in_progress: [],
      completed: [],
      booked: [],
      calendar_sent: [],
      voicemail: [],
      failed: [],
    };

    Object.values(records).forEach((record) => {
      if (record.status === "calendar_sent") {
        groups.booked.push(record);
      } else {
        groups[record.status].push(record);
      }
    });

    // Sort each group by updated_at descending
    Object.keys(groups).forEach((key) => {
      groups[key as CallStatus].sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

    return groups;
  }, [records]);

  // Calculate totals
  const totalRecords = Object.values(records).length;

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Pipeline View</h3>
          <Badge variant="outline">{totalRecords} total</Badge>
        </div>
      </div>

      {/* Board Columns */}
      <ScrollArea className="flex-1">
        <div className="flex gap-4 p-4 min-w-max">
          {PIPELINE_COLUMNS.map((column) => {
            const columnRecords = groupedRecords[column.id] || [];
            const Icon = column.icon;
            const percentage = totalRecords > 0 
              ? Math.round((columnRecords.length / totalRecords) * 100)
              : 0;

            return (
              <div
                key={column.id}
                className={cn(
                  "w-72 flex-shrink-0 rounded-lg border",
                  column.bgColor,
                  column.borderColor
                )}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-inherit">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("w-4 h-4", column.color)} />
                      <span className="font-medium text-sm">{column.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                        {columnRecords.length}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column Cards */}
                <ScrollArea className="h-[calc(100vh-380px)]">
                  <div className="p-2 space-y-2">
                    {columnRecords.length === 0 ? (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        No practitioners
                      </div>
                    ) : (
                      columnRecords.map((record) => (
                        <PipelineCard
                          key={record.practitioner_id}
                          record={record}
                          onClick={() => onCardClick?.(record)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

// Compact funnel view for smaller spaces
interface FunnelViewProps {
  records: Record<string, CampaignCallRecord>;
}

export function FunnelView({ records }: FunnelViewProps) {
  const totals = useMemo(() => {
    const counts: Record<string, number> = {
      not_called: 0,
      queued: 0,
      in_progress: 0,
      completed: 0,
      booked: 0,
      failed: 0,
    };

    Object.values(records).forEach((record) => {
      if (record.status === "calendar_sent") {
        counts.booked++;
      } else {
        counts[record.status]++;
      }
    });

    return counts;
  }, [records]);

  const total = Object.values(records).length;

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {PIPELINE_COLUMNS.map((column, index) => {
        const count = totals[column.id] || 0;
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        const Icon = column.icon;

        return (
          <div key={column.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap",
                column.bgColor,
                column.borderColor,
                "border"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", column.color)} />
              <span className="font-medium">{count}</span>
              <span className="text-muted-foreground">({percentage}%)</span>
            </div>
            {index < PIPELINE_COLUMNS.length - 1 && (
              <div className="w-4 h-px bg-muted-foreground/30 mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}
