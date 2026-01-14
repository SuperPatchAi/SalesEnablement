"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Loader2,
  Download,
  Globe,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  XCircle,
  ChevronDown,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  NORTH_AMERICA_LOCATIONS,
  PRACTITIONER_TYPES,
  RADIUS_OPTIONS,
  RESULTS_LIMIT_OPTIONS,
  getRegions,
  getCities,
  getCountryLabel,
  getRegionLabel,
  type CityLocation,
} from "@/lib/locations";
import { usePlacesSearch, type SearchPlace } from "@/hooks/usePlacesSearch";
import { toast } from "sonner";

interface PractitionerSearchTabProps {
  onPractitionerImported?: () => void;
}

export function PractitionerSearchTab({ onPractitionerImported }: PractitionerSearchTabProps) {
  // Form state
  const [country, setCountry] = useState<"CA" | "US">("CA");
  const [region, setRegion] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<CityLocation | null>(null);
  const [practitionerType, setPractitionerType] = useState<string>("");
  const [radius, setRadius] = useState<number>(20000);
  const [resultsLimit, setResultsLimit] = useState<number>(20);

  // Search hook
  const {
    places,
    isSearching,
    isImporting,
    isEnriching,
    error,
    hasMore,
    totalSearches,
    selectedCount,
    search,
    loadMore,
    clearResults,
    toggleSelection,
    selectAll,
    deselectAll,
    importSelected,
    enrichPlace,
  } = usePlacesSearch();

  // Get available regions based on country
  const regions = useMemo(() => getRegions(country), [country]);

  // Get available cities based on region
  const cities = useMemo(() => {
    if (!region) return [];
    return getCities(country, region);
  }, [country, region]);

  // Handle country change
  const handleCountryChange = useCallback((value: "CA" | "US") => {
    setCountry(value);
    setRegion("");
    setCity("");
    setSelectedCity(null);
  }, []);

  // Handle region change
  const handleRegionChange = useCallback((value: string) => {
    setRegion(value);
    setCity("");
    setSelectedCity(null);
  }, []);

  // Handle city change
  const handleCityChange = useCallback((cityName: string) => {
    setCity(cityName);
    const cityData = cities.find((c) => c.city === cityName);
    setSelectedCity(cityData || null);
    if (cityData) {
      setRadius(cityData.radius);
    }
  }, [cities]);

  // Handle search
  const handleSearch = useCallback(async () => {
    if (!selectedCity || !practitionerType) {
      toast.error("Please select a location and practitioner type");
      return;
    }

    const typeLabel = PRACTITIONER_TYPES.find((t) => t.id === practitionerType)?.label || practitionerType;
    const query = `${typeLabel} in ${selectedCity.city}, ${region}, ${country === "CA" ? "Canada" : "USA"}`;

    await search(
      {
        query,
        location: {
          lat: selectedCity.lat,
          lng: selectedCity.lng,
          radius,
        },
        country,
        limit: resultsLimit,
      },
      typeLabel
    );
  }, [selectedCity, practitionerType, region, country, radius, resultsLimit, search]);

  // Handle import
  const handleImport = useCallback(async () => {
    const result = await importSelected();
    
    if (result.imported > 0) {
      toast.success(`Successfully imported ${result.imported} practitioners`);
      if (onPractitionerImported) {
        onPractitionerImported();
      }
    }
    
    if (result.duplicates > 0) {
      toast.info(`${result.duplicates} practitioners already in database`);
    }
    
    if (result.errors.length > 0) {
      toast.error(`${result.errors.length} errors during import`);
    }
  }, [importSelected, onPractitionerImported]);

  // Handle enrich
  const handleEnrich = useCallback(async (place: SearchPlace) => {
    if (!place.website) {
      toast.error("No website available for enrichment");
      return;
    }

    const result = await enrichPlace(place.id);
    
    if (result?.success) {
      toast.success(`Found ${result.practitioners.length} practitioners, ${result.emails.length} emails`);
    } else {
      toast.error("Failed to enrich practitioner");
    }
  }, [enrichPlace]);

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      {/* Search Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search New Practitioners
          </CardTitle>
          <CardDescription>
            Find healthcare practitioners across North America using Google Maps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Country & Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Country */}
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={country} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">{getCountryLabel("CA")}</SelectItem>
                  <SelectItem value="US">{getCountryLabel("US")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Province/State */}
            <div className="space-y-2">
              <Label>{getRegionLabel(country)}</Label>
              <Select value={region} onValueChange={handleRegionChange}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${getRegionLabel(country).toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label>City</Label>
              <Select value={city} onValueChange={handleCityChange} disabled={!region}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.city} value={c.city}>
                      {c.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Practitioner Type */}
            <div className="space-y-2">
              <Label>Practitioner Type</Label>
              <Select value={practitionerType} onValueChange={setPractitionerType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {PRACTITIONER_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Limit */}
            <div className="space-y-2">
              <Label>Max Results</Label>
              <Select value={resultsLimit.toString()} onValueChange={(v) => setResultsLimit(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  {RESULTS_LIMIT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Radius Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Search Radius</Label>
              <span className="text-sm text-muted-foreground">{(radius / 1000).toFixed(0)} km</span>
            </div>
            <Slider
              value={[radius]}
              onValueChange={([value]) => setRadius(value)}
              min={5000}
              max={50000}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={isSearching || !selectedCity || !practitionerType}
              className="flex-1"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Google Maps
                </>
              )}
            </Button>
            {places.length > 0 && (
              <Button variant="outline" onClick={clearResults}>
                Clear
              </Button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {places.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Search Results ({places.length} found)
                </CardTitle>
                <CardDescription>
                  {totalSearches} API {totalSearches === 1 ? "call" : "calls"} used
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {selectedCount > 0 && (
                  <Badge variant="secondary">{selectedCount} selected</Badge>
                )}
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAll}>
                  Deselect
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Results Table */}
            <ScrollArea className="h-[calc(100vh-450px)] min-h-[300px] border rounded-md">
              <div className="min-w-[800px]">
                {/* Table Header */}
                <div className="flex items-center gap-4 p-3 border-b bg-muted/50 font-medium text-sm sticky top-0">
                  <div className="w-8"></div>
                  <div className="flex-1 min-w-[200px]">Name</div>
                  <div className="w-[150px]">Type</div>
                  <div className="w-[80px]">Rating</div>
                  <div className="w-[120px]">Phone</div>
                  <div className="w-[80px]">Website</div>
                  <div className="w-[100px]">Status</div>
                  <div className="w-[80px]">Actions</div>
                </div>

                {/* Table Body */}
                {places.map((place) => (
                  <div
                    key={place.id}
                    className={`flex items-center gap-4 p-3 border-b hover:bg-muted/30 transition-colors ${
                      place.isImported ? "bg-green-50/50" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="w-8">
                      <Checkbox
                        checked={place.isSelected}
                        onCheckedChange={() => toggleSelection(place.id)}
                        disabled={place.isImported}
                      />
                    </div>

                    {/* Name & Address */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="font-medium truncate">{place.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {place.city && place.province
                          ? `${place.city}, ${place.province}`
                          : place.address?.slice(0, 40)}
                      </div>
                    </div>

                    {/* Type */}
                    <div className="w-[150px]">
                      <Badge variant="outline" className="text-xs">
                        {place.practitioner_type}
                      </Badge>
                    </div>

                    {/* Rating */}
                    <div className="w-[80px]">
                      {place.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{place.rating.toFixed(1)}</span>
                          {place.review_count && (
                            <span className="text-xs text-muted-foreground">
                              ({place.review_count})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="w-[120px]">
                      {place.phone ? (
                        <div className="flex items-center gap-1 text-xs">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{place.phone}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>

                    {/* Website */}
                    <div className="w-[80px]">
                      {place.website ? (
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Globe className="h-3 w-3" />
                          View
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="w-[100px]">
                      {place.isImported ? (
                        <Badge variant="default" className="bg-green-600 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Imported
                        </Badge>
                      ) : place.isEnriched ? (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Enriched
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="w-[80px] flex gap-1">
                      {place.website && !place.isEnriched && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEnrich(place)}
                          disabled={isEnriching}
                          title="Enrich with Firecrawl"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      )}
                      {place.google_maps_uri && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          title="Open in Google Maps"
                        >
                          <a
                            href={place.google_maps_uri}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Load More & Import Actions */}
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <div>
                {hasMore && (
                  <Button variant="outline" onClick={loadMore} disabled={isSearching}>
                    {isSearching ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronDown className="mr-2 h-4 w-4" />
                    )}
                    Load More Results
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleImport}
                  disabled={isImporting || selectedCount === 0}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Import Selected ({selectedCount})
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {places.length === 0 && !isSearching && (
        <Card className="flex-1">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">Search for Practitioners</h3>
            <p className="text-muted-foreground max-w-md">
              Select a country, province/state, city, and practitioner type to search Google Maps for new practitioners to add to your database.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
