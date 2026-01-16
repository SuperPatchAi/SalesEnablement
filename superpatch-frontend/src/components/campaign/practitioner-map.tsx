"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton-loaders";
import {
  MapPin,
  Phone,
  Star,
  Users,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CampaignCallRecord } from "@/lib/campaign-storage";
import { CallStatus } from "@/lib/db/types";

// Dynamically import leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Status colors for markers
const STATUS_MARKER_COLORS: Record<CallStatus | "default", string> = {
  not_called: "#6b7280",
  queued: "#eab308",
  in_progress: "#3b82f6",
  completed: "#22c55e",
  booked: "#a855f7",
  calendar_sent: "#a855f7",
  voicemail: "#f97316",
  failed: "#ef4444",
  default: "#6b7280",
};

interface Practitioner {
  id: string;
  name: string;
  practitioner_type: string;
  address: string;
  city: string;
  province: string;
  phone?: string | null;
  rating?: number | null;
  review_count?: number | null;
  latitude?: number;
  longitude?: number;
}

interface PractitionerMapProps {
  practitioners: Practitioner[];
  callRecords: Record<string, CampaignCallRecord>;
  onPractitionerClick?: (practitioner: Practitioner) => void;
  selectedCountry?: string;
  selectedProvince?: string;
  selectedCity?: string;
  className?: string;
  height?: number;
}

// Map control component
function MapControls() {
  // This will be rendered inside the map but needs the hook
  return null;
}

// Create custom marker icons based on status
function createMarkerIcon(color: string): L.DivIcon | undefined {
  if (typeof window === "undefined") return undefined;
  
  const L = require("leaflet");
  
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
}

// Cluster markers by location
interface LocationCluster {
  city: string;
  province: string;
  lat: number;
  lng: number;
  practitioners: Practitioner[];
  statuses: Record<CallStatus | "default", number>;
}

function clusterByLocation(
  practitioners: Practitioner[],
  callRecords: Record<string, CampaignCallRecord>
): LocationCluster[] {
  const clusters: Record<string, LocationCluster> = {};

  practitioners.forEach((p) => {
    if (!p.latitude || !p.longitude) return;

    const key = `${p.city}-${p.province}`;
    const status = callRecords[p.id]?.status || "default";

    if (!clusters[key]) {
      clusters[key] = {
        city: p.city,
        province: p.province,
        lat: p.latitude,
        lng: p.longitude,
        practitioners: [],
        statuses: {
          not_called: 0,
          queued: 0,
          in_progress: 0,
          completed: 0,
          booked: 0,
          calendar_sent: 0,
          voicemail: 0,
          failed: 0,
          default: 0,
        },
      };
    }

    clusters[key].practitioners.push(p);
    clusters[key].statuses[status]++;
  });

  return Object.values(clusters);
}

// Practitioner popup content
function PractitionerPopup({
  practitioner,
  status,
  onViewDetails,
}: {
  practitioner: Practitioner;
  status: CallStatus | "default";
  onViewDetails?: () => void;
}) {
  const statusLabels: Record<CallStatus | "default", string> = {
    not_called: "Not Called",
    queued: "Queued",
    in_progress: "In Progress",
    completed: "Completed",
    booked: "Booked",
    calendar_sent: "Calendar Sent",
    voicemail: "Voicemail",
    failed: "Failed",
    default: "Not Called",
  };

  return (
    <div className="min-w-[200px] p-1">
      <h4 className="font-semibold text-sm mb-1">{practitioner.name}</h4>
      <p className="text-xs text-muted-foreground mb-2">{practitioner.practitioner_type}</p>
      
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span>{practitioner.address}</span>
        </div>
        {practitioner.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-muted-foreground" />
            <span>{practitioner.phone}</span>
          </div>
        )}
        {practitioner.rating && (
          <div className="flex items-center gap-1.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{practitioner.rating} ({practitioner.review_count || 0} reviews)</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t">
        <Badge
          style={{
            backgroundColor: `${STATUS_MARKER_COLORS[status]}20`,
            color: STATUS_MARKER_COLORS[status],
          }}
          className="text-[10px]"
        >
          {statusLabels[status]}
        </Badge>
        {onViewDetails && (
          <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={onViewDetails}>
            View Details
          </Button>
        )}
      </div>
    </div>
  );
}

// Cluster popup content
function ClusterPopup({
  cluster,
  onViewCity,
}: {
  cluster: LocationCluster;
  onViewCity?: () => void;
}) {
  const total = cluster.practitioners.length;
  const statusEntries = Object.entries(cluster.statuses).filter(([_, count]) => count > 0);

  return (
    <div className="min-w-[180px] p-1">
      <h4 className="font-semibold text-sm mb-1">{cluster.city}</h4>
      <p className="text-xs text-muted-foreground mb-2">{cluster.province}</p>
      
      <div className="flex items-center gap-1.5 mb-2">
        <Users className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-sm font-medium">{total} practitioners</span>
      </div>

      <div className="space-y-1">
        {statusEntries.map(([status, count]) => (
          <div key={status} className="flex items-center justify-between text-xs">
            <span
              className="flex items-center gap-1.5"
              style={{ color: STATUS_MARKER_COLORS[status as CallStatus | "default"] }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: STATUS_MARKER_COLORS[status as CallStatus | "default"] }}
              />
              {status.replace("_", " ")}
            </span>
            <span className="font-medium">{count}</span>
          </div>
        ))}
      </div>

      {onViewCity && (
        <Button
          size="sm"
          variant="outline"
          className="w-full mt-3 h-7 text-xs"
          onClick={onViewCity}
        >
          Filter by {cluster.city}
        </Button>
      )}
    </div>
  );
}

