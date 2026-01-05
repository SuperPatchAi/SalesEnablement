import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import Link from "next/link";
import { products, getProductsByMarket } from "@/data/products";
import { getMarketById, isValidMarket } from "@/data/markets";
import { MarketId, ProductCategory } from "@/types";
import { notFound } from "next/navigation";

interface ProductsPageProps {
  params: Promise<{ market: string }>;
}

const categories: { id: ProductCategory | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "📦" },
  { id: "pain", label: "Pain", emoji: "🔵" },
  { id: "sleep", label: "Sleep", emoji: "🟣" },
  { id: "energy", label: "Energy", emoji: "⚡" },
  { id: "balance", label: "Balance", emoji: "🟢" },
  { id: "focus", label: "Focus", emoji: "🎯" },
  { id: "mood", label: "Mood", emoji: "😊" },
  { id: "stress", label: "Stress", emoji: "☮️" },
  { id: "immunity", label: "Immunity", emoji: "🛡️" },
  { id: "metabolism", label: "Metabolism", emoji: "🔥" },
  { id: "habits", label: "Habits", emoji: "✊" },
  { id: "beauty", label: "Beauty", emoji: "✨" },
  { id: "mens", label: "Men's", emoji: "🚀" },
  { id: "performance", label: "Performance", emoji: "🏆" },
];

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { market } = await params;

  if (!isValidMarket(market)) {
    notFound();
  }

  const marketInfo = getMarketById(market as MarketId);
  const marketProducts = getProductsByMarket(market);

  return (
    <AppShell defaultMarket={market as MarketId}>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">
              {marketInfo?.shortName}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              Products
            </h1>
            <p className="text-muted-foreground mt-1">
              {marketProducts.length} products available for {marketInfo?.name}
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <div className="overflow-x-auto pb-2">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="h-auto flex-wrap gap-1">
                {categories.slice(0, 8).map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="text-xs px-3 py-1.5"
                  >
                    <span className="mr-1">{cat.emoji}</span>
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {marketProducts.map((product) => (
            <Link
              key={product.id}
              href={`/${market}/products/${product.id}`}
            >
              <Card className="group h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{product.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {product.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: product.color,
                        color: product.color,
                      }}
                    >
                      {product.category}
                    </Badge>
                    {product.hasClinicalStudy && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        📊 Study
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

