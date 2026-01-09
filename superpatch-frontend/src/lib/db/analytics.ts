/**
 * Analytics Database Operations
 * 
 * Queries for campaign analytics and reporting
 */

import { supabase, isSupabaseConfigured } from '../supabase';
import type { CallRecord, CallStatus, CampaignStats } from './types';
import { getCampaignStats as getStatsFromRecords } from './call-records';

interface CallVolumeRecord {
  created_at: string;
  status: CallStatus;
}

interface CallTypeRecord {
  practitioner_type: string | null;
  status: CallStatus;
}

interface CallHourRecord {
  call_started_at: string | null;
  status: CallStatus;
}

interface CallLocationRecord {
  province: string | null;
  city: string | null;
  status: CallStatus;
}

interface CallDurationRecord {
  created_at: string;
  duration_seconds: number | null;
}

/**
 * Get call volume data by day (for charts)
 */
export async function getCallVolumeByDay(days = 7): Promise<{
  date: string;
  calls: number;
  completed: number;
  booked: number;
  failed: number;
}[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  // Get date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('call_records')
    .select('created_at, status')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) {
    console.error('Failed to fetch call volume:', error);
    return [];
  }

  const records = (data || []) as CallVolumeRecord[];

  // Initialize days map
  const daysMap: Record<string, { date: string; calls: number; completed: number; booked: number; failed: number }> = {};
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    daysMap[key] = { date: dayName, calls: 0, completed: 0, booked: 0, failed: 0 };
  }

  // Count by day
  for (const record of records) {
    const dateKey = new Date(record.created_at).toISOString().split('T')[0];
    if (daysMap[dateKey]) {
      daysMap[dateKey].calls++;
      if (record.status === 'completed') daysMap[dateKey].completed++;
      if (record.status === 'booked' || record.status === 'calendar_sent') daysMap[dateKey].booked++;
      if (record.status === 'failed') daysMap[dateKey].failed++;
    }
  }

  return Object.values(daysMap);
}

/**
 * Get call distribution by practitioner type
 */
export async function getCallsByPractitionerType(): Promise<{
  type: string;
  count: number;
  booked: number;
}[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('call_records')
    .select('practitioner_type, status');

  if (error) {
    console.error('Failed to fetch calls by type:', error);
    return [];
  }

  const records = (data || []) as CallTypeRecord[];

  // Group by type
  const typeMap: Record<string, { type: string; count: number; booked: number }> = {};
  
  for (const record of records) {
    const type = record.practitioner_type || 'Unknown';
    if (!typeMap[type]) {
      typeMap[type] = { type, count: 0, booked: 0 };
    }
    typeMap[type].count++;
    if (record.status === 'booked' || record.status === 'calendar_sent') {
      typeMap[type].booked++;
    }
  }

  return Object.values(typeMap).sort((a, b) => b.count - a.count);
}

/**
 * Get calls by hour of day (for best time to call analysis)
 */
export async function getCallsByHour(): Promise<{
  hour: string;
  calls: number;
  connected: number;
  rate: number;
}[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('call_records')
    .select('call_started_at, status')
    .not('call_started_at', 'is', null);

  if (error) {
    console.error('Failed to fetch calls by hour:', error);
    return [];
  }

  const records = (data || []) as CallHourRecord[];

  // Initialize hours (8 AM to 6 PM)
  const hoursMap: Record<number, { total: number; connected: number }> = {};
  for (let h = 8; h <= 18; h++) {
    hoursMap[h] = { total: 0, connected: 0 };
  }

  // Count by hour
  for (const record of records) {
    if (record.call_started_at) {
      const hour = new Date(record.call_started_at).getHours();
      if (hoursMap[hour]) {
        hoursMap[hour].total++;
        if (['completed', 'booked', 'calendar_sent'].includes(record.status)) {
          hoursMap[hour].connected++;
        }
      }
    }
  }

  return Object.entries(hoursMap).map(([hour, data]) => ({
    hour: `${hour}:00`,
    calls: data.total,
    connected: data.connected,
    rate: data.total > 0 ? Math.round((data.connected / data.total) * 100) : 0,
  }));
}

/**
 * Get calls by province/city
 */
export async function getCallsByLocation(): Promise<{
  province: string;
  city: string;
  count: number;
  booked: number;
}[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('call_records')
    .select('province, city, status');

  if (error) {
    console.error('Failed to fetch calls by location:', error);
    return [];
  }

  const records = (data || []) as CallLocationRecord[];

  // Group by province/city
  const locationMap: Record<string, { province: string; city: string; count: number; booked: number }> = {};
  
  for (const record of records) {
    const key = `${record.province || 'Unknown'}-${record.city || 'Unknown'}`;
    if (!locationMap[key]) {
      locationMap[key] = { 
        province: record.province || 'Unknown', 
        city: record.city || 'Unknown', 
        count: 0, 
        booked: 0 
      };
    }
    locationMap[key].count++;
    if (record.status === 'booked' || record.status === 'calendar_sent') {
      locationMap[key].booked++;
    }
  }

  return Object.values(locationMap).sort((a, b) => b.count - a.count);
}

/**
 * Get recent call activity
 */
export async function getRecentActivity(limit = 20): Promise<CallRecord[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('call_records')
    .select('*')
    .not('status', 'eq', 'not_called')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch recent activity:', error);
    return [];
  }

  return (data || []) as CallRecord[];
}

/**
 * Get campaign summary statistics
 */
export async function getCampaignSummary(): Promise<CampaignStats> {
  return getStatsFromRecords();
}

/**
 * Get booking rate trend (last N days)
 */
export async function getBookingRateTrend(days = 7): Promise<{
  date: string;
  rate: number;
}[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const volumeData = await getCallVolumeByDay(days);
  
  return volumeData.map(day => ({
    date: day.date,
    rate: day.completed + day.booked > 0 
      ? Math.round((day.booked / (day.completed + day.booked)) * 100) 
      : 0,
  }));
}

/**
 * Get average call duration trend
 */
export async function getAvgDurationTrend(days = 7): Promise<{
  date: string;
  avgDuration: number;
}[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('call_records')
    .select('created_at, duration_seconds')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .not('duration_seconds', 'is', null);

  if (error) {
    console.error('Failed to fetch duration trend:', error);
    return [];
  }

  const records = (data || []) as CallDurationRecord[];

  // Initialize days map
  const daysMap: Record<string, { total: number; count: number }> = {};
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    daysMap[key] = { total: 0, count: 0 };
  }

  // Sum by day
  for (const record of records) {
    const dateKey = new Date(record.created_at).toISOString().split('T')[0];
    if (daysMap[dateKey] && record.duration_seconds) {
      daysMap[dateKey].total += record.duration_seconds;
      daysMap[dateKey].count++;
    }
  }

  return Object.entries(daysMap).map(([dateStr, data]) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      avgDuration: data.count > 0 ? Math.round(data.total / data.count) : 0,
    };
  });
}
