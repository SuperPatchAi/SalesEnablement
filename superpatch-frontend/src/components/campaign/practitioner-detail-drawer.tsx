"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Phone,
  PhoneCall,
  MapPin,
  Star,
  Globe,
  ExternalLink,
  Clock,
  Calendar,
  Loader2,
  Users,
  Mail,
  Stethoscope,
  Languages,
  Sparkles,
  Copy,
  CheckCheck,
  Smile,
  Meh,
  Frown,
  MoreHorizontal,
  History,
  FileText,
  Building2,
  Plus,
  Brain,
} from "lucide-react";
import {
  CampaignCallRecord,
  getCallRecord,
  createCallRecord,
  saveCallRecord,
} from "@/lib/campaign-storage";
import { CallStatus } from "@/lib/db/types";
import { getBatchCaller, Practitioner } from "@/lib/batch-caller";
import { LeadScoreGauge } from "./lead-score-gauge";
import { DrawerCallTimeline } from "./drawer-call-timeline";

// Enrichment data types
interface EnrichmentPractitioner {
  name: string;
  credentials: string;
  context?: string;
}

interface EnrichmentData {
  scraped_at: string;
  success: boolean;
  data?: {
    url: string;
    title: string;
    description: string;
    practitioners: EnrichmentPractitioner[];
    emails: string[];
    phones: string[];
    services: string[];
    languages: string[];
    raw_text_preview?: string;
  };
}

interface PractitionerWithEnrichment extends Practitioner {
  enrichment?: EnrichmentData;
}

interface PractitionerDetailDrawerProps {
  practitioner: PractitionerWithEnrichment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCallStarted?: (callId: string) => void;
}

