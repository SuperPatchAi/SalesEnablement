"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, PhoneCall, PhoneOff, BarChart3, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

// Configuration
const KB_ID = "b671527d-0c2d-4a21-9586-033dad3b0255";
const CHECK_AVAILABILITY_TOOL = "TL-79a3c232-ca51-4244-b5d2-21f4e70fd872";
const BOOK_APPOINTMENT_TOOL = "TL-bbaa7f38-1b6a-4f27-ad27-18fb7c6e1526";
const VOICE_ID = "78c8543e-e5fe-448e-8292-20a7b8c45247";

const PATHWAYS = {
  chiropractors: { id: "cf2233ef-7fb2-49ff-af29-0eee47204e9f", name: "Chiropractors", emoji: "🦴" },
  massage: { id: "d202aad7-bcb6-478c-a211-b00877545e05", name: "Massage Therapists", emoji: "💆" },
  naturopaths: { id: "1d07d635-147e-4f69-a4cd-c124b33b073d", name: "Naturopaths", emoji: "🌿" },
  integrative: { id: "1c958dd7-e1ff-4f6d-b9a3-f80a369c26aa", name: "Integrative Medicine", emoji: "⚕️" },
  functional: { id: "236dbd85-c74d-4774-a7af-4b5812015c68", name: "Functional Medicine", emoji: "🧬" },
  acupuncturists: { id: "154f93f4-54a5-4900-92e8-0fa217508127", name: "Acupuncturists", emoji: "📍" },
};

interface Call {
  call_id: string;
  status: string;
  to: string;
  from: string;
  created_at: string;
  call_length?: number;
  completed?: boolean;
  pathway_id?: string;
  concatenated_transcript?: string;
}

