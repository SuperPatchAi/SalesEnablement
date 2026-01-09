"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  showHome?: boolean;
  homeHref?: string;
  className?: string;
}

// Path label mappings
const PATH_LABELS: Record<string, string> = {
  campaign: "Call Center",
  practitioners: "Practitioners",
  pipeline: "Pipeline",
  analytics: "Analytics",
  products: "Products",
  roadmaps: "Roadmaps",
  evidence: "Clinical Evidence",
  practice: "Practice Mode",
  favorites: "Favorites",
  d2c: "D2C Market",
  b2b: "B2B Market",
  canadian: "Canadian Market",
  wellness: "Wellness Program",
  corporate: "Corporate Wellness",
  chiropractors: "Chiropractors",
  naturopaths: "Naturopaths",
  acupuncturists: "Acupuncturists",
  "massage-therapists": "Massage Therapists",
  "functional-medicine": "Functional Medicine",
  "integrative-medicine": "Integrative Medicine",
};

// Generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = PATH_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    const isLast = index === segments.length - 1;

    breadcrumbs.push({
      label,
      href: isLast ? undefined : href,
      current: isLast,
    });
  });

  return breadcrumbs;
}

// Individual breadcrumb item component
function BreadcrumbItemComponent({
  item,
  isAnimated = true,
}: {
  item: BreadcrumbItem;
  isAnimated?: boolean;
}) {
  const content = (
    <span
      className={cn(
        "flex items-center gap-1.5 text-sm",
        item.current
          ? "font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground transition-colors"
      )}
    >
      {item.icon && <item.icon className="w-4 h-4" />}
      <span className="truncate max-w-[150px]">{item.label}</span>
    </span>
  );

  const wrapper = item.href ? (
    <Link href={item.href} className="hover:underline underline-offset-4">
      {content}
    </Link>
  ) : (
    content
  );

  if (isAnimated) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.15 }}
      >
        {wrapper}
      </motion.div>
    );
  }

  return wrapper;
}

// Collapsed items dropdown
function CollapsedItems({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-6 w-6 p-0", className)}
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Show more items</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            {item.href ? (
              <Link href={item.href} className="flex items-center gap-2">
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </Link>
            ) : (
              <span className="flex items-center gap-2">
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Breadcrumbs({
  items,
  separator = <ChevronRight className="w-4 h-4 text-muted-foreground/50" />,
  maxItems = 4,
  showHome = true,
  homeHref = "/",
  className,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Use provided items or generate from pathname
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  // Don't show breadcrumbs on home page
  if (pathname === "/" || breadcrumbItems.length === 0) {
    return null;
  }

  // Add home item if enabled
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: "Home", href: homeHref, icon: Home }, ...breadcrumbItems]
    : breadcrumbItems;

  // Handle collapsing if too many items
  let displayItems = allItems;
  let collapsedItems: BreadcrumbItem[] = [];

  if (allItems.length > maxItems) {
    // Keep first, collapsed middle, and last items
    const firstItem = allItems[0];
    const lastItems = allItems.slice(-2);
    collapsedItems = allItems.slice(1, -2);
    displayItems = [firstItem, ...lastItems];
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-sm overflow-x-auto scrollbar-hide",
        className
      )}
    >
      <ol className="flex items-center gap-1.5">
        <AnimatePresence mode="popLayout">
          {displayItems.map((item, index) => {
            const isFirst = index === 0;
            const showCollapsed = isFirst && collapsedItems.length > 0;

            return (
              <React.Fragment key={item.label + index}>
                <li className="flex items-center gap-1.5">
                  <BreadcrumbItemComponent item={item} />
                </li>

                {/* Show collapsed items dropdown after first item */}
                {showCollapsed && (
                  <>
                    <li className="flex items-center gap-1.5" aria-hidden="true">
                      {separator}
                    </li>
                    <li>
                      <CollapsedItems items={collapsedItems} />
                    </li>
                  </>
                )}

                {/* Separator */}
                {index < displayItems.length - 1 && (
                  <li className="flex items-center gap-1.5" aria-hidden="true">
                    {separator}
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </AnimatePresence>
      </ol>
    </nav>
  );
}

// Simple inline breadcrumb variant
export function InlineBreadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground hover:underline underline-offset-2 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="mx-1">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Breadcrumb with back button
export function BreadcrumbWithBack({
  backHref,
  backLabel = "Back",
  currentLabel,
  className,
}: {
  backHref: string;
  backLabel?: string;
  currentLabel: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="ghost" size="sm" asChild className="gap-1.5 h-8">
        <Link href={backHref}>
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>{backLabel}</span>
        </Link>
      </Button>
      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
      <span className="text-sm font-medium">{currentLabel}</span>
    </div>
  );
}

// Hook for programmatic breadcrumb management
export function useBreadcrumbs() {
  const pathname = usePathname();
  const [customItems, setCustomItems] = React.useState<BreadcrumbItem[]>([]);

  const setBreadcrumbs = React.useCallback((items: BreadcrumbItem[]) => {
    setCustomItems(items);
  }, []);

  const addBreadcrumb = React.useCallback((item: BreadcrumbItem) => {
    setCustomItems((prev) => [...prev, item]);
  }, []);

  const clearBreadcrumbs = React.useCallback(() => {
    setCustomItems([]);
  }, []);

  const items = customItems.length > 0 ? customItems : generateBreadcrumbs(pathname);

  return {
    items,
    setBreadcrumbs,
    addBreadcrumb,
    clearBreadcrumbs,
    pathname,
  };
}
