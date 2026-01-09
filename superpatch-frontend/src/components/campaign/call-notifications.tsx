"use client";

import { toast } from "sonner";
import {
  PhoneCall,
  PhoneOff,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  PartyPopper,
  Clock,
  AlertTriangle,
  Info,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Notification types for calls
export type CallNotificationType =
  | "call_started"
  | "call_completed"
  | "call_failed"
  | "appointment_booked"
  | "campaign_started"
  | "campaign_completed"
  | "campaign_paused"
  | "queued";

interface NotificationOptions {
  practitionerName?: string;
  duration?: number;
  appointmentTime?: string;
  callCount?: number;
  bookedCount?: number;
  description?: string;
}

// Icon and color configurations
const NOTIFICATION_CONFIG: Record<
  CallNotificationType,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  call_started: {
    icon: PhoneCall,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
  },
  call_completed: {
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/50",
  },
  call_failed: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/50",
  },
  appointment_booked: {
    icon: CalendarCheck,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/50",
  },
  campaign_started: {
    icon: Sparkles,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
  },
  campaign_completed: {
    icon: PartyPopper,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/50",
  },
  campaign_paused: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
  },
  queued: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
  },
};

// Generate message based on notification type
function getMessage(type: CallNotificationType, options: NotificationOptions): string {
  switch (type) {
    case "call_started":
      return options.practitionerName
        ? `Calling ${options.practitionerName}...`
        : "Call started";
    case "call_completed":
      return options.practitionerName
        ? `Call with ${options.practitionerName} completed${
            options.duration ? ` (${formatDuration(options.duration)})` : ""
          }`
        : "Call completed";
    case "call_failed":
      return options.practitionerName
        ? `Call to ${options.practitionerName} failed`
        : "Call failed";
    case "appointment_booked":
      return options.practitionerName
        ? `🎉 Appointment booked with ${options.practitionerName}${
            options.appointmentTime ? ` for ${options.appointmentTime}` : ""
          }!`
        : "Appointment booked!";
    case "campaign_started":
      return options.callCount
        ? `Campaign started with ${options.callCount} practitioners`
        : "Campaign started";
    case "campaign_completed":
      return options.bookedCount !== undefined
        ? `Campaign completed! ${options.bookedCount} appointments booked`
        : "Campaign completed!";
    case "campaign_paused":
      return "Campaign paused";
    case "queued":
      return options.practitionerName
        ? `${options.practitionerName} added to queue`
        : "Added to queue";
    default:
      return "Notification";
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Custom notification component
function CallNotification({
  type,
  message,
  description,
}: {
  type: CallNotificationType;
  message: string;
  description?: string;
}) {
  const config = NOTIFICATION_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3">
      <div className={cn("rounded-full p-2 flex-shrink-0", config.bgColor)}>
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{message}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

// Main notification function
export function showCallNotification(
  type: CallNotificationType,
  options: NotificationOptions = {}
) {
  const message = getMessage(type, options);
  const config = NOTIFICATION_CONFIG[type];

  // Use different toast types based on notification type
  switch (type) {
    case "call_started":
      toast.info(
        <CallNotification type={type} message={message} description={options.description} />,
        {
          duration: 3000,
          icon: null,
        }
      );
      break;

    case "call_completed":
      toast.success(
        <CallNotification type={type} message={message} description={options.description} />,
        {
          duration: 4000,
          icon: null,
        }
      );
      break;

    case "call_failed":
      toast.error(
        <CallNotification type={type} message={message} description={options.description} />,
        {
          duration: 5000,
          icon: null,
        }
      );
      break;

    case "appointment_booked":
      // Special celebration for appointments
      toast.success(
        <CallNotification type={type} message={message} description={options.description} />,
        {
          duration: 6000,
          icon: null,
          className: "border-purple-200 bg-purple-50 dark:bg-purple-950/30",
        }
      );
      // Add confetti effect if available
      triggerConfetti();
      break;

    case "campaign_started":
      toast.info(
        <CallNotification type={type} message={message} description={options.description} />,
        {
          duration: 4000,
          icon: null,
        }
      );
      break;

    case "campaign_completed":
      toast.success(
        <CallNotification type={type} message={message} description={options.description} />,
        {
          duration: 6000,
          icon: null,
        }
      );
      break;

    case "campaign_paused":
      toast.warning(
        <CallNotification type={type} message={message} description={options.description} />,
        {
          duration: 3000,
          icon: null,
        }
      );
      break;

    case "queued":
      toast.info(
        <CallNotification type={type} message={message} description={options.description} />,
        {
          duration: 2000,
          icon: null,
        }
      );
      break;

    default:
      toast(message);
  }
}

// Simple confetti effect using CSS animation
function triggerConfetti() {
  // Create confetti container
  const container = document.createElement("div");
  container.className = "fixed inset-0 pointer-events-none z-[100] overflow-hidden";
  container.id = "confetti-container";
  document.body.appendChild(container);

  // Create confetti pieces
  const colors = ["#a855f7", "#22c55e", "#3b82f6", "#eab308", "#ef4444"];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "absolute w-2 h-2 rounded-full animate-confetti";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = "-10px";
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
    container.appendChild(confetti);
  }

  // Remove container after animation
  setTimeout(() => {
    container.remove();
  }, 4000);
}

// Utility functions for common notifications
export const callNotifications = {
  started: (practitionerName: string) =>
    showCallNotification("call_started", { practitionerName }),

  completed: (practitionerName: string, duration?: number) =>
    showCallNotification("call_completed", { practitionerName, duration }),

  failed: (practitionerName: string, reason?: string) =>
    showCallNotification("call_failed", { practitionerName, description: reason }),

  appointmentBooked: (practitionerName: string, appointmentTime?: string) =>
    showCallNotification("appointment_booked", { practitionerName, appointmentTime }),

  campaignStarted: (callCount: number) =>
    showCallNotification("campaign_started", { callCount }),

  campaignCompleted: (bookedCount: number) =>
    showCallNotification("campaign_completed", { bookedCount }),

  campaignPaused: () => showCallNotification("campaign_paused", {}),

  addedToQueue: (practitionerName: string) =>
    showCallNotification("queued", { practitionerName }),
};

// Add confetti animation CSS
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    .animate-confetti {
      animation: confetti-fall linear forwards;
    }
  `;
  document.head.appendChild(style);
}