export default function VoiceAgentPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(false);
  const [making, setMaking] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPathway, setSelectedPathway] = useState("chiropractors");
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Load calls on mount
  useEffect(() => {
    loadCalls();
  }, []);

  async function loadCalls() {
    setLoading(true);
    try {
      const response = await fetch("/api/bland/calls?limit=20");
      const result = await response.json();
      setCalls(result.calls || []);
    } catch (error) {
      console.error("Failed to load calls:", error);
    }
    setLoading(false);
  }

  async function makeCall() {
    if (!phoneNumber) return;
    
    setMaking(true);
    try {
      const pathway = PATHWAYS[selectedPathway as keyof typeof PATHWAYS];
      const response = await fetch("/api/bland/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
          pathway_id: pathway.id,
          voice: VOICE_ID,
          first_sentence: "Hi, this is Jennifer with SuperPatch.",
          wait_for_greeting: true,
          record: true,
          max_duration: 15,
          tools: [CHECK_AVAILABILITY_TOOL, BOOK_APPOINTMENT_TOOL],
          knowledge_base: KB_ID,
        }),
      });
      const result = await response.json();
      
      if (result.status === "success") {
        alert(`Call started! ID: ${result.call_id}`);
        setPhoneNumber("");
        setTimeout(loadCalls, 2000);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Failed to make call:", error);
      alert("Failed to make call");
    }
    setMaking(false);
  }

  async function viewCallDetails(callId: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/bland/calls/${callId}`);
      const result = await response.json();
      setSelectedCall(result);
      setAnalysis(null);
    } catch (error) {
      console.error("Failed to load call details:", error);
    }
    setLoading(false);
  }

  async function analyzeCall(callId: string) {
    setAnalyzing(true);
    try {
      const response = await fetch(`/api/bland/calls/${callId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: "Determine if the practitioner is interested in scheduling a demo visit",
          questions: [
            ["Was the practitioner interested?", "boolean"],
            ["Did they agree to schedule a demo?", "boolean"],
            ["What products were they most interested in?", "string"],
            ["What objections did they raise?", "string"],
            ["Overall sentiment", "positive, neutral, negative"],
          ],
        }),
      });
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error("Failed to analyze call:", error);
    }
    setAnalyzing(false);
  }

  async function stopCall(callId: string) {
    try {
      await fetch(`/api/bland/calls/${callId}/stop`, { method: "POST" });
      alert("Call stopped");
      loadCalls();
    } catch (error) {
      console.error("Failed to stop call:", error);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500"><PhoneCall className="w-3 h-3 mr-1" /> In Progress</Badge>;
      case "queued":
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Queued</Badge>;
      case "failed":
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  }

  function formatDuration(seconds?: number) {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  function getPathwayName(pathwayId?: string) {
    if (!pathwayId) return "Unknown";
    for (const [key, value] of Object.entries(PATHWAYS)) {
      if (value.id === pathwayId) return value.name;
    }
    return "Unknown";
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Phone className="w-8 h-8" />
          Voice Agent Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Make calls, track progress, and analyze results with Jennifer AI
        </p>
      </div>

      <Tabs defaultValue="calls" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="calls">📞 Calls</TabsTrigger>
          <TabsTrigger value="new">➕ New Call</TabsTrigger>
        </TabsList>

        {/* New Call Tab */}
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Make a New Call</CardTitle>
              <CardDescription>
                Jennifer will call the practitioner using the selected pathway with Cal.com scheduling enabled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+15551234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">E.164 format (e.g., +15551234567)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pathway">Practitioner Type</Label>
                  <Select value={selectedPathway} onValueChange={setSelectedPathway}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PATHWAYS).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.emoji} {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button onClick={makeCall} disabled={making || !phoneNumber} size="lg">
                  {making ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Starting Call...
                    </>
                  ) : (
                    <>
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Start Call
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Call Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Cal.com scheduling tools enabled</li>
                  <li>✅ SuperPatch knowledge base enabled</li>
                  <li>✅ Recording enabled</li>
                  <li>✅ Jennifer voice (professional, warm)</li>
                  <li>✅ Max duration: 15 minutes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calls List Tab */}
        <TabsContent value="calls">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Calls List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Calls</CardTitle>
                  <CardDescription>Click a call to view details</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={loadCalls} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {calls.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No calls yet</p>
                  ) : (
                    calls.map((call) => (
                      <div
                        key={call.call_id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                          selectedCall?.call_id === call.call_id ? "bg-accent border-primary" : ""
                        }`}
                        onClick={() => viewCallDetails(call.call_id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{call.to || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(call.created_at).toLocaleString()}
                            </p>
                          </div>
                          {getStatusBadge(call.status)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Call Details */}
            <Card>
              <CardHeader>
                <CardTitle>Call Details</CardTitle>
                <CardDescription>
                  {selectedCall ? `ID: ${selectedCall.call_id.slice(0, 12)}...` : "Select a call to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedCall ? (
                  <p className="text-muted-foreground text-center py-8">Select a call from the list</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        {getStatusBadge(selectedCall.status)}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{formatDuration(selectedCall.call_length)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">To</p>
                        <p className="font-medium">{selectedCall.to || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pathway</p>
                        <p className="font-medium">{getPathwayName(selectedCall.pathway_id)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => analyzeCall(selectedCall.call_id)}
                        disabled={analyzing}
                      >
                        {analyzing ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <BarChart3 className="w-4 h-4 mr-2" />
                        )}
                        Analyze
                      </Button>
                      {selectedCall.status === "in-progress" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => stopCall(selectedCall.call_id)}
                        >
                          <PhoneOff className="w-4 h-4 mr-2" />
                          Stop
                        </Button>
                      )}
                    </div>

                    {/* Analysis Results */}
                    {analysis && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">📊 Analysis Results</h4>
                        {analysis.answers ? (
                          <ul className="text-sm space-y-1">
                            {analysis.answers.map((answer: string, i: number) => (
                              <li key={i}>• {answer}</li>
                            ))}
                          </ul>
                        ) : (
                          <pre className="text-xs">{JSON.stringify(analysis, null, 2)}</pre>
                        )}
                      </div>
                    )}

                    {/* Transcript */}
                    {selectedCall.concatenated_transcript && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">📝 Transcript</h4>
                        <div className="p-3 bg-muted rounded-lg max-h-48 overflow-y-auto">
                          <p className="text-sm whitespace-pre-wrap">
                            {selectedCall.concatenated_transcript}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