// Map loading skeleton
function MapSkeleton({ height }: { height: number }) {
  return (
    <div
      className="relative bg-muted rounded-lg overflow-hidden"
      style={{ height }}
    >
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50 animate-bounce" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    </div>
  );
}

export function PractitionerMap({
  practitioners,
  callRecords,
  onPractitionerClick,
  selectedCountry,
  selectedProvince,
  selectedCity,
  className,
  height = 500,
}: PractitionerMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState<"markers" | "clusters">("clusters");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Only render map on client
  useEffect(() => {
    setIsClient(true);
    // Import leaflet CSS dynamically
    if (typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  // Filter practitioners with coordinates
  const practitionersWithCoords = useMemo(
    () => practitioners.filter((p) => p.latitude && p.longitude),
    [practitioners]
  );

  // Cluster data
  const clusters = useMemo(
    () => clusterByLocation(practitionersWithCoords, callRecords),
    [practitionersWithCoords, callRecords]
  );

  // Calculate map center and zoom based on data spread
  const { mapCenter, mapZoom } = useMemo(() => {
    if (practitionersWithCoords.length === 0) {
      // Default to North America center
      return { 
        mapCenter: { lat: 45.0, lng: -100.0 }, 
        mapZoom: 4 
      };
    }

    // If city is selected, center on that city with high zoom
    if (selectedCity) {
      const cityPractitioner = practitionersWithCoords.find(
        (p) => p.city === selectedCity
      );
      if (cityPractitioner) {
        return { 
          mapCenter: { lat: cityPractitioner.latitude!, lng: cityPractitioner.longitude! },
          mapZoom: 12
        };
      }
    }

    // Calculate bounds
    const lats = practitionersWithCoords.map(p => p.latitude!);
    const lngs = practitionersWithCoords.map(p => p.longitude!);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Calculate center
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    // Calculate appropriate zoom based on bounds spread
    const latSpread = maxLat - minLat;
    const lngSpread = maxLng - minLng;
    const maxSpread = Math.max(latSpread, lngSpread);
    
    // Determine zoom level based on geographic spread
    let zoom = 5;
    if (maxSpread > 40) zoom = 3;       // North America scale (US + Canada)
    else if (maxSpread > 20) zoom = 4;  // Large region
    else if (maxSpread > 10) zoom = 5;  // Country/state scale
    else if (maxSpread > 5) zoom = 6;   // Multi-state
    else if (maxSpread > 2) zoom = 7;   // State scale
    else if (maxSpread > 1) zoom = 8;   // Regional
    else zoom = 10;                      // City scale
    
    // If province is selected but not city, use moderate zoom
    if (selectedProvince && !selectedCity) {
      zoom = Math.max(zoom, 6);
    }
    
    return {
      mapCenter: { lat: centerLat, lng: centerLng },
      mapZoom: zoom
    };
  }, [practitionersWithCoords, selectedCity, selectedProvince]);

  if (!isClient) {
    return <MapSkeleton height={height} />;
  }

  if (practitionersWithCoords.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <h4 className="font-medium mb-1">No Location Data</h4>
            <p className="text-sm text-muted-foreground">
              Practitioners without coordinates cannot be displayed on the map.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className, isFullscreen && "fixed inset-4 z-50")}>
      {/* Map Header */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <CardTitle className="text-base">Practitioner Locations</CardTitle>
            <Badge variant="secondary">{practitionersWithCoords.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(v: "markers" | "clusters") => setViewMode(v)}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clusters">Clusters</SelectItem>
                <SelectItem value="markers">Markers</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 p-0"
            >
              {isFullscreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Map Container */}
      <CardContent className="p-0">
        <div
          className="relative rounded-b-lg overflow-hidden"
          style={{ height: isFullscreen ? "calc(100vh - 150px)" : height }}
        >
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={mapZoom}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {viewMode === "clusters"
              ? clusters.map((cluster) => (
                  <Marker
                    key={`${cluster.city}-${cluster.province}`}
                    position={[cluster.lat, cluster.lng]}
                    icon={createMarkerIcon(
                      cluster.statuses.booked > 0
                        ? STATUS_MARKER_COLORS.booked
                        : cluster.statuses.completed > 0
                        ? STATUS_MARKER_COLORS.completed
                        : STATUS_MARKER_COLORS.default
                    )}
                  >
                    <Popup>
                      <ClusterPopup cluster={cluster} />
                    </Popup>
                  </Marker>
                ))
              : practitionersWithCoords.map((practitioner) => {
                  const status = callRecords[practitioner.id]?.status || "default";
                  return (
                    <Marker
                      key={practitioner.id}
                      position={[practitioner.latitude!, practitioner.longitude!]}
                      icon={createMarkerIcon(STATUS_MARKER_COLORS[status])}
                    >
                      <Popup>
                        <PractitionerPopup
                          practitioner={practitioner}
                          status={status}
                          onViewDetails={
                            onPractitionerClick
                              ? () => onPractitionerClick(practitioner)
                              : undefined
                          }
                        />
                      </Popup>
                    </Marker>
                  );
                })}
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
            <h5 className="text-xs font-medium mb-2">Status Legend</h5>
            <div className="space-y-1">
              {Object.entries(STATUS_MARKER_COLORS)
                .filter(([key]) => key !== "default")
                .map(([status, color]) => (
                  <div key={status} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="capitalize">{status.replace("_", " ")}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mini map for sidebar/cards
export function MiniMap({
  lat,
  lng,
  className,
}: {
  lat: number;
  lng: number;
  className?: string;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Skeleton className={cn("h-32 w-full rounded-md", className)} />;
  }

  return (
    <div className={cn("h-32 w-full rounded-md overflow-hidden", className)}>
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
      </MapContainer>
    </div>
  );
}
