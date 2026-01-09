"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// Animated button with hover and click effects
interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "success" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  isSuccess?: boolean;
  children: React.ReactNode;
}

export function AnimatedButton({
  variant = "default",
  size = "md",
  isLoading = false,
  isSuccess = false,
  children,
  className,
  disabled,
  onClick,
  type = "button",
}: AnimatedButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </motion.span>
        ) : showSuccess ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Success!</span>
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Pulsing badge for active/live status
interface PulsingBadgeProps {
  children: React.ReactNode;
  isActive?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function PulsingBadge({
  children,
  isActive = true,
  variant = "success",
  className,
}: PulsingBadgeProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  const pulseColors = {
    default: "bg-gray-400",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {isActive && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              pulseColors[variant]
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              pulseColors[variant]
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}

// Animated badge counter (for notifications)
interface CountBadgeProps {
  count: number;
  maxCount?: number;
  variant?: "default" | "primary" | "danger";
  className?: string;
}

export function CountBadge({
  count,
  maxCount = 99,
  variant = "primary",
  className,
}: CountBadgeProps) {
  const displayCount = count > maxCount ? `${maxCount}+` : count;
  const [prevCount, setPrevCount] = useState(count);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (count !== prevCount) {
      setAnimate(true);
      setPrevCount(count);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count, prevCount]);

  const variantClasses = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary text-primary-foreground",
    danger: "bg-red-500 text-white",
  };

  if (count <= 0) return null;

  return (
    <motion.span
      animate={animate ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold",
        variantClasses[variant],
        className
      )}
    >
      {displayCount}
    </motion.span>
  );
}

// Success checkmark animation
interface SuccessCheckmarkProps {
  size?: number;
  className?: string;
}

export function SuccessCheckmark({ size = 60, className }: SuccessCheckmarkProps) {
  return (
    <motion.svg
      className={cn("text-green-500", className)}
      width={size}
      height={size}
      viewBox="0 0 52 52"
    >
      <motion.circle
        cx="26"
        cy="26"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 27 L22 35 L38 19"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.5, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

// Error X animation
interface ErrorXProps {
  size?: number;
  className?: string;
}

export function ErrorX({ size = 60, className }: ErrorXProps) {
  return (
    <motion.svg
      className={cn("text-red-500", className)}
      width={size}
      height={size}
      viewBox="0 0 52 52"
    >
      <motion.circle
        cx="26"
        cy="26"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        d="M17 17 L35 35"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay: 0.5, ease: "easeInOut" }}
      />
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        d="M35 17 L17 35"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay: 0.6, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

// Circular progress spinner with percentage
interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
}

export function CircularProgress({
  progress,
  size = 80,
  strokeWidth = 6,
  className,
  showPercentage = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-primary"
        />
      </svg>
      {showPercentage && (
        <span className="absolute text-sm font-semibold">{Math.round(progress)}%</span>
      )}
    </div>
  );
}

// Typing indicator (chat-style dots)
export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Ripple effect on click
interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function RippleButton({ children, className, onClick, ...props }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples([...ripples, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.(e);
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-md px-4 py-2 bg-primary text-primary-foreground",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, x: 0, y: 0 }}
          animate={{ width: 300, height: 300, x: -150, y: -150, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </button>
  );
}

// Shake animation for errors
interface ShakeProps {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}

export function Shake({ children, trigger = false, className }: ShakeProps) {
  return (
    <motion.div
      animate={trigger ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Bounce animation for attention
interface BounceProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function Bounce({ children, isActive = false, className }: BounceProps) {
  return (
    <motion.div
      animate={isActive ? { y: [0, -10, 0] } : {}}
      transition={isActive ? { duration: 0.5, repeat: Infinity, repeatDelay: 1 } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Glow effect for important elements
interface GlowProps {
  children: React.ReactNode;
  color?: string;
  isActive?: boolean;
  className?: string;
}

export function Glow({
  children,
  color = "rgba(34, 197, 94, 0.5)",
  isActive = true,
  className,
}: GlowProps) {
  return (
    <motion.div
      animate={
        isActive
          ? {
              boxShadow: [
                `0 0 0 0 ${color}`,
                `0 0 20px 5px ${color}`,
                `0 0 0 0 ${color}`,
              ],
            }
          : {}
      }
      transition={isActive ? { duration: 2, repeat: Infinity } : {}}
      className={cn("rounded-lg", className)}
    >
      {children}
    </motion.div>
  );
}

// Number ticker animation
interface NumberTickerProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function NumberTicker({
  value,
  duration = 1,
  className,
  prefix = "",
  suffix = "",
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(Math.round(startValue + diff * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

// Flip card animation
interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped?: boolean;
  className?: string;
}

export function FlipCard({ front, back, isFlipped = false, className }: FlipCardProps) {
  return (
    <div className={cn("relative perspective-1000", className)}>
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
