"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  PhoneCall,
  PhoneOff,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Clock,
  Timer,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  MapPin,
  Expand,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CampaignCallRecord, CallStatus } from "@/lib/campaign-storage";

// Timeline event configuration
const EVENT_CONFIG: Record<
  CallStatus,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    label: string;
  }
> = {
  not_called: {
    icon: Phone,
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    label: "Not Called",
  },
  queued: {
    icon: Timer,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    label: "Queued",
  },
  in_progress: {
    icon: PhoneCall,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    label: "In Progress",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    label: "Completed",
  },
  booked: {
    icon: CalendarCheck,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    label: "Booked",
  },
  calendar_sent: {
    icon: Calendar,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    label: "Calendar Sent",
  },
  failed: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    label: "Failed",
  },
};

interface TimelineEvent {
  id: string;
  record: CampaignCallRecord;
  timestamp: Date;
  type: CallStatus;
}

interface CallTimelineProps {
  records: Record<string, CampaignCallRecord>;
  onEventClick?: (record: CampaignCallRecord) => void;
  className?: string;
}

// Format time display
function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Timeline event component
function TimelineEventCard({
  event,
  onClick,
  isExpanded,
}: {
  event: TimelineEvent;
  onClick?: () => void;
  isExpanded?: boolean;
}) {
  const config = EVENT_CONFIG[event.type];
  const Icon = config.icon;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClick}
          className={cn(
            "relative flex-shrink-0 cursor-pointer rounded-lg border p-3 transition-shadow hover:shadow-md",
            config.bgColor,
            isExpanded ? "w-64" : "w-40"
          )}
        >
          {/* Status indicator line */}
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
              config.color.replace("text-", "bg-")
            )}
          />

          {/* Content */}
          <div className="pl-2">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={cn("w-4 h-4", config.color)} />
              <span className="text-xs font-medium text-muted-foreground">
                {formatTime(event.timestamp)}
              </span>
            </div>
            <h4 className="font-medium text-sm truncate">{event.record.practitioner_name}</h4>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 space-y-1"
              >
                <p className="text-xs text-muted-foreground truncate">
                  {event.record.practitioner_type}
                </p>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-[10px]", config.bgColor, config.color)}>
                    {config.label}
                  </Badge>
                  {event.record.duration_seconds && (
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(event.record.duration_seconds)}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Appointment badge */}
          {event.record.appointment_booked && (
            <div className="absolute -top-1 -right-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[8px] text-white font-bold">
                📅
              </span>
            </div>
          )}
        </motion.div>
      </HoverCardTrigger>

      <HoverCardContent className="w-72" side="bottom">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold">{event.record.practitioner_name}</h4>
            <p className="text-sm text-muted-foreground">{event.record.practitioner_type}</p>
          </div>
          
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{event.record.city}, {event.record.province}</span>
            </div>
            {event.record.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{event.record.phone}</span>
              </div>
            )}
            {event.record.duration_seconds && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Duration: {formatDuration(event.record.duration_seconds)}</span>
              </div>
            )}
          </div>

          {event.record.appointment_booked && event.record.appointment_time && (
            <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-md p-2">
              <CalendarCheck className="w-4 h-4" />
              <span>Appointment: {event.record.appointment_time}</span>
            </div>
          )}

          {event.record.summary && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground font-medium mb-1">Summary</p>
              <p className="text-sm line-clamp-3">{event.record.summary}</p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// Day section with events
function DaySection({
  date,
  events,
  onEventClick,
  isExpanded,
}: {
  date: string;
  events: TimelineEvent[];
  onEventClick?: (record: CampaignCallRecord) => void;
  isExpanded: boolean;
}) {
  // Group events by hour
  const hourGroups = useMemo(() => {
    const groups: Record<number, TimelineEvent[]> = {};
    events.forEach((event) => {
      const hour = event.timestamp.getHours();
      if (!groups[hour]) groups[hour] = [];
      groups[hour].push(event);
    });
    return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));
  }, [events]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-sm">{date}</h3>
        <Badge variant="outline" className="text-xs">
          {events.length} {events.length === 1 ? "call" : "calls"}
        </Badge>
      </div>

      {/* Hour timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {hourGroups.map(([hour, hourEvents]) => (
            <div key={hour} className="relative">
              {/* Hour marker */}
              <div className="absolute left-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium z-10">
                  {Number(hour) > 12 ? Number(hour) - 12 : hour || 12}
                  <span className="text-[8px] ml-0.5">
                    {Number(hour) >= 12 ? "PM" : "AM"}
                  </span>
                </div>
              </div>

              {/* Events for this hour */}
              <div className="ml-12 flex gap-3 overflow-x-auto pb-2">
                <AnimatePresence mode="popLayout">
                  {hourEvents.map((event) => (
                    <TimelineEventCard
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick?.(event.record)}
                      isExpanded={isExpanded}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CallTimeline({
  records,
  onEventClick,
  className,
}: CallTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Convert records to timeline events
  const events = useMemo(() => {
    return Object.values(records)
      .filter((r) => r.status !== "not_called")
      .map((record) => ({
        id: record.practitioner_id,
        record,
        timestamp: new Date(record.updated_at),
        type: record.status,
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [records]);

  // Group events by date
  const dateGroups = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    events.forEach((event) => {
      const dateKey = formatDate(event.timestamp);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(event);
    });
    return Object.entries(groups);
  }, [events]);

  // Get unique dates for navigation
  const dates = useMemo(() => dateGroups.map(([date]) => date), [dateGroups]);

  // Filter by selected date
  const filteredGroups = selectedDate
    ? dateGroups.filter(([date]) => date === selectedDate)
    : dateGroups;

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayEvents = events.filter(
      (e) => e.timestamp.toDateString() === today
    );
    return {
      total: events.length,
      today: todayEvents.length,
      completed: events.filter((e) => e.type === "completed").length,
      booked: events.filter(
        (e) => e.type === "booked" || e.type === "calendar_sent"
      ).length,
    };
  }, [events]);

  if (events.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <h4 className="font-medium mb-1">No Timeline Events</h4>
            <p className="text-sm text-muted-foreground">
              Call events will appear here once you start making calls.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <CardTitle className="text-base">Call Timeline</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick stats */}
            <div className="hidden sm:flex items-center gap-3 text-xs mr-4">
              <span className="text-muted-foreground">
                Today: <span className="font-medium text-foreground">{stats.today}</span>
              </span>
              <span className="text-green-600">
                Completed: <span className="font-medium">{stats.completed}</span>
              </span>
              <span className="text-purple-600">
                Booked: <span className="font-medium">{stats.booked}</span>
              </span>
            </div>

            {/* Expand toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Expand className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Date filter */}
        {dates.length > 1 && (
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant={selectedDate === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDate(null)}
              className="h-7 text-xs"
            >
              All
            </Button>
            <ScrollArea className="flex-1">
              <div className="flex gap-1">
                {dates.map((date) => (
                  <Button
                    key={date}
                    variant={selectedDate === date ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDate(date)}
                    className="h-7 text-xs whitespace-nowrap"
                  >
                    {date}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-8 pr-4">
            {filteredGroups.map(([date, dateEvents]) => (
              <DaySection
                key={date}
                date={date}
                events={dateEvents}
                onEventClick={onEventClick}
                isExpanded={isExpanded}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Horizontal timeline for quick overview
export function HorizontalTimeline({
  records,
  onEventClick,
  maxEvents = 10,
  className,
}: {
  records: Record<string, CampaignCallRecord>;
  onEventClick?: (record: CampaignCallRecord) => void;
  maxEvents?: number;
  className?: string;
}) {
  const events = useMemo(() => {
    return Object.values(records)
      .filter((r) => r.status !== "not_called")
      .map((record) => ({
        id: record.practitioner_id,
        record,
        timestamp: new Date(record.updated_at),
        type: record.status,
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, maxEvents);
  }, [records, maxEvents]);

  if (events.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative", className)}>
      {/* Timeline line */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />

      {/* Events */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-2">
          {events.map((event, index) => {
            const config = EVENT_CONFIG[event.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onEventClick?.(event.record)}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Dot */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-110",
                    config.bgColor
                  )}
                >
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium truncate max-w-[80px]">
                    {event.record.practitioner_name.split(" ")[0]}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatTime(event.timestamp)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
