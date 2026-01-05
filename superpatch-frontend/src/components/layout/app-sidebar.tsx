"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Building,
  MapPin,
  Package,
  Map,
  FlaskConical,
  GraduationCap,
  Star,
  Search,
  Home,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MarketSwitcher } from "./market-switcher";
import { products } from "@/data/products";
import { MarketId } from "@/types";

// Icon mapping for markets
const marketIcons = {
  d2c: User,
  b2b: Building,
  canadian: MapPin,
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentMarket: MarketId;
  onMarketChange?: (market: MarketId) => void;
}

export function AppSidebar({
  currentMarket,
  onMarketChange,
  ...props
}: AppSidebarProps) {
  const pathname = usePathname();

  // Filter products by current market
  const marketProducts = products.filter((p) =>
    p.markets.includes(currentMarket)
  );

  // Navigation structure
  const navigation = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Products",
      url: `/${currentMarket}/products`,
      icon: Package,
      items: marketProducts.map((p) => ({
        title: `${p.emoji} ${p.name}`,
        url: `/${currentMarket}/products/${p.id}`,
      })),
    },
    {
      title: "Roadmaps",
      url: `/${currentMarket}/roadmaps`,
      icon: Map,
    },
    {
      title: "Clinical Evidence",
      url: "/evidence",
      icon: FlaskConical,
    },
    {
      title: "Practice Mode",
      url: "/practice",
      icon: GraduationCap,
    },
    {
      title: "Favorites",
      url: "/favorites",
      icon: Star,
    },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-sm">
            SP
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground">
              SuperPatch
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              Sales Enablement
            </span>
          </div>
        </div>

        {/* Market Switcher */}
        <MarketSwitcher
          currentMarket={currentMarket}
          onMarketChange={onMarketChange}
        />

        {/* Search Trigger */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full justify-start gap-2 bg-sidebar-accent/50"
              tooltip="Search (⌘K)"
            >
              <Search className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">
                Search...
              </span>
              <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-sidebar-accent px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex group-data-[collapsible=icon]:hidden">
                <span className="text-xs">⌘</span>K
              </kbd>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.url || pathname.startsWith(item.url + "/");

                // If item has sub-items, render as collapsible
                if (item.items && item.items.length > 0) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isActive}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Regular menu item
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
              <span>SuperPatch © 2025</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

