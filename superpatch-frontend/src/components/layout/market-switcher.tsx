"use client";

import * as React from "react";
import { Check, ChevronsUpDown, User, Building, MapPin } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { markets } from "@/data/markets";
import { MarketId } from "@/types";

const marketIcons: Record<MarketId, React.ElementType> = {
  d2c: User,
  b2b: Building,
  canadian: MapPin,
};

interface MarketSwitcherProps {
  currentMarket: MarketId;
  onMarketChange?: (market: MarketId) => void;
}

export function MarketSwitcher({
  currentMarket,
  onMarketChange,
}: MarketSwitcherProps) {
  const selectedMarket = markets.find((m) => m.id === currentMarket);
  const Icon = marketIcons[currentMarket];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="font-semibold">
                  {selectedMarket?.shortName}
                </span>
                <span className="text-xs text-sidebar-foreground/60">
                  {selectedMarket?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
            align="start"
          >
            {markets.map((market) => {
              const MarketIcon = marketIcons[market.id];
              return (
                <DropdownMenuItem
                  key={market.id}
                  onClick={() => onMarketChange?.(market.id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <MarketIcon className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{market.shortName}</span>
                    <span className="text-xs text-muted-foreground">
                      {market.description}
                    </span>
                  </div>
                  {market.id === currentMarket && (
                    <Check className="ml-auto size-4" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}





