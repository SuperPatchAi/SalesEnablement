"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  Phone,
  PhoneOff,
  BarChart3,
  Users,
  MapPin,
  Calendar,
  Filter,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Reusable empty state wrapper
export function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: "py-6",
    md: "py-12",
    lg: "py-20",
  };

  const iconSizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-4",
        sizeClasses[size],
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "mb-4 text-muted-foreground/50 animate-scale-in",
            iconSizes[size]
          )}
        >
          {icon}
        </div>
      )}
      <h3 className="font-semibold text-lg mb-1 animate-slide-up">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm animate-slide-up" style={{ animationDelay: "50ms" }}>
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
          {action && (
            <Button onClick={action.onClick} className="gap-2">
              {action.icon}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// SVG Illustrations
function SearchIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="85" cy="85" r="50" stroke="currentColor" strokeWidth="8" strokeOpacity="0.3" />
      <circle cx="85" cy="85" r="30" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2" />
      <line
        x1="120"
        y1="120"
        x2="160"
        y2="160"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      <circle cx="85" cy="85" r="8" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

function PhoneIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="60"
        y="30"
        width="80"
        height="140"
        rx="12"
        stroke="currentColor"
        strokeWidth="6"
        strokeOpacity="0.3"
      />
      <rect
        x="72"
        y="45"
        width="56"
        height="90"
        rx="4"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <circle cx="100" cy="150" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
      {/* Sound waves */}
      <path
        d="M145 70 Q160 85 145 100"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeOpacity="0.2"
      />
      <path
        d="M155 60 Q175 85 155 110"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeOpacity="0.15"
      />
    </svg>
  );
}

function ChartIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bars */}
      <rect x="30" y="120" width="25" height="50" rx="4" fill="currentColor" fillOpacity="0.2" />
      <rect x="65" y="90" width="25" height="80" rx="4" fill="currentColor" fillOpacity="0.25" />
      <rect x="100" y="60" width="25" height="110" rx="4" fill="currentColor" fillOpacity="0.3" />
      <rect x="135" y="100" width="25" height="70" rx="4" fill="currentColor" fillOpacity="0.25" />
      {/* Line */}
      <path
        d="M42 100 L77 70 L112 40 L147 80"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.4"
      />
      {/* Dots */}
      <circle cx="42" cy="100" r="5" fill="currentColor" fillOpacity="0.5" />
      <circle cx="77" cy="70" r="5" fill="currentColor" fillOpacity="0.5" />
      <circle cx="112" cy="40" r="5" fill="currentColor" fillOpacity="0.5" />
      <circle cx="147" cy="80" r="5" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

function MapIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Map background */}
      <rect
        x="30"
        y="40"
        width="140"
        height="120"
        rx="8"
        stroke="currentColor"
        strokeWidth="4"
        strokeOpacity="0.2"
      />
      {/* Roads */}
      <line x1="30" y1="80" x2="170" y2="80" stroke="currentColor" strokeWidth="2" strokeOpacity="0.15" />
      <line x1="30" y1="120" x2="170" y2="120" stroke="currentColor" strokeWidth="2" strokeOpacity="0.15" />
      <line x1="70" y1="40" x2="70" y2="160" stroke="currentColor" strokeWidth="2" strokeOpacity="0.15" />
      <line x1="130" y1="40" x2="130" y2="160" stroke="currentColor" strokeWidth="2" strokeOpacity="0.15" />
      {/* Pin */}
      <path
        d="M100 60 C100 45 115 45 115 60 C115 70 100 85 100 85 C100 85 85 70 85 60 C85 45 100 45 100 60"
        fill="currentColor"
        fillOpacity="0.4"
      />
      <circle cx="100" cy="60" r="5" fill="white" fillOpacity="0.8" />
    </svg>
  );
}

function CalendarIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="35"
        y="50"
        width="130"
        height="110"
        rx="12"
        stroke="currentColor"
        strokeWidth="6"
        strokeOpacity="0.3"
      />
      <line x1="35" y1="85" x2="165" y2="85" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2" />
      {/* Calendar hooks */}
      <rect x="60" y="38" width="8" height="24" rx="4" fill="currentColor" fillOpacity="0.3" />
      <rect x="132" y="38" width="8" height="24" rx="4" fill="currentColor" fillOpacity="0.3" />
      {/* Days grid */}
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2, 3, 4, 5, 6].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={48 + col * 16}
            y={95 + row * 12}
            width="10"
            height="8"
            rx="2"
            fill="currentColor"
            fillOpacity={row === 2 && col === 3 ? 0.5 : 0.1}
          />
        ))
      )}
    </svg>
  );
}

function UsersIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center person */}
      <circle cx="100" cy="70" r="25" stroke="currentColor" strokeWidth="5" strokeOpacity="0.3" />
      <path
        d="M60 140 Q60 110 100 110 Q140 110 140 140"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeOpacity="0.3"
      />
      {/* Left person */}
      <circle cx="55" cy="85" r="18" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2" />
      <path
        d="M30 140 Q30 115 55 115 Q80 115 80 140"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeOpacity="0.2"
      />
      {/* Right person */}
      <circle cx="145" cy="85" r="18" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2" />
      <path
        d="M120 140 Q120 115 145 115 Q170 115 170 140"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeOpacity="0.2"
      />
    </svg>
  );
}

// Pre-built empty states for common scenarios
export function NoPractitionersFound({
  onClearFilters,
  onRefresh,
}: {
  onClearFilters?: () => void;
  onRefresh?: () => void;
}) {
  return (
    <EmptyState
      icon={<SearchIllustration className="w-full h-full" />}
      title="No practitioners found"
      description="Try adjusting your filters or search terms to find what you're looking for."
      action={
        onClearFilters
          ? {
              label: "Clear Filters",
              onClick: onClearFilters,
              icon: <Filter className="w-4 h-4" />,
            }
          : undefined
      }
      secondaryAction={
        onRefresh
          ? {
              label: "Refresh",
              onClick: onRefresh,
            }
          : undefined
      }
    />
  );
}

export function NoCallsYet({
  onStartCampaign,
}: {
  onStartCampaign?: () => void;
}) {
  return (
    <EmptyState
      icon={<PhoneIllustration className="w-full h-full" />}
      title="No calls yet"
      description="Start a campaign to begin making calls to practitioners and tracking your progress."
      action={
        onStartCampaign
          ? {
              label: "Start Campaign",
              onClick: onStartCampaign,
              icon: <Phone className="w-4 h-4" />,
            }
          : undefined
      }
    />
  );
}

export function NoAnalyticsData({
  onMakeCalls,
}: {
  onMakeCalls?: () => void;
}) {
  return (
    <EmptyState
      icon={<ChartIllustration className="w-full h-full" />}
      title="No analytics data"
      description="Analytics will appear here once you start making calls and collecting data."
      action={
        onMakeCalls
          ? {
              label: "Start Making Calls",
              onClick: onMakeCalls,
              icon: <Phone className="w-4 h-4" />,
            }
          : undefined
      }
    />
  );
}

export function NoActivityYet() {
  return (
    <EmptyState
      icon={<Sparkles className="w-16 h-16" />}
      title="No recent activity"
      description="Activity will appear here as calls are made and appointments are booked."
      size="sm"
    />
  );
}

export function NoPipelineData({
  onAddToQueue,
}: {
  onAddToQueue?: () => void;
}) {
  return (
    <EmptyState
      icon={<UsersIllustration className="w-full h-full" />}
      title="Pipeline is empty"
      description="Add practitioners to your call queue to see them organized by status here."
      action={
        onAddToQueue
          ? {
              label: "Add to Queue",
              onClick: onAddToQueue,
              icon: <Plus className="w-4 h-4" />,
            }
          : undefined
      }
    />
  );
}

export function NoMapData({
  onLoadPractitioners,
}: {
  onLoadPractitioners?: () => void;
}) {
  return (
    <EmptyState
      icon={<MapIllustration className="w-full h-full" />}
      title="No locations to display"
      description="Practitioner locations will appear on the map once data is loaded."
      action={
        onLoadPractitioners
          ? {
              label: "Load Practitioners",
              onClick: onLoadPractitioners,
              icon: <RefreshCw className="w-4 h-4" />,
            }
          : undefined
      }
    />
  );
}

export function NoAppointmentsBooked() {
  return (
    <EmptyState
      icon={<CalendarIllustration className="w-full h-full" />}
      title="No appointments booked yet"
      description="Booked appointments will appear here once practitioners confirm interest."
      size="md"
    />
  );
}

export function QueueEmpty({
  onAddPractitioners,
}: {
  onAddPractitioners?: () => void;
}) {
  return (
    <EmptyState
      icon={<PhoneOff className="w-16 h-16" />}
      title="Queue is empty"
      description="Select practitioners from the list and add them to the call queue to get started."
      action={
        onAddPractitioners
          ? {
              label: "Browse Practitioners",
              onClick: onAddPractitioners,
              icon: <Users className="w-4 h-4" />,
            }
          : undefined
      }
      size="sm"
    />
  );
}

// Generic error state
export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading the data. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="6" strokeOpacity="0.3" />
          <line x1="75" y1="75" x2="125" y2="125" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.4" />
          <line x1="125" y1="75" x2="75" y2="125" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.4" />
        </svg>
      }
      title={title}
      description={description}
      action={
        onRetry
          ? {
              label: "Try Again",
              onClick: onRetry,
              icon: <RefreshCw className="w-4 h-4" />,
            }
          : undefined
      }
    />
  );
}
