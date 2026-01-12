"use client";

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PhoneCall, Users, Star,
  Search, Play, Pause, Square,
  Clock, Loader2, Download, RefreshCw,
  ListChecks, BarChart3, Phone, Zap,
  PanelLeftClose, PanelLeft, Filter, Kanban, MapPin, History
} from "lucide-react";
import {
  CampaignCallRecord,
  createCallRecord,
  exportRecords,
} from "@/lib/campaign-storage";
import { CallStatus } from "@/lib/db/types";
import { useSupabaseCallRecords } from "@/hooks/useSupabaseCallRecords";
import { KPICards } from "@/components/campaign/kpi-cards";
import { FilterPanel, FilterState, FilterSheet, FilterSheetTrigger } from "@/components/campaign/filter-panel";
import { PipelineBoard, FunnelView } from "@/components/campaign/pipeline-board";
import { AnalyticsDashboard } from "@/components/campaign/analytics-dashboard";
import { ActivityFeed, ActivityFeedCompact } from "@/components/campaign/activity-feed";
import { 
  ColumnVisibilityMenu, 
  SortableHeader,
  RowActionsMenu,
  useTableState,
  DEFAULT_COLUMNS,
  SortState,
} from "@/components/campaign/data-table-toolbar";
import { CommandSearch, useCommandSearch, CommandSearchTrigger } from "@/components/campaign/command-search";
import { callNotifications } from "@/components/campaign/call-notifications";
import { getBatchCaller, Practitioner, BatchCallerEvent } from "@/lib/batch-caller";
import { PractitionerDetailDrawer } from "@/components/campaign/practitioner-detail-drawer";
import { CallTimeline } from "@/components/campaign/call-timeline";
import { 
  NoPractitionersFound, 
  NoCallsYet, 
  NoAnalyticsData, 
  NoPipelineData, 
  NoMapData,
  QueueEmpty 
} from "@/components/campaign/empty-states";
import { 
  GaugeChart, 
  RadialProgressChart, 
  StatCard, 
  KPIGrid 
} from "@/components/campaign/enhanced-charts";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues with Leaflet
const PractitionerMap = dynamic(
  () => import("@/components/campaign/practitioner-map").then(mod => mod.PractitionerMap),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div> }
);

// Enrichment data from Firecrawl scraping
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

interface PractitionerData extends Practitioner {
  website: string | null;
  rating: number | null;
  review_count: number | null;
  business_status: string;
  google_maps_uri: string;
  latitude: number;
  longitude: number;
  scraped_at: string;
  notes: string;
  // Enrichment data
  enrichment?: EnrichmentData;
}

interface FilterMetadata {
  provinces: string[];
  cities: Record<string, string[]>;
  types: string[];
}

