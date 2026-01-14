"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  Clock,
  Voicemail,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { AudioPlayer } from "./audio-player";
import { CallStatus } from "@/lib/db/types";

interface DrawerTimelineItem {
  id: string;
  date: string;
  status: CallStatus | string;
  duration?: number;
  summary?: string;
  transcript?: string;
  recording_url?: string;
  sentiment_label?: string;
  appointment_booked?: boolean;
}

interface DrawerCallTimelineProps {
  items: DrawerTimelineItem[];
  loading?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  completed: { color: "bg-green-500", icon: <CheckCircle className="w-4 h-4 text-green-600" />, label: "Completed" },
  booked: { color: "bg-purple-500", icon: <Calendar className="w-4 h-4 text-purple-600" />, label: "Booked" },
  calendar_sent: { color: "bg-teal-500", icon: <Calendar className="w-4 h-4 text-teal-600" />, label: "Calendar Sent" },
  voicemail: { color: "bg-orange-500", icon: <Voicemail className="w-4 h-4 text-orange-600" />, label: "Voicemail" },
  failed: { color: "bg-red-500", icon: <XCircle className="w-4 h-4 text-red-600" />, label: "Failed" },
  in_progress: { color: "bg-blue-500", icon: <Clock className="w-4 h-4 text-blue-600 animate-pulse" />, label: "In Progress" },
  queued: { color: "bg-yellow-500", icon: <Clock className="w-4 h-4 text-yellow-600" />, label: "Queued" },
  not_called: { color: "bg-gray-300", icon: <Clock className="w-4 h-4 text-gray-400" />, label: "Not Called" },
};

function formatDuration(seconds: number | undefined) {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } else if (diffDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } else if (diffDays < 7) {
    return `${date.toLocaleDateString([], { weekday: "long" })} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function TimelineItem({ item, isLast }: { item: DrawerTimelineItem; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.not_called;

  const SentimentIcon = item.sentiment_label === "positive" ? Smile 
    : item.sentiment_label === "negative" ? Frown : Meh;

  return (
    <div className="relative flex gap-3">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 w-0.5 h-[calc(100%-8px)] bg-border" />
      )}

      {/* Timeline dot */}
      <div
        className={cn(
          "w-6 h-6 rounded-full shrink-0 flex items-center justify-center ring-4 ring-background",
          config.color
        )}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="bg-card border rounded-lg p-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {config.icon}
              <span className="text-sm font-medium">{config.label}</span>
              {item.duration && (
                <span className="text-xs text-muted-foreground">
                  • {formatDuration(item.duration)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDate(item.date)}
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.appointment_booked && (
              <Badge variant="secondary" className="text-[10px] bg-purple-100 text-purple-700">
                <Calendar className="w-3 h-3 mr-1" />
                Appointment
              </Badge>
            )}
            {item.sentiment_label && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px]",
                  item.sentiment_label === "positive" && "bg-green-100 text-green-700",
                  item.sentiment_label === "negative" && "bg-red-100 text-red-700",
                  item.sentiment_label === "neutral" && "bg-gray-100 text-gray-700"
                )}
              >
                <SentimentIcon className="w-3 h-3 mr-1" />
                {item.sentiment_label}
              </Badge>
            )}
          </div>

          {/* Summary */}
          {item.summary && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {item.summary}
            </p>
          )}

          {/* Expandable content */}
          {(item.transcript || item.recording_url) && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 px-2 text-xs"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Hide details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Show details
                  </>
                )}
              </Button>

              {expanded && (
                <div className="mt-3 space-y-3">
                  {/* Recording */}
                  {item.recording_url && (
                    <AudioPlayer src={item.recording_url} />
                  )}

                  {/* Transcript */}
                  {item.transcript && (
                    <div>
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
                        <FileText className="w-3 h-3" />
                        Transcript
                      </div>
                      <ScrollArea className="h-[150px] bg-muted/50 rounded-md p-2">
                        <pre className="text-xs whitespace-pre-wrap font-sans">
                          {item.transcript}
                        </pre>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function DrawerCallTimeline({ items, loading, className }: DrawerCallTimelineProps) {
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <Clock className="w-4 h-4 animate-spin mr-2 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading call history...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Clock className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground">No calls recorded yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Call history will appear here after making calls
        </p>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      {items.map((item, index) => (
        <TimelineItem
          key={item.id}
          item={item}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}
