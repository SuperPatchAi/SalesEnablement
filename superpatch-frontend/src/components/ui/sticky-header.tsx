"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Pin,
  PinOff,
} from "lucide-react";

interface StickyHeaderProps {
  children: React.ReactNode;
  className?: string;
  stickyThreshold?: number;
  showShadow?: boolean;
  backdrop?: boolean;
}

export function StickyHeader({
  children,
  className,
  stickyThreshold = 0,
  showShadow = true,
  backdrop = true,
}: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // Get header height for placeholder
    setHeaderHeight(header.offsetHeight);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const headerTop = header.getBoundingClientRect().top + scrollTop;
      setIsSticky(scrollTop > headerTop + stickyThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [stickyThreshold]);

  return (
    <>
      <div
        ref={headerRef}
        className={cn(
          "transition-all duration-200",
          isSticky && [
            "fixed top-0 left-0 right-0 z-50",
            backdrop && "bg-background/95 backdrop-blur-md",
            showShadow && "shadow-md",
          ],
          className
        )}
      >
        {children}
      </div>
      {/* Placeholder to prevent content jump */}
      {isSticky && <div style={{ height: headerHeight }} />}
    </>
  );
}

// Filter context bar that appears when filters are active
interface FilterContextBarProps {
  filters: Array<{
    key: string;
    label: string;
    value: string;
    onClear: () => void;
  }>;
  onClearAll: () => void;
  resultCount?: number;
  className?: string;
}

export function FilterContextBar({
  filters,
  onClearAll,
  resultCount,
  className,
}: FilterContextBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (filters.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "border-b bg-muted/30 overflow-hidden",
          className
        )}
      >
        <div className="px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            {/* Filter indicator */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filters.length} {filters.length === 1 ? "filter" : "filters"} active
              </span>
              {resultCount !== undefined && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-sm font-medium">
                    {resultCount.toLocaleString()} results
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-7 text-xs gap-1"
              >
                {isCollapsed ? (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Hide
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-7 text-xs"
              >
                Clear all
              </Button>
            </div>
          </div>

          {/* Filter pills */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex items-center gap-2 flex-wrap mt-2"
              >
                {filters.map((filter) => (
                  <motion.div
                    key={filter.key}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    layout
                  >
                    <Badge
                      variant="secondary"
                      className="gap-1.5 pr-1 h-6"
                    >
                      <span className="text-muted-foreground text-xs">
                        {filter.label}:
                      </span>
                      <span className="font-medium">{filter.value}</span>
                      <button
                        onClick={filter.onClear}
                        className="ml-1 p-0.5 rounded-full hover:bg-muted-foreground/20 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Page header with sticky behavior and actions
interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
  breadcrumbs,
  sticky = false,
  className,
}: PageHeaderProps) {
  const content = (
    <div className={cn("border-b bg-background", className)}>
      {breadcrumbs && (
        <div className="px-6 pt-4">
          {breadcrumbs}
        </div>
      )}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (sticky) {
    return <StickyHeader>{content}</StickyHeader>;
  }

  return content;
}

// Compact sticky header for sub-sections
interface CompactStickyHeaderProps {
  children: React.ReactNode;
  className?: string;
  pinnable?: boolean;
  defaultPinned?: boolean;
}

export function CompactStickyHeader({
  children,
  className,
  pinnable = false,
  defaultPinned = false,
}: CompactStickyHeaderProps) {
  const [isPinned, setIsPinned] = useState(defaultPinned);
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPinned) {
      setIsSticky(false);
      return;
    }

    const header = headerRef.current;
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );

    // Create a sentinel element
    const sentinel = document.createElement("div");
    sentinel.style.height = "1px";
    header.parentNode?.insertBefore(sentinel, header);
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [isPinned]);

  return (
    <div
      ref={headerRef}
      className={cn(
        "transition-all duration-200",
        isSticky && isPinned && [
          "sticky top-0 z-40",
          "bg-background/95 backdrop-blur-md shadow-sm",
        ],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">{children}</div>
        {pinnable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPinned(!isPinned)}
            className="h-7 w-7 p-0"
          >
            {isPinned ? (
              <PinOff className="w-4 h-4" />
            ) : (
              <Pin className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// Scroll progress indicator
interface ScrollProgressProps {
  className?: string;
  color?: string;
}

export function ScrollProgress({ className, color }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (window.scrollY / totalHeight) * 100;
      setProgress(Math.min(scrollProgress, 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={cn("fixed top-0 left-0 right-0 h-1 z-[100]", className)}>
      <motion.div
        className="h-full bg-primary"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

// Hook for sticky header state
export function useStickyHeader(threshold = 100) {
  const [isSticky, setIsSticky] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine sticky state
      setIsSticky(currentScrollY > threshold);
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection("up");
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { isSticky, scrollDirection };
}
