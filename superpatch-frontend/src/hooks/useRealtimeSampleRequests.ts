"use client";

/**
 * Hook for real-time sample request updates via Supabase Realtime
 * 
 * Features:
 * - Fetches sample requests from Supabase
 * - Subscribes to real-time updates
 * - Provides filtering by status
 * - Callbacks for new requests and status changes
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { SampleRequest, SampleStatus } from "@/lib/db/types";

interface UseRealtimeSampleRequestsOptions {
  statusFilter?: SampleStatus | "all";
  onNewRequest?: (request: SampleRequest) => void;
  onStatusChange?: (request: SampleRequest, oldStatus: SampleStatus) => void;
}

interface UseRealtimeSampleRequestsResult {
  requests: SampleRequest[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  refresh: () => Promise<void>;
  pagination: {
    total: number;
  };
}

export function useRealtimeSampleRequests(
  options: UseRealtimeSampleRequestsOptions = {}
): UseRealtimeSampleRequestsResult {
  const { statusFilter = "all", onNewRequest, onStatusChange } = options;

  const [requests, setRequests] = useState<SampleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [total, setTotal] = useState(0);

  const channelRef = useRef<ReturnType<NonNullable<typeof supabase>["channel"]> | null>(null);
  const callbacksRef = useRef({ onNewRequest, onStatusChange });

  // Keep callbacks ref updated
  useEffect(() => {
    callbacksRef.current = { onNewRequest, onStatusChange };
  }, [onNewRequest, onStatusChange]);

  // Fetch requests from database
  const fetchRequests = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase not configured");
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from("sample_requests")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setRequests((data as SampleRequest[]) || []);
        setTotal(count || 0);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // Handle real-time changes
  const handleChange = useCallback(
    (payload: {
      eventType: "INSERT" | "UPDATE" | "DELETE";
      new: SampleRequest | null;
      old: Partial<SampleRequest> | null;
    }) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      console.log(`📡 Sample request ${eventType}:`, newRecord?.id || oldRecord?.id);

      if (eventType === "INSERT" && newRecord) {
        // Check if matches filter
        if (statusFilter === "all" || newRecord.status === statusFilter) {
          setRequests((prev) => [newRecord, ...prev]);
          setTotal((prev) => prev + 1);
          callbacksRef.current.onNewRequest?.(newRecord);
        }
      }

      if (eventType === "UPDATE" && newRecord) {
        setRequests((prev) => {
          const index = prev.findIndex((r) => r.id === newRecord.id);

          // Status changed - notify callback
          if (oldRecord?.status && oldRecord.status !== newRecord.status) {
            callbacksRef.current.onStatusChange?.(newRecord, oldRecord.status as SampleStatus);
          }

          // Handle filter
          const matchesFilter = statusFilter === "all" || newRecord.status === statusFilter;

          if (index >= 0) {
            if (matchesFilter) {
              const updated = [...prev];
              updated[index] = newRecord;
              return updated;
            } else {
              // No longer matches filter, remove it
              setTotal((t) => Math.max(0, t - 1));
              return prev.filter((r) => r.id !== newRecord.id);
            }
          } else if (matchesFilter) {
            // Newly matches filter, add it
            setTotal((t) => t + 1);
            return [newRecord, ...prev];
          }

          return prev;
        });
      }

      if (eventType === "DELETE" && oldRecord?.id) {
        setRequests((prev) => {
          const wasIncluded = prev.some((r) => r.id === oldRecord.id);
          if (wasIncluded) {
            setTotal((t) => Math.max(0, t - 1));
          }
          return prev.filter((r) => r.id !== oldRecord.id);
        });
      }
    },
    [statusFilter]
  );

  // Set up real-time subscription
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase not configured");
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchRequests();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("sample_requests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sample_requests",
        },
        (payload) => {
          handleChange({
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: payload.new as SampleRequest | null,
            old: payload.old as Partial<SampleRequest> | null,
          });
        }
      )
      .subscribe((status) => {
        console.log("[Realtime Samples] Subscription status:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    channelRef.current = channel;

    // Cleanup
    return () => {
      console.log("[Realtime Samples] Unsubscribing from channel");
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [fetchRequests, handleChange]);

  return {
    requests,
    loading,
    error,
    isConnected,
    refresh: fetchRequests,
    pagination: {
      total,
    },
  };
}

export default useRealtimeSampleRequests;
