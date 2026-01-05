import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Users,
  MessageSquare,
  HelpCircle,
  Presentation,
  ShieldQuestion,
  CheckCircle,
  Calendar,
  Quote,
  Zap,
  Copy,
  Star,
  Map,
  FlaskConical,
} from "lucide-react";
import Link from "next/link";
import { getProductById, products } from "@/data/products";
import { isValidMarket } from "@/data/markets";
import { MarketId } from "@/types";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{ market: string; product: string }>;
}

const sections = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "opening", label: "Opening", icon: MessageSquare },
  { id: "objections", label: "Objections", icon: ShieldQuestion },
  { id: "closing", label: "Closing", icon: CheckCircle },
];

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { market, product: productId } = await params;

  if (!isValidMarket(market)) {
    notFound();
  }

  const product = getProductById(productId);

  if (!product || !product.markets.includes(market as MarketId)) {
    notFound();
  }

  return (
    <AppShell defaultMarket={market as MarketId}>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {/* Product Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{product.emoji}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {product.name}
                </h1>
                {product.hasClinicalStudy && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-5 bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                  >
                    <FlaskConical className="size-3 mr-0.5" />
                    {product.studyName}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {product.tagline}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5"
                  style={{
                    borderColor: product.color + "40",
                    color: product.color,
                    backgroundColor: product.color + "10",
                  }}
                >
                  {product.category}
                </Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                  {market.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${market}/roadmaps`}>
                <Map className="size-4 mr-1.5" />
                Roadmap
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="size-8">
              <Star className="size-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Word Track Tabs */}
        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="h-9 w-full justify-start rounded-none border-b bg-transparent p-0">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  <Icon className="size-4 mr-1.5" />
                  {section.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Product Overview</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <p>
                    <strong>{product.name}</strong> uses Vibrotactile Technology
                    (VTT) to provide drug-free support for {product.category}-related
                    concerns.
                  </p>
                  <div>
                    <p className="font-medium mb-1.5">How VTT Works</p>
                    <p className="text-muted-foreground">
                      The patch contains a specific pattern that, when in contact
                      with the skin, creates a subtle vibrotactile signal that
                      interacts with the body's nervous system.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1.5">Key Differentiators</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• 100% drug-free and non-invasive</li>
                      <li>• No side effects or contraindications</li>
                      <li>• Can be used alongside other treatments</li>
                      <li>• Immediate application</li>
                      {product.hasClinicalStudy && (
                        <li>• Backed by clinical research ({product.studyName})</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="size-4" />
                    Quick Reference
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-4">
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Key Benefits
                    </p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="size-3 text-green-600" />
                        Drug-free {product.category} support
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="size-3 text-green-600" />
                        No contraindications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="size-3 text-green-600" />
                        Works within hours
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="size-3 text-green-600" />
                        Lasts up to 24 hours
                      </li>
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Ideal Customer
                    </p>
                    <p className="text-muted-foreground">
                      People seeking natural alternatives for {product.category}{" "}
                      support, those who want to avoid medications, and
                      health-conscious individuals.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Opening Scripts Tab */}
          <TabsContent value="opening" className="mt-4 space-y-3">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">📞 Cold Call Script</CardTitle>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Copy className="size-4" />
                  </Button>
                </div>
                <CardDescription>Initial outreach call</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                  {`"Hi [Name], this is [Your Name] from Super Patch. 

I'm reaching out because we've developed an innovative drug-free solution for ${product.category} that's getting remarkable results.

Do you have 2 minutes to hear how it works?"`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">🤝 Referral Opening</CardTitle>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Copy className="size-4" />
                  </Button>
                </div>
                <CardDescription>Following up on a referral</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                  {`"Hi [Name], [Referrer] mentioned you might be interested in a drug-free ${product.category} solution.

They thought our ${product.name} patch could be a great fit. Would you like to hear more?"`}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Objections Tab */}
          <TabsContent value="objections" className="mt-4 space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      "It's too expensive"
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Copy className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Response
                    </p>
                    <p className="text-muted-foreground">
                      "I understand cost is a consideration. What are you currently
                      spending on {product.category} solutions? When you factor in
                      effectiveness and being completely drug-free, most people find
                      it's quite economical."
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      💡 Psychology
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Validates concern, shifts focus to value and total cost.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">"Does it really work?"</CardTitle>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Copy className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Response
                    </p>
                    <p className="text-muted-foreground">
                      "I appreciate your skepticism. Yes, it works, and we have{" "}
                      {product.hasClinicalStudy
                        ? `clinical studies to back it up. The ${product.studyName} showed significant results.`
                        : "thousands of satisfied customers."}{" "}
                      Want to try it risk-free?
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      💡 Psychology
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Compliments skepticism, provides evidence, offers trial.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Closing Tab */}
          <TabsContent value="closing" className="mt-4 space-y-3">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Assumptive Close</CardTitle>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Copy className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                  {`"Great! Should I set you up with a single pack to start, or does the 3-pack make more sense since it includes free shipping?"`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Trial Close</CardTitle>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Copy className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                  {`"We have a satisfaction guarantee, so you can try it risk-free. If you don't see results, we'll make it right. Ready to give it a shot?"`}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

export async function generateStaticParams() {
  const params: { market: string; product: string }[] = [];

  products.forEach((product) => {
    product.markets.forEach((market) => {
      params.push({ market, product: product.id });
    });
  });

  return params;
}
