import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Building,
  MapPin,
  ArrowRight,
  Package,
  Map,
  FlaskConical,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    description: "All 13 SuperPatch products",
    href: "/d2c/products",
    icon: Package,
  },
  {
    title: "Sales Roadmaps",
    description: "Visual process guides",
    href: "/d2c/roadmaps",
    icon: Map,
  },
  {
    title: "Clinical Evidence",
    description: "Study results & talking points",
    href: "/evidence",
    icon: FlaskConical,
  },
  {
    title: "Practice Mode",
    description: "Train objection handling",
    href: "/practice",
    icon: GraduationCap,
  },
];

export default function Home() {
  const productsWithStudies = products.filter((p) => p.hasClinicalStudy);

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Hero Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sales Enablement
          </h1>
          <p className="text-sm text-muted-foreground">
            Word tracks, roadmaps, and clinical evidence for your sales conversations.
          </p>
        </div>

        {/* Market Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {markets.map((market) => {
            const Icon = marketIcons[market.id as keyof typeof marketIcons];
            return (
              <Link key={market.id} href={`/${market.id}/products`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <CardTitle className="text-base">{market.shortName}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {market.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="secondary" className="text-xs">
                      {market.productCount} products
                    </Badge>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Access */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Quick Access</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.title} href={link.href}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{link.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {link.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Products with Studies */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-muted-foreground">
              Products with Clinical Evidence
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {productsWithStudies.map((product) => (
              <Link key={product.id} href={`/d2c/products/${product.id}`}>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative size-10 flex-shrink-0 rounded-full overflow-hidden bg-muted">
                        <Image
                          src={product.image}
                          alt={`${product.name} patch`}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{product.name}</p>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-5 bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                          >
                            {product.studyName}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
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

        {/* Keyboard Shortcut */}
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
