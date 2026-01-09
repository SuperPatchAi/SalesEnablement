"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Animation variants
const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
};

// Animation types
type AnimationType = "fade" | "slideUp" | "slideRight" | "scale";

const animationVariants: Record<AnimationType, Variants> = {
  fade: fadeVariants,
  slideUp: slideUpVariants,
  slideRight: slideRightVariants,
  scale: scaleVariants,
};

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
}

export function PageTransition({
  children,
  className,
  animation = "fade",
}: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Tab content transition
interface TabTransitionProps {
  children: React.ReactNode;
  tabKey: string;
  className?: string;
}

export function TabTransition({ children, tabKey, className }: TabTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Staggered list container
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.05,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered list item
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export function StaggerItem({ children, className, index = 0 }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Card hover animation
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverScale?: number;
}

export function AnimatedCard({
  children,
  className,
  onClick,
  hoverScale = 1.02,
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{ scale: hoverScale, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </motion.div>
  );
}

// Collapsible section with animation
interface CollapsibleSectionProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

export function CollapsibleSection({
  children,
  isOpen,
  className,
}: CollapsibleSectionProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("overflow-hidden", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Presence animation for mounting/unmounting
interface PresenceProps {
  children: React.ReactNode;
  isPresent: boolean;
  animation?: AnimationType;
  className?: string;
}

export function Presence({
  children,
  isPresent,
  animation = "fade",
  className,
}: PresenceProps) {
  return (
    <AnimatePresence>
      {isPresent && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants[animation]}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Number counter animation
interface CounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 1, className }: CounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        key={value}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  );
}

// Progress bar animation
interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}

export function AnimatedProgress({
  value,
  max = 100,
  className,
  barClassName,
}: AnimatedProgressProps) {
  const percentage = (value / max) * 100;

  return (
    <div className={cn("w-full bg-muted rounded-full h-2 overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn("h-full bg-primary rounded-full", barClassName)}
      />
    </div>
  );
}

// Skeleton shimmer with motion
export function MotionSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("bg-muted rounded-md relative overflow-hidden", className)}
      animate={{
        backgroundPosition: ["200% 0", "-200% 0"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

// Notification/toast entrance animation
interface NotificationEntranceProps {
  children: React.ReactNode;
  className?: string;
}

export function NotificationEntrance({
  children,
  className,
}: NotificationEntranceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Floating action button animation
interface FloatingButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function FloatingButton({
  children,
  className,
  onClick,
}: FloatingButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// List item with swipe-to-delete animation
interface SwipeableItemProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  className?: string;
}

export function SwipeableItem({
  children,
  onSwipeLeft,
  className,
}: SwipeableItemProps) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -100, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -50 && onSwipeLeft) {
          onSwipeLeft();
        }
      }}
      className={cn("touch-pan-y", className)}
    >
      {children}
    </motion.div>
  );
}

// Pulse animation for highlighting
interface PulseHighlightProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function PulseHighlight({
  children,
  isActive = false,
  className,
}: PulseHighlightProps) {
  return (
    <motion.div
      animate={
        isActive
          ? {
              boxShadow: [
                "0 0 0 0 rgba(34, 197, 94, 0.4)",
                "0 0 0 10px rgba(34, 197, 94, 0)",
                "0 0 0 0 rgba(34, 197, 94, 0)",
              ],
            }
          : {}
      }
      transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Export AnimatePresence for external use
export { AnimatePresence };
