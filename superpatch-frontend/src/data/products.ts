import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "freedom",
    name: "Freedom",
    tagline: "Drug-Free Pain Relief",
    category: "pain",
    emoji: "🔵",
    color: "#0055B8",
    hasClinicalStudy: true,
    studyName: "RESTORE Study",
    markets: ["d2c", "b2b"],
  },
  {
    id: "rem",
    name: "REM",
    tagline: "Drug-Free Sleep Support",
    category: "sleep",
    emoji: "🟣",
    color: "#652F6C",
    hasClinicalStudy: true,
    studyName: "HARMONI Study",
    markets: ["d2c", "b2b"],
  },
  {
    id: "liberty",
    name: "Liberty",
    tagline: "Drug-Free Balance Support",
    category: "balance",
    emoji: "🟢",
    color: "#66C9BA",
    hasClinicalStudy: true,
    studyName: "Balance Study",
    markets: ["d2c", "b2b"],
  },
  {
    id: "boost",
    name: "Boost",
    tagline: "Drug-Free Energy Support",
    category: "energy",
    emoji: "⚡",
    color: "#FFC629",
    hasClinicalStudy: false,
    markets: ["d2c", "b2b"],
  },
  {
    id: "victory",
    name: "Victory",
    tagline: "Drug-Free Performance Support",
    category: "performance",
    emoji: "🏆",
    color: "#DD0604",
    hasClinicalStudy: false,
    markets: ["d2c", "b2b"],
  },
  {
    id: "focus",
    name: "Focus",
    tagline: "Drug-Free Concentration Support",
    category: "focus",
    emoji: "🎯",
    color: "#009ADE",
    hasClinicalStudy: false,
    markets: ["d2c", "b2b"],
  },
  {
    id: "defend",
    name: "Defend",
    tagline: "Drug-Free Immune Support",
    category: "immunity",
    emoji: "🛡️",
    color: "#66C9BA",
    hasClinicalStudy: false,
    markets: ["d2c", "b2b"],
  },
  {
    id: "ignite",
    name: "Ignite",
    tagline: "Drug-Free Metabolic Support",
    category: "metabolism",
    emoji: "🔥",
    color: "#FFA400",
    hasClinicalStudy: false,
    markets: ["d2c", "b2b"],
  },
  {
    id: "kick-it",
    name: "Kick It",
    tagline: "Drug-Free Willpower Support",
    category: "habits",
    emoji: "✊",
    color: "#4D4D4D",
    hasClinicalStudy: false,
    markets: ["d2c", "b2b"],
  },
  {
    id: "peace",
    name: "Peace",
    tagline: "Drug-Free Stress Support",
    category: "stress",
    emoji: "☮️",
    color: "#652F6C",
    hasClinicalStudy: false,
    markets: ["d2c", "b2b"],
  },
  {
    id: "joy",
    name: "Joy",
    tagline: "Drug-Free Mood Support",
    category: "mood",
    emoji: "😊",
    color: "#FFC629",
    hasClinicalStudy: false,
    markets: ["d2c", "b2b"],
  },
  {
    id: "lumi",
    name: "Lumi",
    tagline: "Drug-Free Beauty Support",
    category: "beauty",
    emoji: "✨",
    color: "#9D1D96",
    hasClinicalStudy: false,
    markets: ["d2c", "b2b"],
  },
  {
    id: "rocket",
    name: "Rocket",
    tagline: "Drug-Free Men's Vitality",
    category: "mens",
    emoji: "🚀",
    color: "#101010",
    hasClinicalStudy: false,
    markets: ["d2c", "b2b"],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductsByMarket = (marketId: string): Product[] => {
  return products.filter((p) => p.markets.includes(marketId as "d2c" | "b2b" | "canadian"));
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category === category);
};

export const getProductsWithStudies = (): Product[] => {
  return products.filter((p) => p.hasClinicalStudy);
};

// Alias for compatibility
export const PRODUCTS = products;

