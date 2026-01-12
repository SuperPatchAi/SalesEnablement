"use client";

import { useState, useEffect, useCallback } from "react";
import type { CampaignStats } from "@/lib/db/types";

interface UseCampaignStatsOptions {
  pollInterval?: number;
}

interface UseCampaignStatsReturn {
  stats: CampaignStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const DEFAULT_STATS: CampaignStats = {
  total_calls: 0,
  completed: 0,
  booked: 0,
  failed: 0,
  in_progress: 0,
  queued: 0,
  not_called: 0,
  calendar_sent: 0,
  voicemail: 0,
  total_duration_seconds: 0,
  avg_duration_seconds: 0,
  success_rate: 0,
  booking_rate: 0,
};

export function useCampaignStats(options: UseCampaignStatsOptions = {}): UseCampaignStatsReturn {
  const { pollInterval } = options;
  
  const [stats, setStats] = useState<CampaignStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/campaign/calls?stats=true");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats(data.stats || DEFAULT_STATS);
      setError(null);
    } catch (err) {
      console.error("Error fetching campaign stats:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Optional polling
  useEffect(() => {
    if (pollInterval) {
      const interval = setInterval(fetchStats, pollInterval);
      return () => clearInterval(interval);
    }
  }, [pollInterval, fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export default useCampaignStats;
