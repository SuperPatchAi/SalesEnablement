import { notFound } from "next/navigation";
import Image from "next/image";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Maximize2 } from "lucide-react";
import { PRODUCTS } from "@/data/products";

const MARKETS: Record<string, { name: string; description: string }> = {
  d2c: {
    name: "D2C Sales",
    description: "Direct-to-consumer sales process visualizations",
  },
  b2b: {
    name: "B2B Healthcare",
    description: "Healthcare practitioner sales process visualizations",
  },
  canadian: {
    name: "Canadian Business",
    description: "Canadian corporate wellness sales visualizations",
  },
};

export default async function RoadmapsPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;

  if (!MARKETS[market]) {
    notFound();
  }

  const marketInfo = MARKETS[market];

  // For Canadian market, there's only one roadmap
  const roadmaps =
    market === "canadian"
      ? [
          {
            id: "wellness",
            name: "Canadian Business Wellness",
            description: "Corporate wellness program sales process",
            emoji: "🍁",
          },
        ]
      : PRODUCTS.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.tagline,
          emoji: p.emoji,
        }));

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {marketInfo.name} Roadmaps
          </h1>
          <p className="text-sm text-muted-foreground">
            {marketInfo.description}
          </p>
        </div>

        {/* Roadmap Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="group overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{roadmap.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm font-medium truncate">
                      {roadmap.name}
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                      {roadmap.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Image Preview */}
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                    <div className="text-center p-4">
                      <p className="font-medium">{roadmap.name} Roadmap</p>
                      <p className="text-[10px] mt-1">4K visualization</p>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" size="sm">
                          <Maximize2 className="size-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <span>{roadmap.emoji}</span>
                            {roadmap.name} Sales Roadmap
                          </DialogTitle>
                          <DialogDescription>
                            {roadmap.description} - {marketInfo.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative aspect-[16/9] bg-muted rounded-lg overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                              <p className="text-lg font-medium">
                                {roadmap.name} Roadmap
                              </p>
                              <p className="text-sm mt-2">
                                4K visualization would display here
                              </p>
                              <Badge variant="outline" className="mt-3">
                                3840 × 2160 px
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="secondary" size="sm" asChild>
                      <a
                        href={`/roadmaps/${market}/${roadmap.id}.png`}
                        download
                      >
                        <Download className="size-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-muted/30 mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">About These Roadmaps</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>
              Each roadmap provides a step-by-step visual guide for the sales
              process, from initial contact to close and follow-up.
            </p>
            <p>
              <strong>Resolution:</strong> 4K (3840×2160) for print and
              presentation quality.
            </p>
            <p>
              <strong>Usage:</strong> Display during training, print for desk
              reference, or share digitally.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
