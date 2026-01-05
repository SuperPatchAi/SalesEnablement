import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FlaskConical, FileText, TrendingUp, Users, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getProductsWithStudies } from "@/data/products";

const clinicalStudies = [
  {
    id: "restore",
    name: "RESTORE Study",
    productId: "freedom",
    productName: "Freedom",
    productEmoji: "🔵",
    journal: "Pain Therapeutics",
    year: 2025,
    type: "Randomized, Controlled, Double-Blind",
    registration: "ClinicalTrials.gov NCT06505005",
    participants: 118,
    duration: "14 days",
    results: [
      { metric: "Pain Severity", result: "Significantly greater improvement in active group" },
      { metric: "Pain Interference", result: "Significantly greater reduction in active group" },
      { metric: "Range of Motion", result: "Greater improvement at Day 7 and Day 14" },
    ],
    keyStats: [
      { value: "118", label: "Participants" },
      { value: "14", label: "Days" },
      { value: "Double-Blind", label: "Study Type" },
    ],
    talkingPoints: [
      "Double-blind, placebo-controlled RCT",
      "Published in peer-reviewed Pain Therapeutics",
      "ClinicalTrials.gov registered",
      "Significant improvement in pain and ROM",
    ],
  },
  {
    id: "harmoni",
    name: "HARMONI Study",
    productId: "rem",
    productName: "REM",
    productEmoji: "🟣",
    journal: "Sleep Research",
    year: 2024,
    type: "Prospective Clinical Trial",
    participants: 113,
    duration: "14 days",
    results: [
      { metric: "Time to Fall Asleep", result: "Reduced from 69 min to 37 min (46% faster)" },
      { metric: "Total Sleep Duration", result: "Increased from 5 to 6.5 hours (+1.5 hrs)" },
      { metric: "Night Waking", result: "Reduced from 83% to 22% (74% reduction)" },
      { metric: "Sleep Medication Use", result: "80% stopped medications during study" },
    ],
    keyStats: [
      { value: "46%", label: "Faster Sleep" },
      { value: "+1.5hr", label: "More Sleep" },
      { value: "80%", label: "Stopped Meds" },
    ],
    talkingPoints: [
      "46% faster sleep onset",
      "80% stopped sleep medications",
      "+1.5 hours of sleep per night",
      "Only 4.4% adverse events (minor)",
    ],
  },
  {
    id: "balance",
    name: "Balance Study",
    productId: "liberty",
    productName: "Liberty",
    productEmoji: "🟢",
    journal: "Int'l Journal of Physical Medicine & Rehabilitation",
    year: 2022,
    type: "Controlled Comparative Study",
    participants: 69,
    duration: "Single assessment",
    results: [
      { metric: "Balance Score", result: "31% improvement (statistically significant p<0.05)" },
    ],
    keyStats: [
      { value: "31%", label: "Improvement" },
      { value: "p<0.05", label: "Significant" },
      { value: "69", label: "Participants" },
    ],
    talkingPoints: [
      "31% improvement in balance scores",
      "Statistically significant (p<0.05)",
      "Validated Sway Medical Assessment",
      "Falls are #1 injury death cause in 65+",
    ],
  },
];

export default function EvidencePage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Clinical Evidence
          </h1>
          <p className="text-muted-foreground mt-1">
            Peer-reviewed studies supporting SuperPatch products
          </p>
        </div>

        {/* Study Cards */}
        <div className="space-y-6">
          {clinicalStudies.map((study) => (
            <Card key={study.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{study.productEmoji}</span>
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {study.name}
                        <Badge variant="outline">{study.productName}</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {study.journal}, {study.year}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {study.type} • {study.participants} participants •{" "}
                        {study.duration}
                      </p>
                      {study.registration && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {study.registration}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="flex gap-4">
                    {study.keyStats.map((stat, i) => (
                      <div
                        key={i}
                        className="text-center px-4 py-2 bg-muted rounded-lg"
                      >
                        <p className="text-2xl font-bold text-primary">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Results */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      KEY RESULTS
                    </h4>
                    <div className="space-y-2">
                      {study.results.map((result, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-medium">{result.metric}:</span>{" "}
                            <span className="text-muted-foreground">
                              {result.result}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Talking Points */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      TALKING POINTS
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {study.talkingPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <Link
                    href={`/d2c/products/${study.productId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View {study.productName} Word Track →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage Tips */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              💡 How to Use Clinical Evidence in Sales
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>
                <strong>Build Credibility:</strong> Mention studies early to
                establish trust with skeptical prospects.
              </li>
              <li>
                <strong>Handle Objections:</strong> Use specific stats when
                prospects question effectiveness.
              </li>
              <li>
                <strong>B2B Conversations:</strong> Healthcare practitioners
                especially value clinical data.
              </li>
              <li>
                <strong>Don't Overwhelm:</strong> Lead with 1-2 key stats, have
                details ready if asked.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

