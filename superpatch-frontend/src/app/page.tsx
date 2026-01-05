import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Building, MapPin, ArrowRight, Package, Map, FlaskConical, GraduationCap } from "lucide-react";
import Link from "next/link";
import { markets } from "@/data/markets";
import { products } from "@/data/products";

const marketIcons = {
  d2c: User,
  b2b: Building,
  canadian: MapPin,
};

const quickLinks = [
  {
    title: "Browse Products",
    description: "View all 13 SuperPatch products",
    href: "/d2c/products",
    icon: Package,
    color: "bg-primary",
  },
  {
    title: "Sales Roadmaps",
    description: "Visual sales process guides",
    href: "/d2c/roadmaps",
    icon: Map,
    color: "bg-sp-teal",
  },
  {
    title: "Clinical Evidence",
    description: "Study results and talking points",
    href: "/evidence",
    icon: FlaskConical,
    color: "bg-sp-purple",
  },
  {
    title: "Practice Mode",
    description: "Train objection handling",
    href: "/practice",
    icon: GraduationCap,
    color: "bg-sp-gold",
  },
];

export default function Home() {
  const productsWithStudies = products.filter((p) => p.hasClinicalStudy);

  return (
    <AppShell>
      <div className="flex flex-col gap-8 p-6 md:p-8 lg:p-10">
        {/* Hero Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Sales Enablement
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Your comprehensive reference for SuperPatch word tracks, objection
            handling, and sales roadmaps. Choose a market to get started.
          </p>
        </div>

        {/* Market Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {markets.map((market) => {
            const Icon = marketIcons[market.id as keyof typeof marketIcons];
            return (
              <Link key={market.id} href={`/${market.id}/products`}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{market.shortName}</CardTitle>
                        <CardDescription>{market.name}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {market.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {market.productCount} products
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.title} href={link.href}>
                  <Card className="h-full group cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/30">
                    <CardContent className="pt-6">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.color} text-white mb-3`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold mb-1">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Products with Clinical Studies */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Products with Clinical Evidence</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productsWithStudies.map((product) => (
              <Link key={product.id} href={`/d2c/products/${product.id}`}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{product.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700 border-green-200"
                          >
                            📊 {product.studyName}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {product.tagline}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Press</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              <span className="text-xs">⌘</span>K
            </kbd>
            <span>to search</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
