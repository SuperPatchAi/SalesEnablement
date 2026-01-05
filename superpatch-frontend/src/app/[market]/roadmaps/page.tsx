import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, Map } from "lucide-react";
import { getProductsByMarket } from "@/data/products";
import { getMarketById, isValidMarket } from "@/data/markets";
import { MarketId } from "@/types";
import { notFound } from "next/navigation";

interface RoadmapsPageProps {
  params: Promise<{ market: string }>;
}

export default async function RoadmapsPage({ params }: RoadmapsPageProps) {
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
        <div>
          <Badge variant="secondary" className="mb-2">
            {marketInfo?.shortName}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Sales Roadmaps
          </h1>
          <p className="text-muted-foreground mt-1">
            Visual guides for the {marketInfo?.name} sales process
          </p>
        </div>

        {/* Roadmaps Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {marketProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Placeholder thumbnail */}
              <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Map className="h-12 w-12 mb-2" />
                  <span className="text-4xl mb-2">{product.emoji}</span>
                  <span className="font-bold">{product.name}</span>
                  <span className="text-sm">Roadmap</span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button variant="secondary" size="sm">
                    <ZoomIn className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="secondary" size="icon" className="h-9 w-9">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.tagline}
                    </p>
                  </div>
                  <Badge
                    style={{
                      backgroundColor: product.color,
                      color: "white",
                    }}
                  >
                    {product.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note about images */}
        <Card className="bg-muted/50">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              📷 Roadmap images will be loaded from the generated PNG files.
              <br />
              Click on any roadmap to view it full-screen with zoom capability.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

