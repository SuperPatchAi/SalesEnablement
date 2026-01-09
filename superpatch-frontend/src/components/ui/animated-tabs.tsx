"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Enhanced Tabs Root
const AnimatedTabs = TabsPrimitive.Root;

// Enhanced Tabs List with animated indicator
interface AnimatedTabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  indicatorClassName?: string;
}

const AnimatedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  AnimatedTabsListProps
>(({ className, indicatorClassName, children, ...props }, ref) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);

  // Update indicator position when tabs change
  useEffect(() => {
    const updateIndicator = () => {
      if (!tabsRef.current) return;
      
      const activeTab = tabsRef.current.querySelector('[data-state="active"]');
      if (activeTab) {
        const rect = activeTab.getBoundingClientRect();
        const parentRect = tabsRef.current.getBoundingClientRect();
        setIndicatorStyle({
          left: rect.left - parentRect.left,
          width: rect.width,
        });
      }
    };

    // Initial update
    updateIndicator();

    // Create observer for tab changes
    const observer = new MutationObserver(updateIndicator);
    if (tabsRef.current) {
      observer.observe(tabsRef.current, {
        attributes: true,
        subtree: true,
        attributeFilter: ["data-state"],
      });
    }

    // Also listen for resize
    window.addEventListener("resize", updateIndicator);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [children]);

  return (
    <TabsPrimitive.List
      ref={(node) => {
        // Handle both refs
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
        (tabsRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cn(
        "relative inline-flex h-12 items-center justify-start gap-1 bg-transparent p-0",
        className
      )}
      {...props}
    >
      {/* Animated underline indicator */}
      <motion.div
        className={cn(
          "absolute bottom-0 h-0.5 bg-primary rounded-full",
          indicatorClassName
        )}
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 40,
        }}
      />
      {children}
    </TabsPrimitive.List>
  );
});
AnimatedTabsList.displayName = "AnimatedTabsList";

// Enhanced Tab Trigger with badge support
interface AnimatedTabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  badge?: number | string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const AnimatedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  AnimatedTabsTriggerProps
>(({ className, children, badge, badgeVariant = "secondary", icon, isLoading, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2",
        "text-sm font-medium text-muted-foreground transition-all",
        "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:text-foreground",
        className
      )}
      {...props}
    >
      {/* Content wrapper for animations */}
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Icon */}
        {icon && (
          <span className="flex-shrink-0">
            {isLoading ? (
              <motion.div
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              icon
            )}
          </span>
        )}

        {/* Label */}
        <span>{children}</span>

        {/* Badge */}
        {badge !== undefined && badge !== 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Badge
              variant={badgeVariant}
              className="h-5 min-w-[20px] px-1.5 text-xs"
            >
              {badge}
            </Badge>
          </motion.div>
        )}
      </motion.div>
    </TabsPrimitive.Trigger>
  );
});
AnimatedTabsTrigger.displayName = "AnimatedTabsTrigger";

// Enhanced Tab Content with animation
interface AnimatedTabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  animation?: "fade" | "slide" | "scale" | "none";
}

const AnimatedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  AnimatedTabsContentProps
>(({ className, children, animation = "fade", ...props }, ref) => {
  const animationVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.98 },
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
    },
  };

  const variants = animationVariants[animation];

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={props.value}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </TabsPrimitive.Content>
  );
});
AnimatedTabsContent.displayName = "AnimatedTabsContent";

// Keyboard navigation hook for tabs
export function useTabKeyboardNavigation(
  tabsCount: number,
  onChange?: (index: number) => void
) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      let newIndex = activeIndex;

      switch (e.key) {
        case "ArrowLeft":
          newIndex = activeIndex > 0 ? activeIndex - 1 : tabsCount - 1;
          break;
        case "ArrowRight":
          newIndex = activeIndex < tabsCount - 1 ? activeIndex + 1 : 0;
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = tabsCount - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      setActiveIndex(newIndex);
      onChange?.(newIndex);
    },
    [activeIndex, tabsCount, onChange]
  );

  return { activeIndex, setActiveIndex, handleKeyDown };
}

// Pill-style tabs variant
interface PillTabsProps {
  tabs: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number | string;
  }>;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function PillTabs({ tabs, value, onValueChange, className }: PillTabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-lg bg-muted",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;

        return (
          <button
            key={tab.value}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              "relative inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md",
              "transition-colors duration-200",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Active background */}
            {isActive && (
              <motion.div
                layoutId="pill-tab-bg"
                className="absolute inset-0 bg-background rounded-md shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && tab.badge !== 0 && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="h-5 px-1.5 text-xs"
                >
                  {tab.badge}
                </Badge>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Segmented control variant
interface SegmentedControlProps {
  options: Array<{
    value: string;
    label: string;
  }>;
  value: string;
  onValueChange: (value: string) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onValueChange,
  size = "md",
  className,
}: SegmentedControlProps) {
  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-10 text-sm",
    lg: "h-12 text-base",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border bg-muted p-0.5",
        className
      )}
    >
      {options.map((option, index) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "relative inline-flex items-center justify-center px-4 font-medium rounded-md",
              "transition-colors duration-200",
              sizeClasses[size],
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="segment-bg"
                className="absolute inset-0 bg-background rounded-md shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Step tabs for wizard-style navigation
interface StepTabsProps {
  steps: Array<{
    value: string;
    label: string;
    description?: string;
    completed?: boolean;
  }>;
  currentStep: string;
  onStepChange?: (step: string) => void;
  className?: string;
}

export function StepTabs({
  steps,
  currentStep,
  onStepChange,
  className,
}: StepTabsProps) {
  const currentIndex = steps.findIndex((s) => s.value === currentStep);

  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, index) => {
        const isActive = step.value === currentStep;
        const isPast = index < currentIndex || step.completed;
        const isClickable = isPast || index === currentIndex + 1;

        return (
          <React.Fragment key={step.value}>
            <button
              onClick={() => isClickable && onStepChange?.(step.value)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-3 transition-colors",
                isClickable && "cursor-pointer",
                !isClickable && "cursor-not-allowed opacity-50"
              )}
            >
              {/* Step number */}
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  "transition-colors duration-200",
                  isActive && "bg-primary text-primary-foreground",
                  isPast && !isActive && "bg-green-500 text-white",
                  !isActive && !isPast && "bg-muted text-muted-foreground"
                )}
              >
                {isPast && !isActive ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Step label */}
              <div className="text-left">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isActive && "text-foreground",
                    !isActive && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4",
                  isPast ? "bg-green-500" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export {
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
  AnimatedTabsContent,
};