const STATUS_COLORS: Record<CallStatus, string> = {
  not_called: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  queued: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  booked: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  calendar_sent: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  voicemail: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const STATUS_LABELS: Record<CallStatus, string> = {
  not_called: "Not Called",
  queued: "Queued",
  in_progress: "In Progress",
  completed: "Completed",
  booked: "Booked",
  calendar_sent: "Calendar Sent",
  voicemail: "Voicemail",
  failed: "Failed",
};

export function PractitionerDetailDrawer({
  practitioner,
  open,
  onOpenChange,
  onCallStarted,
}: PractitionerDetailDrawerProps) {
  const [callRecord, setCallRecord] = useState<CampaignCallRecord | null>(null);
  const [notes, setNotes] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [blandCalls, setBlandCalls] = useState<any[]>([]);
  const [loadingBlandCalls, setLoadingBlandCalls] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [callIntelligence, setCallIntelligence] = useState<{
    sentiment_label?: string;
    sentiment_score?: number;
    lead_score?: number;
    recording_url?: string;
  } | null>(null);

  // Helper to copy email to clipboard
  const copyEmail = async (email: string) => {
    await navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Get enrichment data
  const enrichment = practitioner?.enrichment?.data;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Load call record and Bland API history when practitioner changes
  const loadCallData = useCallback(async () => {
    if (!practitioner) {
      setCallRecord(null);
      setNotes("");
      setBlandCalls([]);
      setCallIntelligence(null);
      return;
    }

    // Load call record from API with localStorage fallback
    try {
      const response = await fetch(`/api/campaign/calls?practitioner_id=${practitioner.id}`);
      const data = await response.json();
      
      if (data.record) {
        const record: CampaignCallRecord = {
          practitioner_id: data.record.practitioner_id,
          practitioner_name: data.record.practitioner_name,
          practitioner_type: data.record.practitioner_type || "",
          phone: data.record.phone,
          address: data.record.address || "",
          city: data.record.city || "",
          province: data.record.province || "",
          call_id: data.record.call_id,
          status: data.record.status,
          call_started_at: data.record.call_started_at,
          call_ended_at: data.record.call_ended_at,
          duration_seconds: data.record.duration_seconds,
          transcript: data.record.transcript,
          summary: data.record.summary,
          appointment_booked: data.record.appointment_booked,
          appointment_time: data.record.appointment_time,
          calendar_invite_sent: data.record.calendar_invite_sent,
          practitioner_email: data.record.practitioner_email,
          notes: data.record.notes,
          created_at: data.record.created_at,
          updated_at: data.record.updated_at,
        };
        setCallRecord(record);
        setNotes(record.notes || "");
        
        setCallIntelligence({
          sentiment_label: data.record.sentiment_label,
          sentiment_score: data.record.sentiment_score,
          lead_score: data.record.lead_score,
          recording_url: data.record.recording_url,
        });
      } else {
        const localRecord = getCallRecord(practitioner.id);
        setCallRecord(localRecord);
        setNotes(localRecord?.notes || "");
      }
    } catch {
      const localRecord = getCallRecord(practitioner.id);
      setCallRecord(localRecord);
      setNotes(localRecord?.notes || "");
    }

    // Load calls from Bland API
    if (practitioner.phone) {
      setLoadingBlandCalls(true);
      try {
        const phoneDigits = practitioner.phone.replace(/\D/g, "");
        const formattedPhone =
          phoneDigits.length === 10
            ? `+1${phoneDigits}`
            : phoneDigits.length === 11 && phoneDigits.startsWith("1")
              ? `+${phoneDigits}`
              : practitioner.phone;

        const response = await fetch(`/api/bland/calls?limit=10`);
        const data = await response.json();

        const matchingCalls = (data.calls || []).filter(
          (call: any) =>
            call.to === formattedPhone ||
            call.to?.replace(/\D/g, "") === phoneDigits
        );

        setBlandCalls(matchingCalls);
      } catch (error) {
        console.error("Failed to load Bland calls:", error);
        setBlandCalls([]);
      }
      setLoadingBlandCalls(false);
    }
  }, [practitioner]);

  useEffect(() => {
    if (open) {
      loadCallData();
      setActiveTab("overview");
    }
  }, [open, practitioner, loadCallData]);

  // Save notes when they change (debounced)
  useEffect(() => {
    if (!practitioner || !callRecord) return;

    const timeout = setTimeout(async () => {
      if (notes !== callRecord.notes) {
        try {
          const response = await fetch("/api/campaign/calls", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              practitioner_id: practitioner.id,
              notes,
            }),
          });
          
          if (response.ok) {
            setCallRecord(prev => prev ? { ...prev, notes } : null);
          } else {
            saveCallRecord({ ...callRecord, notes });
          }
        } catch {
          saveCallRecord({ ...callRecord, notes });
        }
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [notes, practitioner, callRecord]);

  const handleCallNow = async () => {
    if (!practitioner || !practitioner.phone) return;

    setIsCalling(true);

    try {
      let record = getCallRecord(practitioner.id);
      if (!record) {
        record = createCallRecord({
          id: practitioner.id,
          name: practitioner.name,
          practitioner_type: practitioner.practitioner_type,
          phone: practitioner.phone,
          address: practitioner.address,
          city: practitioner.city,
          province: practitioner.province,
        });
      }

      const batchCaller = getBatchCaller();
      const result = await batchCaller.makeCall(practitioner);

      if (result.success && result.call_id) {
        const updatedRecord = getCallRecord(practitioner.id);
        setCallRecord(updatedRecord);
        onCallStarted?.(result.call_id);
      } else {
        alert(`Call failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Call error:", error);
      alert("Failed to initiate call");
    }

    setIsCalling(false);
  };

  if (!practitioner) return null;

  const hasPhone = !!practitioner.phone;
  const canCall =
    hasPhone &&
    (!callRecord ||
      ["not_called", "failed", "completed"].includes(callRecord.status));

  const status = callRecord?.status || "not_called";
  const leadScore = callIntelligence?.lead_score || 0;
  const sentiment = callIntelligence?.sentiment_label;

  // Build timeline items
  const timelineItems = [];
  if (callRecord && callRecord.status !== "not_called" && callRecord.status !== "queued") {
    timelineItems.push({
      id: callRecord.call_id || "local",
      date: callRecord.call_started_at || callRecord.created_at,
      status: callRecord.status,
      duration: callRecord.duration_seconds,
      summary: callRecord.summary,
      transcript: callRecord.transcript,
      recording_url: callIntelligence?.recording_url,
      sentiment_label: callIntelligence?.sentiment_label,
      appointment_booked: callRecord.appointment_booked,
    });
  }
  // Add Bland API calls
  blandCalls.forEach((call) => {
    timelineItems.push({
      id: call.call_id,
      date: call.created_at,
      status: call.status,
      duration: call.call_length,
    });
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[700px] p-0 flex flex-col z-[1100]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                {getInitials(practitioner.name)}
              </AvatarFallback>
            </Avatar>

            {/* Name & Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">{practitioner.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {practitioner.practitioner_type}
              </p>
              
              {/* Badges Row */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge className={STATUS_COLORS[status]}>
                  {STATUS_LABELS[status]}
                </Badge>
                {enrichment && (
                  <Badge 
                    variant="outline" 
                    className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Enriched
                  </Badge>
                )}
                {sentiment && (
                  <Badge
                    variant="secondary"
                    className={
                      sentiment === "positive"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : sentiment === "negative"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }
                  >
                    {sentiment === "positive" && <Smile className="w-3 h-3 mr-1" />}
                    {sentiment === "negative" && <Frown className="w-3 h-3 mr-1" />}
                    {sentiment === "neutral" && <Meh className="w-3 h-3 mr-1" />}
                    {sentiment}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          {leadScore > 0 && (
            <div className="mt-3 pt-3 border-t">
              <LeadScoreGauge score={leadScore} size="md" />
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0 px-6">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
            >
              <History className="w-4 h-4 mr-2" />
              History
              {timelineItems.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                  {timelineItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
            >
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <ScrollArea className="flex-1 h-0">
            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0 p-6 space-y-4">
              {/* Practice Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Practice Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${practitioner.address}, ${practitioner.city}, ${practitioner.province}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <p className="text-sm group-hover:text-blue-600 group-hover:underline">
                        {practitioner.address}
                      </p>
                      <p className="text-sm text-muted-foreground group-hover:text-blue-500">
                        {practitioner.city}, {practitioner.province}
                      </p>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm">
                      {practitioner.phone || (
                        <span className="text-muted-foreground">No phone available</span>
                      )}
                    </p>
                  </div>

                  {practitioner.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <p className="text-sm">
                        {practitioner.rating} stars
                        {practitioner.review_count && ` (${practitioner.review_count} reviews)`}
                      </p>
                    </div>
                  )}

                  {practitioner.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={practitioner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Team Members */}
              {enrichment?.practitioners && enrichment.practitioners.length > 0 && (
                <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <Users className="w-4 h-4" />
                      Team Members ({enrichment.practitioners.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {enrichment.practitioners.map((prac, idx) => (
                      <div key={idx} className="flex items-center gap-2 py-1.5 px-2 bg-white/60 dark:bg-white/10 rounded-md">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px] bg-purple-100 text-purple-700">
                            {getInitials(prac.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{prac.name}</p>
                          <p className="text-xs text-muted-foreground">{prac.credentials}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Contact Emails */}
              {enrichment?.emails && enrichment.emails.length > 0 && (
                <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Mail className="w-4 h-4" />
                      Contact Emails ({enrichment.emails.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {enrichment.emails.map((email, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5 px-2 bg-white/60 dark:bg-white/10 rounded-md">
                        <a
                          href={`mailto:${email}`}
                          className="text-sm text-blue-600 hover:underline truncate"
                        >
                          {email}
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 shrink-0"
                          onClick={() => copyEmail(email)}
                        >
                          {copiedEmail === email ? (
                            <CheckCheck className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Services */}
              {enrichment?.services && enrichment.services.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Services Offered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {enrichment.services.map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Languages */}
              {enrichment?.languages && enrichment.languages.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Languages Spoken
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {enrichment.languages.map((lang, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="m-0 p-6">
              <DrawerCallTimeline items={timelineItems} loading={loadingBlandCalls} />
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="m-0 p-6 space-y-4">
              {/* Call Summary (read-only) */}
              {callRecord?.summary && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Call Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {callRecord.summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Your Notes (editable) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Your Notes</Label>
                <Textarea
                  placeholder="Add notes about this practitioner..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Notes are saved automatically
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 border-t bg-background p-4">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Button
                onClick={handleCallNow}
                disabled={!canCall || isCalling}
                className="flex-1"
                size="lg"
              >
                {isCalling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calling...
                  </>
                ) : status === "in_progress" ? (
                  <>
                    <PhoneCall className="w-4 h-4 mr-2 animate-pulse" />
                    In Progress
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </>
                )}
              </Button>

              {enrichment?.emails && enrichment.emails.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="lg" asChild>
                      <a href={`mailto:${enrichment.emails[0]}`}>
                        <Mail className="w-4 h-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send Email</TooltipContent>
                </Tooltip>
              )}

              {practitioner.website && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="lg" asChild>
                      <a href={practitioner.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Open Website</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="lg">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>More Actions</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {!hasPhone && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Cannot call - no phone number available
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
