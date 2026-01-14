"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  PhoneCall,
  MapPin,
  Star,
  Globe,
  ExternalLink,
  Clock,
  Calendar,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Users,
  Mail,
  Stethoscope,
  Languages,
  Sparkles,
  Copy,
  CheckCheck,
  Brain,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  Play,
  Pause,
  Volume2,
} from "lucide-react";
import {
  CampaignCallRecord,
  getCallRecord,
  createCallRecord,
  updateCallStatus,
  saveCallRecord,
} from "@/lib/campaign-storage";
import { CallStatus } from "@/lib/db/types";
import { getBatchCaller, Practitioner } from "@/lib/batch-caller";

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
  not_called: "bg-gray-100 text-gray-800",
  queued: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  booked: "bg-purple-100 text-purple-800",
  calendar_sent: "bg-teal-100 text-teal-800",
  voicemail: "bg-orange-100 text-orange-800",
  failed: "bg-red-100 text-red-800",
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
  // New state for call intelligence
  const [callIntelligence, setCallIntelligence] = useState<{
    sentiment_label?: string;
    sentiment_score?: number;
    lead_score?: number;
    recording_url?: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  // Helper to copy email to clipboard
  const copyEmail = async (email: string) => {
    await navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Get enrichment data
  const enrichment = practitioner?.enrichment?.data;

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
        // Convert API record to CampaignCallRecord format
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
        
        // Set call intelligence data
        setCallIntelligence({
          sentiment_label: data.record.sentiment_label,
          sentiment_score: data.record.sentiment_score,
          lead_score: data.record.lead_score,
          recording_url: data.record.recording_url,
        });
      } else {
        // Fallback to localStorage
        const localRecord = getCallRecord(practitioner.id);
        setCallRecord(localRecord);
        setNotes(localRecord?.notes || "");
      }
    } catch {
      // Fallback to localStorage on error
      const localRecord = getCallRecord(practitioner.id);
      setCallRecord(localRecord);
      setNotes(localRecord?.notes || "");
    }

    // Load calls from Bland API by phone number
    if (practitioner.phone) {
      setLoadingBlandCalls(true);
      try {
        // Format phone for search
        const phoneDigits = practitioner.phone.replace(/\D/g, "");
        const formattedPhone =
          phoneDigits.length === 10
            ? `+1${phoneDigits}`
            : phoneDigits.length === 11 && phoneDigits.startsWith("1")
              ? `+${phoneDigits}`
              : practitioner.phone;

        const response = await fetch(`/api/bland/calls?limit=10`);
        const data = await response.json();

        // Filter calls to this phone number
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
    } else {
      // Cleanup audio when drawer closes
      if (audioRef) {
        audioRef.pause();
        setAudioRef(null);
        setIsPlaying(false);
      }
    }
  }, [open, practitioner, loadCallData, audioRef]);

  // Save notes when they change (debounced) - uses API with localStorage fallback
  useEffect(() => {
    if (!practitioner || !callRecord) return;

    const timeout = setTimeout(async () => {
      if (notes !== callRecord.notes) {
        // Try API first
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
            // Update local state
            setCallRecord(prev => prev ? { ...prev, notes } : null);
          } else {
            // Fallback to localStorage
            saveCallRecord({ ...callRecord, notes });
          }
        } catch {
          // Fallback to localStorage on error
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
      // Ensure call record exists
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

      // Make the call using batch caller
      const batchCaller = getBatchCaller();
      const result = await batchCaller.makeCall(practitioner);

      if (result.success && result.call_id) {
        // Refresh call record
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

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  };

  if (!practitioner) return null;

  const hasPhone = !!practitioner.phone;
  const canCall =
    hasPhone &&
    (!callRecord ||
      ["not_called", "failed", "completed"].includes(callRecord.status));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto z-[1100]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 flex-wrap">
            {practitioner.name}
            {callRecord && (
              <Badge className={STATUS_COLORS[callRecord.status]}>
                {STATUS_LABELS[callRecord.status]}
              </Badge>
            )}
            {enrichment && (
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Enriched
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            {practitioner.practitioner_type}
            {enrichment && (
              <span className="text-xs text-muted-foreground">
                • Scraped {new Date(practitioner.enrichment?.scraped_at || '').toLocaleDateString()}
              </span>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Practitioner Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Practice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm">{practitioner.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {practitioner.city}, {practitioner.province}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">
                  {practitioner.phone || (
                    <span className="text-muted-foreground">
                      No phone available
                    </span>
                  )}
                </p>
              </div>

              {/* Rating */}
              {practitioner.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <p className="text-sm">
                    {practitioner.rating} stars
                    {practitioner.review_count &&
                      ` (${practitioner.review_count} reviews)`}
                  </p>
                </div>
              )}

              {/* Website */}
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

          {/* Enrichment Data - Team Members */}
          {enrichment?.practitioners && enrichment.practitioners.length > 0 && (
            <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Users className="w-4 h-4" />
                  Team Members ({enrichment.practitioners.length})
                  <Badge variant="outline" className="ml-auto text-[10px] border-purple-300 text-purple-600">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Enriched
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {enrichment.practitioners.map((prac, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 px-2 bg-white/60 dark:bg-white/10 rounded-md">
                    <div>
                      <p className="text-sm font-medium">{prac.name}</p>
                      <p className="text-xs text-muted-foreground">{prac.credentials}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Enrichment Data - Contact Emails */}
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
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {email}
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
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

          {/* Enrichment Data - Services */}
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

          {/* Enrichment Data - Languages */}
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

          {/* Call Now Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleCallNow}
              disabled={!canCall || isCalling}
              className="flex-1"
              size="lg"
            >
              {isCalling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Initiating Call...
                </>
              ) : callRecord?.status === "in_progress" ? (
                <>
                  <PhoneCall className="w-4 h-4 mr-2 animate-pulse" />
                  Call In Progress
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </>
              )}
            </Button>
          </div>

          {!hasPhone && (
            <p className="text-sm text-muted-foreground text-center">
              Cannot call - no phone number available
            </p>
          )}

          <Separator />

          {/* Call History Section */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Call History
            </h3>

            {/* Local Call Record */}
            {callRecord &&
              callRecord.status !== "not_called" &&
              callRecord.status !== "queued" && (
                <Card className="mb-3">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {callRecord.status === "completed" ||
                        callRecord.status === "booked" ||
                        callRecord.status === "calendar_sent" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : callRecord.status === "failed" ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="text-sm font-medium">
                          {formatDate(callRecord.call_started_at)}
                        </span>
                      </div>
                      <Badge className={STATUS_COLORS[callRecord.status]}>
                        {STATUS_LABELS[callRecord.status]}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>
                        Duration: {formatDuration(callRecord.duration_seconds)}
                      </div>
                      {callRecord.appointment_booked && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Appointment booked
                        </div>
                      )}
                    </div>

                    {callRecord.summary && (
                      <div className="mt-3 p-2 bg-muted rounded text-sm">
                        <p className="font-medium mb-1">Summary:</p>
                        <p>{callRecord.summary}</p>
                      </div>
                    )}

                    {callRecord.transcript && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-blue-600 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          View Transcript
                        </summary>
                        <ScrollArea className="h-[200px] mt-2 p-2 bg-muted rounded">
                          <pre className="text-xs whitespace-pre-wrap">
                            {callRecord.transcript}
                          </pre>
                        </ScrollArea>
                      </details>
                    )}

                    {/* Call Intelligence Section */}
                    {callIntelligence && (callIntelligence.sentiment_label || callIntelligence.lead_score || callIntelligence.recording_url) && (
                      <div className="mt-4 pt-3 border-t">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          Call Intelligence
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {/* Sentiment Badge */}
                          {callIntelligence.sentiment_label && (
                            <Badge 
                              className={
                                callIntelligence.sentiment_label === 'positive' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                  : callIntelligence.sentiment_label === 'negative'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                              }
                            >
                              {callIntelligence.sentiment_label === 'positive' && <Smile className="w-3 h-3 mr-1" />}
                              {callIntelligence.sentiment_label === 'negative' && <Frown className="w-3 h-3 mr-1" />}
                              {callIntelligence.sentiment_label === 'neutral' && <Meh className="w-3 h-3 mr-1" />}
                              {callIntelligence.sentiment_label}
                            </Badge>
                          )}
                          
                          {/* Lead Score Badge */}
                          {callIntelligence.lead_score !== undefined && callIntelligence.lead_score > 0 && (
                            <Badge 
                              className={
                                callIntelligence.lead_score >= 70 
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                                  : callIntelligence.lead_score >= 40
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                              }
                            >
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Score: {callIntelligence.lead_score}
                            </Badge>
                          )}
                        </div>

                        {/* Audio Player for Recording */}
                        {callIntelligence.recording_url && (
                          <div className="mt-3 p-2 bg-muted/50 rounded-md">
                            <p className="text-xs font-medium mb-2 flex items-center gap-1">
                              <Volume2 className="w-3 h-3" />
                              Call Recording
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  if (!audioRef) {
                                    const audio = new Audio(callIntelligence.recording_url);
                                    audio.onended = () => setIsPlaying(false);
                                    setAudioRef(audio);
                                    audio.play();
                                    setIsPlaying(true);
                                  } else if (isPlaying) {
                                    audioRef.pause();
                                    setIsPlaying(false);
                                  } else {
                                    audioRef.play();
                                    setIsPlaying(true);
                                  }
                                }}
                              >
                                {isPlaying ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                              <span className="text-xs text-muted-foreground">
                                {isPlaying ? 'Playing...' : 'Play recording'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

            {/* Bland API Calls */}
            {loadingBlandCalls ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">
                  Loading call history...
                </span>
              </div>
            ) : blandCalls.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">
                  From Bland.ai API:
                </p>
                {blandCalls.map((call: any) => (
                  <Card key={call.call_id} className="bg-muted/50">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {new Date(call.created_at).toLocaleDateString()}
                        </span>
                        <Badge variant="outline">{call.status}</Badge>
                      </div>
                      {call.call_length && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Duration: {formatDuration(call.call_length)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              !callRecord ||
              (callRecord.status === "not_called" && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No calls recorded yet
                </p>
              ))
            )}
          </div>

          <Separator />

          {/* Notes Section */}
          <div>
            <Label
              htmlFor="notes"
              className="mb-2 flex items-center gap-2 font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this practitioner..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Notes are saved automatically
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
