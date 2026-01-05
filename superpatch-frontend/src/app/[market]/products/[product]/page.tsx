import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  { id: "profile", label: "Profile", icon: Users },
  { id: "opening", label: "Opening", icon: MessageSquare },
  { id: "discovery", label: "Discovery", icon: HelpCircle },
  { id: "presentation", label: "Presentation", icon: Presentation },
  { id: "objections", label: "Objections", icon: ShieldQuestion },
  { id: "closing", label: "Closing", icon: CheckCircle },
  { id: "followup", label: "Follow-Up", icon: Calendar },
  { id: "testimonials", label: "Testimonials", icon: Quote },
  { id: "quickref", label: "Quick Ref", icon: Zap },
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
      <div className="flex flex-col gap-6 p-6 md:p-8">
        {/* Product Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{product.emoji}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                  {product.name}
                </h1>
                {product.hasClinicalStudy && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    📊 {product.studyName}
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground">{product.tagline}</p>
              <div className="flex gap-2 mt-2">
                <Badge
                  style={{
                    backgroundColor: product.color,
                    color: "white",
                  }}
                >
                  {product.category}
                </Badge>
                <Badge variant="secondary">{market.toUpperCase()}</Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${market}/roadmaps`}>
                <Map className="h-4 w-4 mr-2" />
                View Roadmap
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Word Track Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">{section.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Product Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <p>
                    <strong>{product.name}</strong> is a drug-free, non-invasive
                    wellness solution that uses Vibrotactile Technology (VTT) to
                    help with {product.category}-related concerns.
                  </p>
                  <h4>How VTT Works</h4>
                  <p>
                    The patch contains a specific pattern that, when in contact
                    with the skin, creates a subtle vibrotactile signal. This
                    signal interacts with the body's nervous system to promote
                    the desired effect without any drugs or chemicals entering
                    the body.
                  </p>
                  <h4>Key Differentiators</h4>
                  <ul>
                    <li>100% drug-free and non-invasive</li>
                    <li>No side effects or contraindications</li>
                    <li>Can be used alongside other treatments</li>
                    <li>Immediate application, no waiting period</li>
                    {product.hasClinicalStudy && (
                      <li>Backed by clinical research ({product.studyName})</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Reference
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">KEY BENEFITS</h4>
                      <ul className="text-sm space-y-1">
                        <li>✓ Drug-free {product.category} support</li>
                        <li>✓ No contraindications</li>
                        <li>✓ Works within hours</li>
                        <li>✓ Lasts up to 24 hours per patch</li>
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        IDEAL CUSTOMER
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        People seeking natural alternatives for{" "}
                        {product.category} support, those who want to avoid
                        medications, and health-conscious individuals looking for
                        innovative solutions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Opening Scripts Tab */}
          <TabsContent value="opening" className="mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-semibold">
                    📞 Cold Call Script
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Scenario: Initial outreach call
                  </p>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                    {`"Hi [Name], this is [Your Name] from Super Patch. 

I'm reaching out because we've developed an innovative drug-free solution for ${product.category} that's getting remarkable results.

Do you have 2 minutes to hear how it works?"`}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-semibold">
                    🤝 Referral Opening
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Scenario: Following up on a referral
                  </p>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                    {`"Hi [Name], [Referrer] mentioned that you might be interested in learning about a drug-free ${product.category} solution.

They thought our ${product.name} patch could be a great fit for you. Would you like to hear more?"`}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Objections Tab */}
          <TabsContent value="objections" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    ❓ "It's too expensive"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Response:</p>
                      <p className="text-sm text-muted-foreground">
                        "I understand cost is a consideration. Let me ask you
                        this—what are you currently spending on {product.category}{" "}
                        solutions? And how well are they working? When you factor
                        in effectiveness and the fact that this is completely
                        drug-free with no side effects, most people find it's
                        actually quite economical."
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium">💡 Psychology:</p>
                      <p className="text-xs text-muted-foreground">
                        Validates their concern, then shifts focus to value and
                        total cost of current solutions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    ❓ "Does it really work?"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Response:</p>
                      <p className="text-sm text-muted-foreground">
                        "I appreciate your skepticism—it shows you're a thoughtful
                        buyer. Yes, it really works, and we have{" "}
                        {product.hasClinicalStudy
                          ? `clinical studies to back it up. The ${product.studyName} showed significant results.`
                          : "thousands of satisfied customers and testimonials."}{" "}
                        Would you like to try it risk-free and experience the
                        results yourself?"
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium">💡 Psychology:</p>
                      <p className="text-xs text-muted-foreground">
                        Compliments their skepticism, provides evidence, and
                        offers a risk-free way to validate.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Placeholder for other tabs */}
          {["profile", "discovery", "presentation", "closing", "followup", "testimonials", "quickref"].map(
            (tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      Content for {tab} section coming soon...
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Full word track content will be imported from the
                      markdown files.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          )}
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

