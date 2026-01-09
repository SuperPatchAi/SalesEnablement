"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { CampaignCallRecord, CallStatus, CampaignStats } from "@/lib/campaign-storage";
import { TrendingUp, TrendingDown, Phone, Calendar, Clock, Target, Users, MapPin } from "lucide-react";
import { GaugeChart, RadialProgressChart, StatCard } from "./enhanced-charts";

interface AnalyticsDashboardProps {
  records: Record<string, CampaignCallRecord>;
  stats: CampaignStats;
}

// Color palette for charts
const COLORS = {
  primary: "hsl(var(--primary))",
  completed: "#22c55e",
  booked: "#a855f7",
  failed: "#ef4444",
  queued: "#eab308",
  inProgress: "#3b82f6",
  notCalled: "#6b7280",
};

const STATUS_COLORS: Record<string, string> = {
  not_called: COLORS.notCalled,
  queued: COLORS.queued,
  in_progress: COLORS.inProgress,
  completed: COLORS.completed,
  booked: COLORS.booked,
  calendar_sent: COLORS.booked,
  failed: COLORS.failed,
};

export function AnalyticsDashboard({ records, stats }: AnalyticsDashboardProps) {
  const recordsArray = useMemo(() => Object.values(records), [records]);

  // Generate call volume over time data (last 7 days)
  const volumeData = useMemo(() => {
    const days: Record<string, { date: string; calls: number; completed: number; booked: number }> = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      days[key] = { date: dayName, calls: 0, completed: 0, booked: 0 };
    }

    // Count calls by day
    recordsArray.forEach((record) => {
      const date = new Date(record.created_at).toISOString().split("T")[0];
      if (days[date]) {
        days[date].calls++;
        if (["completed", "booked", "calendar_sent"].includes(record.status)) {
          days[date].completed++;
        }
        if (["booked", "calendar_sent"].includes(record.status)) {
          days[date].booked++;
        }
      }
    });

    return Object.values(days);
  }, [recordsArray]);

  // Outcome funnel data
  const funnelData = useMemo(() => {
    return [
      { name: "Total Calls", value: stats.total_calls, fill: COLORS.primary },
      { name: "Completed", value: stats.completed + stats.booked, fill: COLORS.completed },
      { name: "Booked", value: stats.booked, fill: COLORS.booked },
    ];
  }, [stats]);

  // Calls by practitioner type
  const typeData = useMemo(() => {
    const types: Record<string, number> = {};
    
    recordsArray.forEach((record) => {
      const type = record.practitioner_type || "Unknown";
      types[type] = (types[type] || 0) + 1;
    });

    return Object.entries(types)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [recordsArray]);

  // Calls by province
  const provinceData = useMemo(() => {
    const provinces: Record<string, number> = {};
    
    recordsArray.forEach((record) => {
      const province = record.province || "Unknown";
      provinces[province] = (provinces[province] || 0) + 1;
    });

    return Object.entries(provinces)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [recordsArray]);

  // Status distribution for pie chart
  const statusData = useMemo(() => {
    const statusCounts: Record<string, number> = {
      completed: 0,
      booked: 0,
      failed: 0,
      in_progress: 0,
      queued: 0,
      not_called: 0,
    };

    recordsArray.forEach((record) => {
      if (record.status === "calendar_sent") {
        statusCounts.booked++;
      } else {
        statusCounts[record.status]++;
      }
    });

    return [
      { name: "Completed", value: statusCounts.completed, fill: COLORS.completed },
      { name: "Booked", value: statusCounts.booked, fill: COLORS.booked },
      { name: "Failed", value: statusCounts.failed, fill: COLORS.failed },
      { name: "In Progress", value: statusCounts.in_progress, fill: COLORS.inProgress },
      { name: "Queued", value: statusCounts.queued, fill: COLORS.queued },
      { name: "Not Called", value: statusCounts.not_called, fill: COLORS.notCalled },
    ].filter((item) => item.value > 0);
  }, [recordsArray]);

  // Best time to call heatmap data
  const heatmapData = useMemo(() => {
    const hours: Record<number, { connected: number; total: number }> = {};
    
    // Initialize hours 8 AM to 6 PM
    for (let h = 8; h <= 18; h++) {
      hours[h] = { connected: 0, total: 0 };
    }

    recordsArray.forEach((record) => {
      if (record.call_started_at) {
        const hour = new Date(record.call_started_at).getHours();
        if (hours[hour]) {
          hours[hour].total++;
          if (["completed", "booked", "calendar_sent"].includes(record.status)) {
            hours[hour].connected++;
          }
        }
      }
    });

    return Object.entries(hours).map(([hour, data]) => ({
      hour: `${hour}:00`,
      calls: data.total,
      connected: data.connected,
      rate: data.total > 0 ? Math.round((data.connected / data.total) * 100) : 0,
    }));
  }, [recordsArray]);

  // Chart configs
  const volumeChartConfig: ChartConfig = {
    calls: { label: "Total Calls", color: COLORS.primary },
    completed: { label: "Completed", color: COLORS.completed },
    booked: { label: "Booked", color: COLORS.booked },
  };

  const typeChartConfig: ChartConfig = {
    value: { label: "Calls", color: COLORS.primary },
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Phone className="w-4 h-4" />
                Total Calls
              </div>
              <div className="text-2xl font-bold">{stats.total_calls}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.in_progress} active, {stats.queued} queued
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Target className="w-4 h-4" />
                Connection Rate
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.total_calls > 0 
                  ? Math.round(((stats.completed + stats.booked) / stats.total_calls) * 100)
                  : 0}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.completed + stats.booked} connected calls
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Booking Rate
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.booking_rate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.booked} appointments booked
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Clock className="w-4 h-4" />
                Avg Duration
              </div>
              <div className="text-2xl font-bold">
                {stats.avg_duration_seconds > 0
                  ? `${Math.floor(stats.avg_duration_seconds / 60)}:${(stats.avg_duration_seconds % 60).toString().padStart(2, "0")}`
                  : "0:00"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                per connected call
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Visual Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GaugeChart
            value={stats.total_calls > 0 ? Math.round(((stats.completed + stats.booked) / stats.total_calls) * 100) : 0}
            max={100}
            title="Connection Rate"
            subtitle="of all calls"
            color="hsl(142, 76%, 36%)"
            size="sm"
          />
          <GaugeChart
            value={Math.round(stats.booking_rate)}
            max={100}
            title="Booking Rate"
            subtitle="of connected calls"
            color="hsl(262, 83%, 58%)"
            size="sm"
          />
          <Card className="flex flex-col items-center justify-center p-4">
            <RadialProgressChart
              data={[
                { name: "Completed", value: stats.total_calls > 0 ? Math.round((stats.completed / stats.total_calls) * 100) : 0, fill: "hsl(142, 76%, 36%)" },
              ]}
              centerLabel="Completed"
              centerValue={stats.completed}
            />
          </Card>
          <Card className="flex flex-col items-center justify-center p-4">
            <RadialProgressChart
              data={[
                { name: "Booked", value: stats.completed > 0 ? Math.round((stats.booked / stats.completed) * 100) : 0, fill: "hsl(262, 83%, 58%)" },
              ]}
              centerLabel="Booked"
              centerValue={stats.booked}
            />
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Call Volume Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Call Volume (Last 7 Days)</CardTitle>
              <CardDescription>Daily call activity and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={volumeChartConfig} className="h-[250px] w-full">
                <AreaChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="calls"
                    stackId="1"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stackId="2"
                    stroke={COLORS.completed}
                    fill={COLORS.completed}
                    fillOpacity={0.4}
                  />
                  <Area
                    type="monotone"
                    dataKey="booked"
                    stackId="3"
                    stroke={COLORS.booked}
                    fill={COLORS.booked}
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Outcome Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Outcome Distribution</CardTitle>
              <CardDescription>Call status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={typeChartConfig} className="h-[250px] w-full">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calls by Practitioner Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                Calls by Practitioner Type
              </CardTitle>
              <CardDescription>Top 6 practitioner types</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={typeChartConfig} className="h-[250px] w-full">
                <BarChart data={typeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Calls by Province */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Calls by Province
              </CardTitle>
              <CardDescription>Geographic distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={typeChartConfig} className="h-[250px] w-full">
                <BarChart data={provinceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill={COLORS.completed} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Best Time to Call */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Best Time to Call
            </CardTitle>
            <CardDescription>Connection rate by hour (8 AM - 6 PM)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={volumeChartConfig} className="h-[200px] w-full">
              <BarChart data={heatmapData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-lg">
                          <p className="font-medium">{data.hour}</p>
                          <p className="text-sm text-muted-foreground">Calls: {data.calls}</p>
                          <p className="text-sm text-muted-foreground">Connected: {data.connected}</p>
                          <p className="text-sm text-green-600">Rate: {data.rate}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="calls" fill={COLORS.primary} radius={[4, 4, 0, 0]} opacity={0.3} />
                <Bar dataKey="connected" fill={COLORS.completed} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversion Funnel</CardTitle>
            <CardDescription>From calls to bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4 py-4">
              {funnelData.map((item, index) => (
                <div key={item.name} className="flex items-center">
                  <div className="text-center">
                    <div
                      className="mx-auto rounded-lg flex items-center justify-center text-white font-bold"
                      style={{
                        backgroundColor: item.fill,
                        width: `${120 - index * 20}px`,
                        height: `${80 - index * 15}px`,
                        fontSize: `${24 - index * 4}px`,
                      }}
                    >
                      {item.value}
                    </div>
                    <p className="text-sm font-medium mt-2">{item.name}</p>
                    {index > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {funnelData[index - 1].value > 0
                          ? Math.round((item.value / funnelData[index - 1].value) * 100)
                          : 0}% conversion
                      </p>
                    )}
                  </div>
                  {index < funnelData.length - 1 && (
                    <div className="mx-4 text-muted-foreground text-2xl">→</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
