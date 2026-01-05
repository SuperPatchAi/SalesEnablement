import { Market, MarketId } from "@/types";

export const markets: Market[] = [
  {
    id: "d2c",
    name: "Direct to Consumer",
    shortName: "D2C",
    description: "Word tracks for selling directly to end consumers",
    icon: "User",
    productCount: 13,
  },
  {
    id: "b2b",
    name: "B2B Healthcare Practitioners",
    shortName: "B2B",
    description: "Word tracks for selling to healthcare practitioners",
    icon: "Building",
    productCount: 13,
  },
  {
    id: "canadian",
    name: "Canadian Business Wellness",
    shortName: "Canada",
    description: "Word tracks for Canadian corporate wellness programs",
    icon: "MapPin",
    productCount: 1,
  },
];

export const getMarketById = (id: MarketId): Market | undefined => {
  return markets.find((m) => m.id === id);
};

export const isValidMarket = (id: string): id is MarketId => {
  return ["d2c", "b2b", "canadian"].includes(id);
};

// Alias for compatibility
export const MARKETS = markets;

