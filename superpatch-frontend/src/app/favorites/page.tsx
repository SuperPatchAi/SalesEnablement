"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, Copy, ArrowRight } from "lucide-react";
import Link from "next/link";

// Placeholder favorites - in real implementation, this would come from localStorage
const sampleFavorites = [
  {
    id: "1",
    type: "script",
    productId: "freedom",
    productName: "Freedom",
    productEmoji: "🔵",
    market: "d2c",
    title: "Cold Call Opening",
    content:
      "Hi [Name], this is [Your Name] from Super Patch. I'm reaching out because we've developed an innovative drug-free solution for pain relief...",
    addedAt: "2025-01-03",
  },
  {
    id: "2",
    type: "objection",
    productId: "rem",
    productName: "REM",
    productEmoji: "🟣",
    market: "b2b",
    title: '"I\'ve tried everything for sleep"',
    content:
      "I hear that a lot. The difference is, this isn't a pill or supplement—it's a completely different technology. In the HARMONI study, 80% of participants stopped their sleep medications...",
    addedAt: "2025-01-02",
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = React.useState(sampleFavorites);

  const handleRemove = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    // In real implementation, show toast notification
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Favorites
          </h1>
          <p className="text-muted-foreground mt-1">
            Your saved scripts and objection handlers
          </p>
        </div>

        {favorites.length === 0 ? (
          /* Empty State */
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Save your most-used scripts and objection responses for quick
                access. Click the star icon on any content to add it here.
              </p>
              <Button asChild>
                <Link href="/d2c/products">
                  Browse Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Favorites List */
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <Card key={favorite.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="secondary">
                          {favorite.productEmoji} {favorite.productName}
                        </Badge>
                        <Badge variant="outline">
                          {favorite.type === "script" ? "📝 Script" : "💬 Objection"}
                        </Badge>
                        <Badge variant="outline">{favorite.market.toUpperCase()}</Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{favorite.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {favorite.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Added {favorite.addedAt}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopy(favorite.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemove(favorite.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <Link
                      href={`/${favorite.market}/products/${favorite.productId}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View full word track →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="py-4 text-center text-sm text-muted-foreground">
            <p>
              💡 <strong>Tip:</strong> Your favorites are stored locally on this
              device. They'll persist even if you close the browser, but won't
              sync across devices.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

