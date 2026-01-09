"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Phone,
  CalendarCheck,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Gauge Chart Component
interface GaugeChartProps {
  value: number;
  max?: number;
  title: string;
  subtitle?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  showTrend?: boolean;
  trendValue?: number;
  className?: string;
}

export function GaugeChart({
  value,
  max = 100,
  title,
  subtitle,
  color = "hsl(var(--primary))",
  size = "md",
  showTrend,
  trendValue,
  className,
}: GaugeChartProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeConfig = {
    sm: { width: 100, height: 60, fontSize: "text-lg", strokeWidth: 8 },
    md: { width: 150, height: 90, fontSize: "text-2xl", strokeWidth: 10 },
    lg: { width: 200, height: 120, fontSize: "text-3xl", strokeWidth: 12 },
  };

  const config = sizeConfig[size];
  const radius = config.width / 2 - config.strokeWidth;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on value
  const getStatusColor = () => {
    if (percentage >= 70) return "#22c55e";
    if (percentage >= 40) return "#eab308";
    return "#ef4444";
  };

  const displayColor = color === "auto" ? getStatusColor() : color;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="pt-4 pb-3">
        <div className="flex flex-col items-center">
          {/* Gauge */}
          <div className="relative" style={{ width: config.width, height: config.height }}>
            <svg
              width={config.width}
              height={config.height}
              className="transform -rotate-90"
            >
              {/* Background arc */}
              <path
                d={`M ${config.strokeWidth} ${config.height} A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth} ${config.height}`}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth={config.strokeWidth}
                strokeLinecap="round"
              />
              {/* Value arc */}
              <motion.path
                d={`M ${config.strokeWidth} ${config.height} A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth} ${config.height}`}
                fill="none"
                stroke={displayColor}
                strokeWidth={config.strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            {/* Value display */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
              <span className={cn("font-bold", config.fontSize)}>
                {value.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Labels */}
          <div className="text-center mt-2">
            <h4 className="font-medium text-sm">{title}</h4>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Trend */}
          {showTrend && trendValue !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs mt-2",
                trendValue >= 0 ? "text-green-600" : "text-red-600"
              )}
            >
              {trendValue >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{Math.abs(trendValue).toFixed(1)}% vs last week</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Radial Progress Chart
interface RadialProgressProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
  centerLabel?: string;
  centerValue?: string | number;
  className?: string;
}

export function RadialProgressChart({
  data,
  centerLabel,
  centerValue,
  className,
}: RadialProgressProps) {
  return (
    <div className={cn("relative", className)}>
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            background={{ fill: "hsl(var(--muted))" }}
            cornerRadius={10}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border rounded-lg p-2 shadow-lg">
                    <p className="font-medium">{payload[0].payload.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {payload[0].value}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* Center content */}
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="text-2xl font-bold">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-xs text-muted-foreground">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

// Interactive Bar Chart with click handler
interface InteractiveBarChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  onBarClick?: (data: any) => void;
  title?: string;
  description?: string;
  color?: string;
  className?: string;
}

export function InteractiveBarChart({
  data,
  onBarClick,
  title,
  description,
  color = "hsl(var(--primary))",
  className,
}: InteractiveBarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-2 shadow-lg">
                      <p className="font-medium">{payload[0].payload.name}</p>
                      <p className="text-sm text-primary font-semibold">
                        {payload[0].value?.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="value"
              fill={color}
              radius={[4, 4, 0, 0]}
              cursor={onBarClick ? "pointer" : "default"}
              onClick={(data, index) => {
                setActiveIndex(index);
                onBarClick?.(data);
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={activeIndex === index ? `${color}` : `${color}80`}
                  style={{ transition: "fill 0.2s" }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Animated Line Chart
interface AnimatedLineChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  title?: string;
  description?: string;
  color?: string;
  showArea?: boolean;
  className?: string;
}

export function AnimatedLineChart({
  data,
  title,
  description,
  color = "hsl(var(--primary))",
  showArea = true,
  className,
}: AnimatedLineChartProps) {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          {showArea ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{payload[0].payload.name}</p>
                        <p className="text-sm text-primary font-semibold">
                          {payload[0].value?.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{payload[0].payload.name}</p>
                        <p className="text-sm text-primary font-semibold">
                          {payload[0].value?.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2 }}
                activeDot={{ r: 6, fill: color }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Stat Card with mini chart
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  sparklineData?: number[];
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  sparklineData,
  icon,
  color = "hsl(var(--primary))",
  className,
}: StatCardProps) {
  // Generate sparkline path
  const sparklinePath = useMemo(() => {
    if (!sparklineData || sparklineData.length < 2) return "";

    const width = 80;
    const height = 30;
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;

    const points = sparklineData.map((value, index) => {
      const x = (index / (sparklineData.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  }, [sparklineData]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              {icon}
              <span>{title}</span>
            </div>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs mt-2",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              </div>
            )}
          </div>

          {/* Sparkline */}
          {sparklineData && sparklineData.length > 1 && (
            <div className="flex-shrink-0 ml-4">
              <svg width={80} height={30} className="overflow-visible">
                <motion.path
                  d={sparklinePath}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Multi-metric comparison chart
interface MetricComparisonProps {
  data: Array<{
    label: string;
    current: number;
    previous: number;
    max?: number;
  }>;
  title?: string;
  className?: string;
}

export function MetricComparison({
  data,
  title,
  className,
}: MetricComparisonProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {data.map((metric, index) => {
          const max = metric.max || Math.max(metric.current, metric.previous, 100);
          const currentPercent = (metric.current / max) * 100;
          const previousPercent = (metric.previous / max) * 100;
          const change = metric.previous > 0
            ? ((metric.current - metric.previous) / metric.previous) * 100
            : 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{metric.current}</span>
                  <span
                    className={cn(
                      "text-xs",
                      change >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {change >= 0 ? "+" : ""}
                    {change.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                {/* Previous value (lighter) */}
                <div
                  className="absolute inset-y-0 left-0 bg-muted-foreground/20 rounded-full"
                  style={{ width: `${previousPercent}%` }}
                />
                {/* Current value */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Previous: {metric.previous}</span>
                <span>Max: {max}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// KPI Grid
interface KPIGridProps {
  kpis: Array<{
    title: string;
    value: string | number;
    target?: number;
    icon?: React.ReactNode;
    color?: string;
  }>;
  className?: string;
}

export function KPIGrid({ kpis, className }: KPIGridProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {kpis.map((kpi, index) => {
        const isTarget = kpi.target !== undefined;
        const progress = isTarget && typeof kpi.value === "number"
          ? (kpi.value / kpi.target!) * 100
          : 0;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  {kpi.icon}
                  <span>{kpi.title}</span>
                </div>
                <div className="text-xl font-bold" style={{ color: kpi.color }}>
                  {kpi.value}
                </div>
                {isTarget && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Target: {kpi.target}</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: kpi.color || "hsl(var(--primary))" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