interface PaginatedResponse {
  practitioners: PractitionerData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

const STATUS_COLORS: Record<CallStatus, string> = {
  not_called: 'bg-gray-100 text-gray-800',
  queued: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  booked: 'bg-purple-100 text-purple-800',
  calendar_sent: 'bg-teal-100 text-teal-800',
  failed: 'bg-red-100 text-red-800',
  voicemail: 'bg-orange-100 text-orange-800',
};

const STATUS_LABELS: Record<CallStatus, string> = {
  not_called: 'Not Called',
  queued: 'Queued',
  in_progress: 'In Progress',
  completed: 'Completed',
  booked: 'Booked',
  calendar_sent: 'Calendar Sent',
  failed: 'Failed',
  voicemail: 'Voicemail',
};

function CampaignPageContent() {
  const searchParams = useSearchParams();
  
  // Data state
  const [practitioners, setPractitioners] = useState<PractitionerData[]>([]);
  const [metadata, setMetadata] = useState<FilterMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, hasMore: false });

  // Filter state
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [practitionerType, setPractitionerType] = useState<string>("");
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState<string>("");
  const [hasPhoneOnly, setHasPhoneOnly] = useState(true);
  const [hasWebsiteOnly, setHasWebsiteOnly] = useState(false);
  const [callStatusFilter, setCallStatusFilter] = useState<CallStatus[]>([]);
  const [minReviews, setMinReviews] = useState(0);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  // Enrichment filters
  const [hasEnrichment, setHasEnrichment] = useState(false);
  const [hasEmails, setHasEmails] = useState(false);
  const [hasTeamMembers, setHasTeamMembers] = useState(false);
  const [isMultilingual, setIsMultilingual] = useState(false);
  
  // Table state - column visibility and sorting
  const { columns, sortState, toggleColumn, resetColumns, handleSort, visibleColumns } = useTableState();
  
  // Command search state
  const commandSearch = useCommandSearch();

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  // Campaign state
  const [campaignRunning, setCampaignRunning] = useState(false);
  const [campaignPaused, setCampaignPaused] = useState(false);
  const [, setCurrentCallId] = useState<string | null>(null);
  const [queueDrawerOpen, setQueueDrawerOpen] = useState(false);
  
  // Use Supabase for call records with realtime updates
  const { 
    records: callRecords, 
    stats, 
    refresh: refreshCallRecords,
    isConnected: isRealtimeConnected 
  } = useSupabaseCallRecords();

  // Detail drawer state
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedPractitioner, setSelectedPractitioner] = useState<PractitionerData | null>(null);

  // Quick call state
  const [activeTab, setActiveTab] = useState("practitioners");
  const [quickCallPhone, setQuickCallPhone] = useState("");
  const [quickCallType, setQuickCallType] = useState("chiropractor");
  const [quickCallSearching, setQuickCallSearching] = useState(false);
  const [quickCallResult, setQuickCallResult] = useState<PractitionerData | null>(null);
  const [quickCallNotFound, setQuickCallNotFound] = useState(false);
  const [quickCallMaking, setQuickCallMaking] = useState(false);

  // Map state - track if all practitioners are loaded
  const [allPractitionersLoaded, setAllPractitionersLoaded] = useState(false);
  const [loadingAllPractitioners, setLoadingAllPractitioners] = useState(false);

  // Refs
  const parentRef = useRef<HTMLDivElement>(null);
  const batchCaller = useRef(getBatchCaller());

  // Load practitioners function
  const loadPractitioners = useCallback(async (page: number) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '100');
      
      if (province) params.set('province', province);
      if (city) params.set('city', city);
      if (practitionerType) params.set('type', practitionerType);
      if (search) params.set('search', search);
      if (minRating) params.set('minRating', minRating);
      if (hasPhoneOnly) params.set('hasPhone', 'true');

      const response = await fetch(`/api/practitioners?${params}`);
      const data: PaginatedResponse = await response.json();

      if (page === 1) {
        setPractitioners(data.practitioners);
      } else {
        setPractitioners(prev => [...prev, ...data.practitioners]);
      }

      setPagination({
        page: data.pagination.page,
        total: data.pagination.total,
        hasMore: data.pagination.hasMore,
      });
    } catch (error) {
      console.error('Failed to load practitioners:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [province, city, practitionerType, search, minRating, hasPhoneOnly]);

  // Load metadata on mount (call records are loaded by useSupabaseCallRecords hook)
  useEffect(() => {
    loadMetadata();
  }, []);

  // Handle tab query parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "quick-call" || tabParam === "practitioners") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Load practitioners when filters change
  useEffect(() => {
    loadPractitioners(1);
    setAllPractitionersLoaded(false); // Reset when filters change
  }, [loadPractitioners]);

  // Debounced search handled by loadPractitioners dependency

  // Subscribe to batch caller events
  useEffect(() => {
    const unsubscribe = batchCaller.current.subscribe((event: BatchCallerEvent) => {
      loadCallRecords();
      
      switch (event.type) {
        case 'call_started':
          setCurrentCallId(event.call_id || null);
          break;
        case 'call_completed':
        case 'call_failed':
          setCurrentCallId(null);
          break;
        case 'queue_empty':
        case 'campaign_stopped':
          setCampaignRunning(false);
          setCampaignPaused(false);
          setCurrentCallId(null);
          break;
        case 'campaign_paused':
          setCampaignPaused(true);
          break;
      }
    });
    
    return unsubscribe;
  }, []);

  async function loadMetadata() {
    try {
      const response = await fetch('/api/practitioners?metadata=true');
      const data = await response.json();
      setMetadata(data);
    } catch (error) {
      console.error('Failed to load metadata:', error);
    }
  }

  // Refresh call records from Supabase
  function loadCallRecords() {
    refreshCallRecords();
  }

  function loadMorePractitioners() {
    if (pagination.hasMore && !loadingMore) {
      loadPractitioners(pagination.page + 1);
    }
  }

  // Load all practitioners for map view
  async function loadAllPractitioners() {
    if (allPractitionersLoaded || loadingAllPractitioners) return;
    
    setLoadingAllPractitioners(true);
    
    try {
      const params = new URLSearchParams();
      params.set('limit', '50000'); // Load all at once
      
      // Apply same filters
      if (province) params.set('province', province);
      if (city) params.set('city', city);
      if (practitionerType) params.set('type', practitionerType);
      if (search) params.set('search', search);
      if (minRating) params.set('minRating', minRating);
      if (hasPhoneOnly) params.set('hasPhone', 'true');
      
      const response = await fetch(`/api/practitioners?${params}`);
      const data: PaginatedResponse = await response.json();
      
      setPractitioners(data.practitioners);
      setPagination({
        page: 1,
        total: data.pagination.total,
        hasMore: false,
      });
      setAllPractitionersLoaded(true);
    } catch (error) {
      console.error('Failed to load all practitioners:', error);
    } finally {
      setLoadingAllPractitioners(false);
    }
  }

  // Get available cities for selected province
  const availableCities = useMemo(() => {
    if (!metadata || !province) return [];
    return metadata.cities[province] || [];
  }, [metadata, province]);

  // Client-side filtering and sorting for practitioner data
  const filteredPractitioners = useMemo(() => {
    let result = [...practitioners];
    
    // Apply enrichment filters (client-side since this data isn't in the API)
    if (hasEnrichment) {
      result = result.filter(p => p.enrichment?.success && p.enrichment?.data);
    }
    if (hasEmails) {
      result = result.filter(p => p.enrichment?.data?.emails && p.enrichment.data.emails.length > 0);
    }
    if (hasTeamMembers) {
      result = result.filter(p => p.enrichment?.data?.practitioners && p.enrichment.data.practitioners.length > 0);
    }
    if (isMultilingual) {
      result = result.filter(p => p.enrichment?.data?.languages && p.enrichment.data.languages.length > 1);
    }
    
    // Apply sorting
    if (sortState.column && sortState.direction) {
      result.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        switch (sortState.column) {
          case "name":
            aValue = a.name?.toLowerCase() || "";
            bValue = b.name?.toLowerCase() || "";
            break;
          case "type":
            aValue = a.practitioner_type?.toLowerCase() || "";
            bValue = b.practitioner_type?.toLowerCase() || "";
            break;
          case "city":
            aValue = a.city?.toLowerCase() || "";
            bValue = b.city?.toLowerCase() || "";
            break;
          case "province":
            aValue = a.province?.toLowerCase() || "";
            bValue = b.province?.toLowerCase() || "";
            break;
          case "rating":
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case "reviews":
            aValue = a.review_count || 0;
            bValue = b.review_count || 0;
            break;
          case "enriched":
            // Sort by enrichment status (enriched first when asc)
            aValue = a.enrichment?.success ? 1 : 0;
            bValue = b.enrichment?.success ? 1 : 0;
            break;
          case "status":
            // Get call status
            const aStatus = callRecords[a.id]?.status || "not_called";
            const bStatus = callRecords[b.id]?.status || "not_called";
            // Define order: booked > calendar_sent > completed > in_progress > queued > failed > not_called
            const statusOrder: Record<string, number> = {
              booked: 7, calendar_sent: 6, completed: 5, in_progress: 4, 
              queued: 3, failed: 2, not_called: 1
            };
            aValue = statusOrder[aStatus] || 0;
            bValue = statusOrder[bStatus] || 0;
            break;
          default:
            return 0;
        }
        
        // Compare values
        if (aValue < bValue) return sortState.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortState.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [practitioners, hasEnrichment, hasEmails, hasTeamMembers, isMultilingual, sortState, callRecords]);

  // Virtual list setup
  const rowVirtualizer = useVirtualizer({
    count: filteredPractitioners.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 20,
  });

  // Handle checkbox click for selection
  const handleCheckboxClick = useCallback((practitioner: PractitionerData, index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    
    const newSelected = new Set(selectedIds);
    
    if (event.shiftKey && lastSelectedIndex !== null) {
      // Range selection
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      
      for (let i = start; i <= end; i++) {
        newSelected.add(practitioners[i].id);
      }
    } else {
      // Toggle single
      if (newSelected.has(practitioner.id)) {
        newSelected.delete(practitioner.id);
      } else {
        newSelected.add(practitioner.id);
      }
    }
    
    setSelectedIds(newSelected);
    setLastSelectedIndex(index);
  }, [selectedIds, lastSelectedIndex, practitioners]);

  // Handle row click to open detail drawer
  const handleRowClick = useCallback((practitioner: PractitionerData) => {
    setSelectedPractitioner(practitioner);
    setDetailDrawerOpen(true);
  }, []);

  // Select all visible
  const selectAll = () => {
    const newSelected = new Set(practitioners.map(p => p.id));
    setSelectedIds(newSelected);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedIds(new Set());
    setLastSelectedIndex(null);
  };

  // Get call status for a practitioner
  const getCallStatus = (practitionerId: string): CallStatus => {
    const record = callRecords[practitionerId];
    return record?.status || 'not_called';
  };

  // Start campaign with selected practitioners
  const startCampaign = async () => {
    const selectedPractitioners = practitioners.filter(p => selectedIds.has(p.id) && p.phone);
    
    if (selectedPractitioners.length === 0) {
      alert('Please select practitioners with phone numbers');
      return;
    }

    // Create call records for selected practitioners
    for (const p of selectedPractitioners) {
      if (!callRecords[p.id]) {
        createCallRecord({
          id: p.id,
          name: p.name,
          practitioner_type: p.practitioner_type,
          phone: p.phone || '',
          address: p.address,
          city: p.city,
          province: p.province,
        });
      }
    }

    loadCallRecords();
    setCampaignRunning(true);
    setCampaignPaused(false);
    setQueueDrawerOpen(true);
    
    // Show campaign started notification
    callNotifications.campaignStarted(selectedPractitioners.length);
    
    await batchCaller.current.startCampaign(selectedPractitioners);
  };

  // Pause campaign
  const pauseCampaign = () => {
    batchCaller.current.pauseCampaign();
    setCampaignPaused(true);
    callNotifications.campaignPaused();
  };

  // Resume campaign
  const resumeCampaign = () => {
    const selectedPractitioners = practitioners.filter(p => selectedIds.has(p.id) && p.phone);
    batchCaller.current.resumeCampaign(selectedPractitioners);
    setCampaignPaused(false);
  };

  // Stop campaign
  const stopCampaign = () => {
    batchCaller.current.stopCampaign();
    setCampaignRunning(false);
    setCampaignPaused(false);
    // Count booked appointments from current campaign
    const bookedCount = Object.values(callRecords).filter(
      r => r.status === 'booked' || r.status === 'calendar_sent'
    ).length;
    callNotifications.campaignCompleted(bookedCount);
  };

  // Export data
  const handleExport = () => {
    const data = exportRecords();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Quick call: search for practitioner by phone
  const handleQuickCallSearch = async () => {
    if (!quickCallPhone.trim()) return;
    
    setQuickCallSearching(true);
    setQuickCallResult(null);
    setQuickCallNotFound(false);
    
    try {
      const response = await fetch(`/api/practitioners?phone=${encodeURIComponent(quickCallPhone.trim())}`);
      const data = await response.json();
      
      if (data.practitioners && data.practitioners.length > 0) {
        const practitioner = data.practitioners[0];
        setQuickCallResult(practitioner);
        setQuickCallNotFound(false);
        
        // Auto-select pathway based on practitioner type
        const typeMapping: Record<string, string> = {
          'Chiropractor': 'chiropractor',
          'Chiropractors': 'chiropractor',
          'Massage Therapist': 'massage',
          'Massage Therapists': 'massage',
          'Registered Massage Therapist': 'massage',
          'Naturopath': 'naturopath',
          'Naturopaths': 'naturopath',
          'Naturopathic Doctor': 'naturopath',
          'Integrative Medicine': 'integrative',
          'Integrative Medicine Practitioner': 'integrative',
          'Functional Medicine': 'functional',
          'Functional Medicine Practitioner': 'functional',
          'Acupuncturist': 'acupuncturist',
          'Acupuncturists': 'acupuncturist',
        };
        
        const matchedType = Object.entries(typeMapping).find(
          ([key]) => practitioner.practitioner_type?.toLowerCase().includes(key.toLowerCase())
        );
        
        if (matchedType) {
          setQuickCallType(matchedType[1]);
        }
      } else {
        setQuickCallResult(null);
        setQuickCallNotFound(true);
      }
    } catch (error) {
      console.error('Quick call search failed:', error);
      setQuickCallNotFound(true);
    }
    
    setQuickCallSearching(false);
  };

  // Quick call: open practitioner detail from search result
  const handleQuickCallViewPractitioner = () => {
    if (quickCallResult) {
      setSelectedPractitioner(quickCallResult);
      setDetailDrawerOpen(true);
    }
  };

  // Quick call: call found practitioner with selected pathway
  const handleQuickCallWithPathway = async () => {
    if (!quickCallResult || !quickCallResult.phone) return;
    
    setQuickCallMaking(true);
    
    try {
      // Format phone number
      const phoneDigits = quickCallResult.phone.replace(/\D/g, '');
      const formattedPhone = phoneDigits.length === 10 
        ? `+1${phoneDigits}` 
        : phoneDigits.length === 11 && phoneDigits.startsWith('1')
          ? `+${phoneDigits}`
          : `+${phoneDigits}`;
      
      // Get pathway ID based on selected type
      const pathways: Record<string, string> = {
        chiropractor: "cf2233ef-7fb2-49ff-af29-0eee47204e9f",
        massage: "d202aad7-bcb6-478c-a211-b00877545e05",
        naturopath: "1d07d635-147e-4f69-a4cd-c124b33b073d",
        integrative: "1c958dd7-e1ff-4f6d-b9a3-f80a369c26aa",
        functional: "236dbd85-c74d-4774-a7af-4b5812015c68",
        acupuncturist: "154f93f4-54a5-4900-92e8-0fa217508127",
      };
      
      const callPayload = {
        phone_number: formattedPhone,
        pathway_id: pathways[quickCallType] || pathways.chiropractor,
        pathway_version: 1,
        knowledge_base: "b671527d-0c2d-4a21-9586-033dad3b0255",
        voice: "78c8543e-e5fe-448e-8292-20a7b8c45247",
        wait_for_greeting: true,
        record: true,
        max_duration: 15,
        webhook: "https://sales-enablement-six.vercel.app/api/webhooks/bland",
        metadata: {
          practitioner_id: quickCallResult.id,
          practitioner_name: quickCallResult.name,
          practitioner_type: quickCallResult.practitioner_type,
          selected_pathway: quickCallType,
          city: quickCallResult.city,
          province: quickCallResult.province,
        },
      };
      
      const response = await fetch('/api/bland/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callPayload),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        // Create call record
        createCallRecord({
          id: quickCallResult.id,
          name: quickCallResult.name,
          practitioner_type: quickCallResult.practitioner_type,
          phone: quickCallResult.phone,
          address: quickCallResult.address,
          city: quickCallResult.city,
          province: quickCallResult.province,
        });
        loadCallRecords();
        
        callNotifications.started(quickCallResult.name);
        setQuickCallPhone('');
        setQuickCallResult(null);
      } else {
        callNotifications.failed(quickCallResult.name);
      }
    } catch (error) {
      console.error('Quick call failed:', error);
      callNotifications.failed('Unknown', 'Failed to initiate call');
    }
    
    setQuickCallMaking(false);
  };

  // Quick call: make manual call (no practitioner context)
  const handleQuickCallManual = async () => {
    if (!quickCallPhone.trim()) return;
    
    setQuickCallMaking(true);
    
    try {
      // Format phone number
      const phoneDigits = quickCallPhone.replace(/\D/g, '');
      const formattedPhone = phoneDigits.length === 10 
        ? `+1${phoneDigits}` 
        : phoneDigits.length === 11 && phoneDigits.startsWith('1')
          ? `+${phoneDigits}`
          : `+${phoneDigits}`;
      
      // Get pathway ID
      const pathways: Record<string, string> = {
        chiropractor: "cf2233ef-7fb2-49ff-af29-0eee47204e9f",
        massage: "d202aad7-bcb6-478c-a211-b00877545e05",
        naturopath: "1d07d635-147e-4f69-a4cd-c124b33b073d",
        integrative: "1c958dd7-e1ff-4f6d-b9a3-f80a369c26aa",
        functional: "236dbd85-c74d-4774-a7af-4b5812015c68",
        acupuncturist: "154f93f4-54a5-4900-92e8-0fa217508127",
      };
      
      const callPayload = {
        phone_number: formattedPhone,
        pathway_id: pathways[quickCallType] || pathways.chiropractor,
        pathway_version: 1,
        knowledge_base: "b671527d-0c2d-4a21-9586-033dad3b0255",
        voice: "78c8543e-e5fe-448e-8292-20a7b8c45247",
        wait_for_greeting: true,
        record: true,
        max_duration: 15,
        webhook: "https://sales-enablement-six.vercel.app/api/webhooks/bland",
      };
      
      const response = await fetch('/api/bland/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callPayload),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        alert(`Call started! ID: ${result.call_id}`);
        setQuickCallPhone('');
      } else {
        alert(`Call failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Quick call failed:', error);
      alert('Failed to initiate call');
    }
    
    setQuickCallMaking(false);
  };

  // Handle call started from detail drawer
  const handleCallStarted = (callId: string) => {
    loadCallRecords();
    setQueueDrawerOpen(true);
    if (selectedPractitioner) {
      callNotifications.started(selectedPractitioner.name);
    }
    console.log('Call started:', callId);
  };

  // Handle quick call to a practitioner
  const handleQuickCall = (practitioner: PractitionerData) => {
    setSelectedPractitioner(practitioner);
    setDetailDrawerOpen(true);
    // The actual call will be initiated from the detail drawer
  };

  // Stats come from useSupabaseCallRecords hook

  // Filter state object for FilterPanel
  const filterState: FilterState = {
    search,
    province,
    city,
    practitionerType,
    minRating,
    hasPhoneOnly,
    hasWebsiteOnly,
    callStatus: callStatusFilter,
    minReviews,
    hasEnrichment,
    hasEmails,
    hasTeamMembers,
    isMultilingual,
  };

  // Handle filter changes from FilterPanel
  const handleFilterChange = (changes: Partial<FilterState>) => {
    if (changes.search !== undefined) setSearch(changes.search);
    if (changes.province !== undefined) {
      setProvince(changes.province);
      if (!changes.city) setCity("");
    }
    if (changes.city !== undefined) setCity(changes.city);
    if (changes.practitionerType !== undefined) setPractitionerType(changes.practitionerType);
    if (changes.minRating !== undefined) setMinRating(changes.minRating);
    if (changes.hasPhoneOnly !== undefined) setHasPhoneOnly(changes.hasPhoneOnly);
    if (changes.hasWebsiteOnly !== undefined) setHasWebsiteOnly(changes.hasWebsiteOnly);
    if (changes.callStatus !== undefined) setCallStatusFilter(changes.callStatus);
    if (changes.minReviews !== undefined) setMinReviews(changes.minReviews);
    // Enrichment filters
    if (changes.hasEnrichment !== undefined) setHasEnrichment(changes.hasEnrichment);
    if (changes.hasEmails !== undefined) setHasEmails(changes.hasEmails);
    if (changes.hasTeamMembers !== undefined) setHasTeamMembers(changes.hasTeamMembers);
    if (changes.isMultilingual !== undefined) setIsMultilingual(changes.isMultilingual);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearch("");
    setProvince("");
    setCity("");
    setPractitionerType("");
    setMinRating("");
    setHasPhoneOnly(true);
    setHasWebsiteOnly(false);
    setCallStatusFilter([]);
    setMinReviews(0);
    setHasEnrichment(false);
    setHasEmails(false);
    setHasTeamMembers(false);
    setIsMultilingual(false);
  };

  // Count active filters
  const activeFilterCount = [
    search,
    province,
    city,
    practitionerType,
    minRating,
    !hasPhoneOnly, // Default is true, so only count if false
    hasWebsiteOnly,
    callStatusFilter.length > 0,
    minReviews > 0,
  ].filter(Boolean).length;

  // Get queued/active calls
  const queuedCalls = Object.values(callRecords).filter(r => r.status === 'queued');
  const activeCalls = Object.values(callRecords).filter(r => r.status === 'in_progress');
  const recentCalls = Object.values(callRecords)
    .filter(r => ['completed', 'booked', 'calendar_sent', 'failed'].includes(r.status))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className="hidden lg:flex"
            >
              {filterPanelOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6" />
                Call Center
              </h1>
              <p className="text-muted-foreground text-sm">
                {pagination.total.toLocaleString()} practitioners in database
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Global Search Trigger */}
            <CommandSearchTrigger onClick={() => commandSearch.setOpen(true)} />
            
            {/* Mobile Filter Trigger */}
            <div className="lg:hidden">
              <FilterSheetTrigger
                activeFilterCount={activeFilterCount}
                onClick={() => setFilterSheetOpen(true)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Sheet open={queueDrawerOpen} onOpenChange={setQueueDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListChecks className="w-4 h-4 mr-2" />
                  Call Queue
                  {(queuedCalls.length + activeCalls.length) > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {queuedCalls.length + activeCalls.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] p-0">
                <SheetHeader className="p-6 pb-0">
                  <SheetTitle>Call Queue & Activity</SheetTitle>
                  <SheetDescription>
                    Monitor active calls and recent activity
                  </SheetDescription>
                </SheetHeader>
                <Tabs defaultValue="queue" className="mt-4">
                  <div className="px-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="queue" className="gap-2">
                        <ListChecks className="w-4 h-4" />
                        Queue
                        {(queuedCalls.length + activeCalls.length) > 0 && (
                          <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                            {queuedCalls.length + activeCalls.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="activity" className="gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Activity
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="queue" className="mt-4 px-6 pb-6">
                    <div className="space-y-4">
                      {/* Active Call */}
                      {activeCalls.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <PhoneCall className="w-4 h-4 text-blue-500" />
                            Active Call
                          </h4>
                          {activeCalls.map(call => (
                            <Card key={call.practitioner_id} className="border-blue-200 bg-blue-50">
                              <CardContent className="p-3">
                                <p className="font-medium">{call.practitioner_name}</p>
                                <p className="text-sm text-muted-foreground">{call.phone}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Started: {new Date(call.call_started_at!).toLocaleTimeString()}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Queued Calls */}
                      {queuedCalls.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            Queued ({queuedCalls.length})
                          </h4>
                          <ScrollArea className="h-[200px]">
                            {queuedCalls.map(call => (
                              <div key={call.practitioner_id} className="flex items-center justify-between py-2 border-b">
                                <div>
                                  <p className="text-sm font-medium">{call.practitioner_name}</p>
                                  <p className="text-xs text-muted-foreground">{call.city}, {call.province}</p>
                                </div>
                                <Badge variant="outline" className="bg-yellow-50">Queued</Badge>
                              </div>
                            ))}
                          </ScrollArea>
                        </div>
                      )}

                      {/* Recent Calls Summary */}
                      {recentCalls.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Recent ({recentCalls.length})
                          </h4>
                          <ScrollArea className="h-[250px]">
                            {recentCalls.map(call => (
                              <div key={call.practitioner_id} className="py-2 border-b">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{call.practitioner_name}</p>
                                  <Badge className={STATUS_COLORS[call.status]}>
                                    {STATUS_LABELS[call.status]}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {call.duration_seconds ? `${Math.floor(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s` : 'N/A'}
                                  {call.appointment_booked && ' • Appointment booked'}
                                </p>
                              </div>
                            ))}
                          </ScrollArea>
                        </div>
                      )}

                      {queuedCalls.length === 0 && activeCalls.length === 0 && recentCalls.length === 0 && (
                        <QueueEmpty 
                          onAddPractitioners={() => setActiveTab("practitioners")}
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-0 h-[calc(100vh-200px)]">
                    <ActivityFeed
                      records={callRecords}
                      onItemClick={(record) => {
                        const practitioner = practitioners.find(p => p.id === record.practitioner_id);
                        if (practitioner) {
                          setSelectedPractitioner(practitioner);
                          setDetailDrawerOpen(true);
                        }
                      }}
                      autoRefresh
                    />
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* KPI Cards Dashboard */}
      <div className="border-b px-6 py-4 bg-muted/20">
        <KPICards 
          stats={stats}
          callsToday={Object.values(callRecords).filter(r => {
            const today = new Date().toDateString();
            return new Date(r.created_at).toDateString() === today;
          }).length}
          callsYesterday={Object.values(callRecords).filter(r => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return new Date(r.created_at).toDateString() === yesterday.toDateString();
          }).length}
        />
      </div>

      {/* Main Content Area with Filter Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Filter Panel Sidebar - Desktop */}
        {filterPanelOpen && (
          <div className="hidden lg:flex w-72 border-r bg-muted/20 p-4 flex-shrink-0">
            <FilterPanel
              metadata={metadata}
              filters={filterState}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
            />
          </div>
        )}

        {/* Mobile Filter Sheet */}
        <FilterSheet
          open={filterSheetOpen}
          onOpenChange={setFilterSheetOpen}
          metadata={metadata}
          filters={filterState}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          practitionerCount={pagination.total}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b px-6">
            <TabsList className="h-12">
              <TabsTrigger value="practitioners" className="gap-2">
                <Users className="w-4 h-4" />
                Practitioner List
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="gap-2">
                <Kanban className="w-4 h-4" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="quick-call" className="gap-2">
                <Zap className="w-4 h-4" />
                Quick Call
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <MapPin className="w-4 h-4" />
                Map
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <History className="w-4 h-4" />
                Timeline
              </TabsTrigger>
            </TabsList>
          </div>

        {/* Practitioner List Tab */}
        <TabsContent value="practitioners" className="flex-1 flex flex-col overflow-hidden m-0">
          {/* Filters */}
      <div className="border-b px-6 py-4">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] max-w-[300px]">
            <Label className="text-xs mb-1 block">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="w-[180px]">
            <Label className="text-xs mb-1 block">Province</Label>
            <Select value={province || "_all"} onValueChange={(v) => { setProvince(v === "_all" ? "" : v); setCity(""); }}>
              <SelectTrigger>
                <SelectValue placeholder="All provinces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All provinces</SelectItem>
                {metadata?.provinces.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[180px]">
            <Label className="text-xs mb-1 block">City</Label>
            <Select value={city || "_all"} onValueChange={(v) => setCity(v === "_all" ? "" : v)} disabled={!province}>
              <SelectTrigger>
                <SelectValue placeholder={province ? "Select city" : "Select province first"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All cities</SelectItem>
                {availableCities.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[180px]">
            <Label className="text-xs mb-1 block">Type</Label>
            <Select value={practitionerType || "_all"} onValueChange={(v) => setPractitionerType(v === "_all" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All types</SelectItem>
                {metadata?.types.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[120px]">
            <Label className="text-xs mb-1 block">Min Rating</Label>
            <Select value={minRating || "_all"} onValueChange={(v) => setMinRating(v === "_all" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Any rating</SelectItem>
                <SelectItem value="3">3+ stars</SelectItem>
                <SelectItem value="4">4+ stars</SelectItem>
                <SelectItem value="4.5">4.5+ stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Column Visibility */}
          <ColumnVisibilityMenu 
            columns={columns} 
            onToggleColumn={toggleColumn} 
          />

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setProvince("");
              setCity("");
              setPractitionerType("");
              setSearch("");
              setMinRating("");
            }}
          >
            Clear filters
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Table Header */}
          <div className="flex items-center px-6 py-2 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
            {visibleColumns.find(c => c.id === "select") && (
              <div className="w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.size > 0 && selectedIds.size === practitioners.length}
                  onChange={(e) => e.target.checked ? selectAll() : clearSelection()}
                  className="rounded"
                />
              </div>
            )}
            {visibleColumns.find(c => c.id === "name") && (
              <div className="flex-1 min-w-[200px]">
                <SortableHeader 
                  column={columns.find(c => c.id === "name")!} 
                  sortState={sortState} 
                  onSort={handleSort} 
                />
              </div>
            )}
            {visibleColumns.find(c => c.id === "type") && (
              <div className="w-[140px]">
                <SortableHeader 
                  column={columns.find(c => c.id === "type")!} 
                  sortState={sortState} 
                  onSort={handleSort} 
                />
              </div>
            )}
            {visibleColumns.find(c => c.id === "city") && (
              <div className="w-[120px]">
                <SortableHeader 
                  column={columns.find(c => c.id === "city")!} 
                  sortState={sortState} 
                  onSort={handleSort} 
                />
              </div>
            )}
            {visibleColumns.find(c => c.id === "province") && (
              <div className="w-[100px]">
                <SortableHeader 
                  column={columns.find(c => c.id === "province")!} 
                  sortState={sortState} 
                  onSort={handleSort} 
                />
              </div>
            )}
            {visibleColumns.find(c => c.id === "rating") && (
              <div className="w-[80px] text-center">
                <SortableHeader 
                  column={columns.find(c => c.id === "rating")!} 
                  sortState={sortState} 
                  onSort={handleSort} 
                />
              </div>
            )}
            {visibleColumns.find(c => c.id === "reviews") && (
              <div className="w-[80px] text-center">
                <SortableHeader 
                  column={columns.find(c => c.id === "reviews")!} 
                  sortState={sortState} 
                  onSort={handleSort} 
                />
              </div>
            )}
            {visibleColumns.find(c => c.id === "phone") && (
              <div className="w-[120px]">Phone</div>
            )}
            {visibleColumns.find(c => c.id === "enriched") && (
              <div className="w-[90px] text-center">
                <SortableHeader 
                  column={columns.find(c => c.id === "enriched")!} 
                  sortState={sortState} 
                  onSort={handleSort} 
                />
              </div>
            )}
            {visibleColumns.find(c => c.id === "status") && (
              <div className="w-[100px] text-center">
                <SortableHeader 
                  column={columns.find(c => c.id === "status")!} 
                  sortState={sortState} 
                  onSort={handleSort} 
                />
              </div>
            )}
            <div className="w-10"></div> {/* Actions column */}
          </div>

          {/* Virtual List */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPractitioners.length === 0 ? (
            <NoPractitionersFound 
              onClearFilters={() => {
                setProvince("");
                setCity("");
                setPractitionerType("");
                setSearch("");
                setMinRating("");
                setHasEnrichment(false);
                setHasEmails(false);
                setHasTeamMembers(false);
                setIsMultilingual(false);
              }}
            />
          ) : (
            <div ref={parentRef} className="flex-1 overflow-auto">
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const practitioner = filteredPractitioners[virtualRow.index];
                  const isSelected = selectedIds.has(practitioner.id);
                  const status = getCallStatus(practitioner.id);

                  return (
                    <div
                      key={practitioner.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className={`flex items-center px-6 border-b cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-950/30' : 'hover:bg-muted/30'
                      }`}
                      onClick={() => handleRowClick(practitioner)}
                    >
                      {visibleColumns.find(c => c.id === "select") && (
                        <div className="w-10" onClick={(e) => handleCheckboxClick(practitioner, virtualRow.index, e)}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded cursor-pointer"
                          />
                        </div>
                      )}
                      {visibleColumns.find(c => c.id === "name") && (
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{practitioner.name}</p>
                            {/* Quick enrichment indicators (compact) */}
                            {practitioner.enrichment?.success && practitioner.enrichment?.data && (
                              <div className="flex items-center gap-0.5 flex-shrink-0">
                                {practitioner.enrichment.data.practitioners?.length > 0 && (
                                  <span 
                                    className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-[9px] font-bold flex items-center justify-center"
                                    title={`${practitioner.enrichment.data.practitioners.length} team member(s)`}
                                  >
                                    {practitioner.enrichment.data.practitioners.length}
                                  </span>
                                )}
                                {practitioner.enrichment.data.emails?.length > 0 && (
                                  <span 
                                    className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[9px] flex items-center justify-center"
                                    title={`${practitioner.enrichment.data.emails.length} email(s)`}
                                  >
                                    ✉
                                  </span>
                                )}
                                {practitioner.enrichment.data.languages?.length > 1 && (
                                  <span 
                                    className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-[9px] flex items-center justify-center"
                                    title={`Multilingual: ${practitioner.enrichment.data.languages.join(', ')}`}
                                  >
                                    🌍
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{practitioner.address}</p>
                        </div>
                      )}
                      {visibleColumns.find(c => c.id === "type") && (
                        <div className="w-[140px] text-sm text-muted-foreground truncate">
                          {practitioner.practitioner_type}
                        </div>
                      )}
                      {visibleColumns.find(c => c.id === "city") && (
                        <div className="w-[120px] text-sm">{practitioner.city}</div>
                      )}
                      {visibleColumns.find(c => c.id === "province") && (
                        <div className="w-[100px] text-sm text-muted-foreground">{practitioner.province}</div>
                      )}
                      {visibleColumns.find(c => c.id === "rating") && (
                        <div className="w-[80px] text-center">
                          {practitioner.rating ? (
                            <span className="flex items-center justify-center gap-1 text-sm">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {practitioner.rating}
                            </span>
                          ) : '-'}
                        </div>
                      )}
                      {visibleColumns.find(c => c.id === "reviews") && (
                        <div className="w-[80px] text-center text-sm text-muted-foreground">
                          {practitioner.review_count || 0}
                        </div>
                      )}
                      {visibleColumns.find(c => c.id === "phone") && (
                        <div className="w-[120px] text-sm text-muted-foreground">
                          {practitioner.phone || '-'}
                        </div>
                      )}
                      {visibleColumns.find(c => c.id === "enriched") && (
                        <div className="w-[90px] text-center">
                          {practitioner.enrichment?.success && practitioner.enrichment?.data ? (
                            <span 
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 text-purple-700 dark:text-purple-300 text-[10px] font-medium"
                              title={`Enriched: ${practitioner.enrichment.data.practitioners?.length || 0} team members, ${practitioner.enrichment.data.emails?.length || 0} emails, ${practitioner.enrichment.data.services?.length || 0} services`}
                            >
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/>
                              </svg>
                              Yes
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      )}
                      {visibleColumns.find(c => c.id === "status") && (
                        <div className="w-[100px] text-center">
                          <Badge className={`${STATUS_COLORS[status]} text-xs`}>
                            {STATUS_LABELS[status]}
                          </Badge>
                        </div>
                      )}
                      {/* Row Actions */}
                      <div className="w-10">
                        <RowActionsMenu
                          onView={() => handleRowClick(practitioner)}
                          onCall={() => handleQuickCall(practitioner)}
                          onAddToQueue={() => {
                            if (!callRecords[practitioner.id]) {
                              createCallRecord({
                                id: practitioner.id,
                                name: practitioner.name,
                                practitioner_type: practitioner.practitioner_type,
                                phone: practitioner.phone || "",
                                address: practitioner.address,
                                city: practitioner.city,
                                province: practitioner.province,
                              });
                            }
                          }}
                          disabled={!practitioner.phone}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load more trigger */}
              {pagination.hasMore && (
                <div className="p-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={loadMorePractitioners}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Load More ({filteredPractitioners.length}{filteredPractitioners.length !== practitioners.length ? ` filtered / ${practitioners.length} loaded` : ''} of {pagination.total})
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

          {/* Selection Action Bar */}
          {selectedIds.size > 0 && (
            <div className="border-t px-6 py-3 bg-blue-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {selectedIds.size} practitioner{selectedIds.size !== 1 ? 's' : ''} selected
                </span>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear selection
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {campaignRunning ? (
                  <>
                    {campaignPaused ? (
                      <Button onClick={resumeCampaign} size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    ) : (
                      <Button onClick={pauseCampaign} variant="outline" size="sm">
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={stopCampaign} variant="destructive" size="sm">
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </>
                ) : (
                  <Button onClick={startCampaign} size="sm">
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Start Calling ({selectedIds.size})
                  </Button>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="flex-1 m-0 overflow-hidden">
          {Object.keys(callRecords).length === 0 ? (
            <NoPipelineData 
              onAddToQueue={() => setActiveTab("practitioners")}
            />
          ) : (
            <PipelineBoard
              records={callRecords}
              onCardClick={(record) => {
                // Find the practitioner data and open detail drawer
                const practitioner = practitioners.find(p => p.id === record.practitioner_id);
                if (practitioner) {
                  setSelectedPractitioner(practitioner);
                  setDetailDrawerOpen(true);
                }
              }}
            />
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="flex-1 m-0 overflow-hidden">
          {Object.keys(callRecords).length === 0 ? (
            <NoAnalyticsData 
              onMakeCalls={() => setActiveTab("practitioners")}
            />
          ) : (
            <AnalyticsDashboard records={callRecords} stats={stats} />
          )}
        </TabsContent>

        {/* Quick Call Tab */}
        <TabsContent value="quick-call" className="flex-1 m-0 p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Call
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter a phone number to search for a practitioner in our database. 
                  If found, you can call with full context. If not, make a manual call.
                </p>

                <div className="space-y-4">
                  {/* Phone Number Input */}
                  <div>
                    <Label htmlFor="quick-phone">Phone Number</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="quick-phone"
                        placeholder="(555) 123-4567"
                        value={quickCallPhone}
                        onChange={(e) => {
                          setQuickCallPhone(e.target.value);
                          setQuickCallResult(null);
                          setQuickCallNotFound(false);
                        }}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleQuickCallSearch}
                        disabled={!quickCallPhone.trim() || quickCallSearching}
                      >
                        {quickCallSearching ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        <span className="ml-2">Search</span>
                      </Button>
                    </div>
                  </div>

                  {/* Search Result: Practitioner Found */}
                  {quickCallResult && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-green-800">Practitioner Found!</p>
                              <p className="font-semibold mt-1">{quickCallResult.name}</p>
                              <p className="text-sm text-muted-foreground">{quickCallResult.practitioner_type}</p>
                              <p className="text-sm text-muted-foreground">{quickCallResult.address}</p>
                              <p className="text-sm text-muted-foreground">{quickCallResult.city}, {quickCallResult.province}</p>
                              {quickCallResult.rating && (
                                <p className="text-sm flex items-center gap-1 mt-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {quickCallResult.rating} ({quickCallResult.review_count} reviews)
                                </p>
                              )}
                            </div>
                            <Button variant="outline" size="sm" onClick={handleQuickCallViewPractitioner}>
                              View Details
                            </Button>
                          </div>
                          
                          {/* Pathway Selection for Found Practitioner */}
                          <div className="pt-3 border-t border-green-200">
                            <Label htmlFor="quick-type-found" className="text-green-800">Conversational Pathway</Label>
                            <p className="text-xs text-green-700 mb-2">Select the script/pathway to use for this call</p>
                            <Select value={quickCallType} onValueChange={setQuickCallType}>
                              <SelectTrigger className="mt-1 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="chiropractor">🦴 Chiropractor</SelectItem>
                                <SelectItem value="massage">💆 Massage Therapist</SelectItem>
                                <SelectItem value="naturopath">🌿 Naturopath</SelectItem>
                                <SelectItem value="integrative">⚕️ Integrative Medicine</SelectItem>
                                <SelectItem value="functional">🔬 Functional Medicine</SelectItem>
                                <SelectItem value="acupuncturist">📍 Acupuncturist</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Button 
                            onClick={handleQuickCallWithPathway}
                            disabled={quickCallMaking}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            {quickCallMaking ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Phone className="w-4 h-4 mr-2" />
                            )}
                            Call with Selected Pathway
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Search Result: Not Found */}
                  {quickCallNotFound && (
                    <Card className="border-yellow-200 bg-yellow-50">
                      <CardContent className="pt-4">
                        <p className="font-medium text-yellow-800 mb-3">
                          No practitioner found with this phone number
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          You can still make a manual call. Select the appropriate conversational pathway below.
                        </p>

                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="quick-type">Conversational Pathway</Label>
                            <p className="text-xs text-muted-foreground mb-2">Select the script/pathway to use for this call</p>
                            <Select value={quickCallType} onValueChange={setQuickCallType}>
                              <SelectTrigger className="mt-1 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="chiropractor">🦴 Chiropractor</SelectItem>
                                <SelectItem value="massage">💆 Massage Therapist</SelectItem>
                                <SelectItem value="naturopath">🌿 Naturopath</SelectItem>
                                <SelectItem value="integrative">⚕️ Integrative Medicine</SelectItem>
                                <SelectItem value="functional">🔬 Functional Medicine</SelectItem>
                                <SelectItem value="acupuncturist">📍 Acupuncturist</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button 
                            onClick={handleQuickCallManual}
                            disabled={quickCallMaking}
                            className="w-full"
                          >
                            {quickCallMaking ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Phone className="w-4 h-4 mr-2" />
                            )}
                            Call with Selected Pathway
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Instructions */}
                  {!quickCallResult && !quickCallNotFound && (
                    <div className="text-sm text-muted-foreground border rounded-lg p-4 bg-muted/30">
                      <p className="font-medium mb-2">How it works:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Enter a phone number and click Search</li>
                        <li>If we find a matching practitioner, you can call with full context</li>
                        <li>If not found, you can still make a manual call</li>
                        <li>All calls are logged and tracked in the Call Queue</li>
                      </ol>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map" className="flex-1 m-0 overflow-hidden flex flex-col">
          {/* Load All Banner */}
          {!allPractitionersLoaded && pagination.hasMore && (
            <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
                <MapPin className="w-4 h-4" />
                <span>
                  Showing <strong>{filteredPractitioners.length}</strong> of <strong>{pagination.total.toLocaleString()}</strong> practitioners. 
                  Load all to see the complete map.
                </span>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={loadAllPractitioners}
                disabled={loadingAllPractitioners}
                className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/50"
              >
                {loadingAllPractitioners ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Load All ({pagination.total.toLocaleString()})
                  </>
                )}
              </Button>
            </div>
          )}
          
          {/* Map Component */}
          <div className="flex-1">
            {filteredPractitioners.filter(p => p.latitude && p.longitude).length === 0 ? (
              <NoMapData 
                onLoadPractitioners={() => loadAllPractitioners()}
              />
            ) : (
              <PractitionerMap 
                practitioners={filteredPractitioners.map(p => ({
                  id: p.id,
                  name: p.name,
                  address: p.address,
                  city: p.city,
                  province: p.province,
                  phone: p.phone || undefined,
                  practitioner_type: p.practitioner_type,
                  latitude: p.latitude,
                  longitude: p.longitude,
                  rating: p.rating ? Number(p.rating) : undefined,
                  review_count: p.review_count ? Number(p.review_count) : undefined,
                }))}
                callRecords={callRecords}
                selectedProvince={province}
                selectedCity={city}
                onPractitionerClick={(practitioner) => {
                  const full = practitioners.find(p => p.id === practitioner.id);
                  if (full) {
                    setSelectedPractitioner(full);
                    setDetailDrawerOpen(true);
                  }
                }}
              />
            )}
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="flex-1 m-0 overflow-hidden">
          {Object.keys(callRecords).length === 0 ? (
            <NoCallsYet 
              onStartCampaign={() => setActiveTab("practitioners")}
            />
          ) : (
            <CallTimeline 
              records={callRecords}
              onEventClick={(record) => {
                const practitioner = practitioners.find(p => p.id === record.practitioner_id);
                if (practitioner) {
                  setSelectedPractitioner(practitioner);
                  setDetailDrawerOpen(true);
                }
              }}
            />
          )}
        </TabsContent>
        </Tabs>
      </div>

      {/* Practitioner Detail Drawer */}
      <PractitionerDetailDrawer
        practitioner={selectedPractitioner}
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        onCallStarted={handleCallStarted}
      />

      {/* Global Command Search */}
      <CommandSearch
        practitioners={practitioners}
        open={commandSearch.open}
        onOpenChange={commandSearch.setOpen}
        onSelect={(practitioner, action) => {
          if (action === "view") {
            setSelectedPractitioner(practitioner as PractitionerData);
            setDetailDrawerOpen(true);
          } else if (action === "call") {
            handleQuickCall(practitioner as PractitionerData);
          } else if (action === "queue") {
            if (!callRecords[practitioner.id]) {
              createCallRecord({
                id: practitioner.id,
                name: practitioner.name,
                practitioner_type: practitioner.practitioner_type,
                phone: practitioner.phone || "",
                address: practitioner.address,
                city: practitioner.city,
                province: practitioner.province,
              });
            }
          }
        }}
      />
    </div>
  );
}

// Wrapper component with Suspense for useSearchParams
export default function CampaignPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Call Center...</p>
        </div>
      </div>
    }>
      <CampaignPageContent />
    </Suspense>
  );
}
