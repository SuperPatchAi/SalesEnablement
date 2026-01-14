"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Columns,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Phone,
  Eye,
  Trash2,
  UserPlus,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Column definition
export interface ColumnDef {
  id: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
  width?: string;
}

// Default columns for practitioner table
export const DEFAULT_COLUMNS: ColumnDef[] = [
  { id: "select", label: "Select", visible: true, sortable: false, width: "w-10" },
  { id: "name", label: "Practice Name", visible: true, sortable: true, width: "flex-1 min-w-[200px]" },
  { id: "type", label: "Type", visible: true, sortable: true, width: "w-[140px]" },
  { id: "city", label: "City", visible: true, sortable: true, width: "w-[120px]" },
  { id: "province", label: "Province", visible: false, sortable: true, width: "w-[100px]" },
  { id: "rating", label: "Rating", visible: true, sortable: true, width: "w-[80px]" },
  { id: "reviews", label: "Reviews", visible: false, sortable: true, width: "w-[80px]" },
  { id: "phone", label: "Phone", visible: true, sortable: false, width: "w-[120px]" },
  { id: "enriched", label: "Enriched", visible: true, sortable: true, width: "w-[90px]" },
  { id: "source", label: "Source", visible: false, sortable: true, width: "w-[90px]" },
  // Call data columns
  { id: "lastCalled", label: "Last Called", visible: true, sortable: true, width: "w-[110px]" },
  { id: "callCount", label: "Calls", visible: false, sortable: true, width: "w-[60px]" },
  { id: "duration", label: "Duration", visible: false, sortable: true, width: "w-[80px]" },
  { id: "voicemail", label: "VM", visible: true, sortable: true, width: "w-[50px]" },
  { id: "appointment", label: "Appointment", visible: true, sortable: true, width: "w-[120px]" },
  { id: "summary", label: "Summary", visible: false, sortable: false, width: "w-[150px]" },
  { id: "status", label: "Status", visible: true, sortable: true, width: "w-[100px]" },
];

// Sort direction type
export type SortDirection = "asc" | "desc" | null;

// Sort state
export interface SortState {
  column: string | null;
  direction: SortDirection;
}

interface ColumnVisibilityMenuProps {
  columns: ColumnDef[];
  onToggleColumn: (columnId: string) => void;
}

export function ColumnVisibilityMenu({ columns, onToggleColumn }: ColumnVisibilityMenuProps) {
  const visibleCount = columns.filter(c => c.visible && c.id !== "select").length;
  const totalCount = columns.filter(c => c.id !== "select").length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Columns className="w-4 h-4" />
          Columns
          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
            {visibleCount}/{totalCount}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns
          .filter(col => col.id !== "select")
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.visible}
              onCheckedChange={() => onToggleColumn(column.id)}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface SortableHeaderProps {
  column: ColumnDef;
  sortState: SortState;
  onSort: (columnId: string) => void;
}

export function SortableHeader({ column, sortState, onSort }: SortableHeaderProps) {
  if (!column.sortable) {
    return <span>{column.label}</span>;
  }

  const isActive = sortState.column === column.id;
  const direction = isActive ? sortState.direction : null;

  return (
    <button
      onClick={() => onSort(column.id)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      <span>{column.label}</span>
      <div className="w-4 h-4 flex items-center justify-center">
        {direction === "asc" ? (
          <ArrowUp className="w-3 h-3" />
        ) : direction === "desc" ? (
          <ArrowDown className="w-3 h-3" />
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-50" />
        )}
      </div>
    </button>
  );
}

interface RowActionsMenuProps {
  onCall?: () => void;
  onView?: () => void;
  onAddToQueue?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function RowActionsMenu({
  onCall,
  onView,
  onAddToQueue,
  onRemove,
  disabled = false,
}: RowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={disabled}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {onView && (
          <DropdownMenuCheckboxItem
            onSelect={(e) => {
              e.preventDefault();
              onView();
            }}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </DropdownMenuCheckboxItem>
        )}
        {onCall && (
          <DropdownMenuCheckboxItem
            onSelect={(e) => {
              e.preventDefault();
              onCall();
            }}
            className="gap-2"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </DropdownMenuCheckboxItem>
        )}
        {onAddToQueue && (
          <DropdownMenuCheckboxItem
            onSelect={(e) => {
              e.preventDefault();
              onAddToQueue();
            }}
            className="gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add to Queue
          </DropdownMenuCheckboxItem>
        )}
        {onRemove && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              onSelect={(e) => {
                e.preventDefault();
                onRemove();
              }}
              className="gap-2 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Table settings popover
interface TableSettingsProps {
  columns: ColumnDef[];
  onToggleColumn: (columnId: string) => void;
  onResetColumns: () => void;
}

export function TableSettings({ columns, onToggleColumn, onResetColumns }: TableSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[250px]">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Visible Columns</h4>
            <div className="space-y-2">
              {columns
                .filter(col => col.id !== "select")
                .map((column) => (
                  <label
                    key={column.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={column.visible}
                      onChange={() => onToggleColumn(column.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{column.label}</span>
                  </label>
                ))}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onResetColumns}
          >
            Reset to Default
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Bulk actions bar
interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onStartCampaign: () => void;
  onAddToQueue: () => void;
  campaignRunning: boolean;
  campaignPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onStartCampaign,
  onAddToQueue,
  campaignRunning,
  campaignPaused,
  onPause,
  onResume,
  onStop,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="border-t px-6 py-3 bg-blue-50 dark:bg-blue-950/30 flex items-center justify-between animate-in slide-in-from-bottom-2">
      <div className="flex items-center gap-4">
        <span className="font-medium">
          {selectedCount} practitioner{selectedCount !== 1 ? "s" : ""} selected
        </span>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Clear selection
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {campaignRunning ? (
          <>
            {campaignPaused ? (
              <Button onClick={onResume} size="sm">
                Resume
              </Button>
            ) : (
              <Button onClick={onPause} variant="outline" size="sm">
                Pause
              </Button>
            )}
            <Button onClick={onStop} variant="destructive" size="sm">
              Stop
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onAddToQueue} variant="outline" size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add to Queue
            </Button>
            <Button onClick={onStartCampaign} size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Start Calling ({selectedCount})
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// Hook for managing column visibility and sorting
export function useTableState() {
  const [columns, setColumns] = useState<ColumnDef[]>(DEFAULT_COLUMNS);
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });

  const toggleColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const resetColumns = () => {
    setColumns(DEFAULT_COLUMNS);
  };

  const handleSort = (columnId: string) => {
    setSortState((prev) => {
      if (prev.column !== columnId) {
        return { column: columnId, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { column: columnId, direction: "desc" };
      }
      if (prev.direction === "desc") {
        return { column: null, direction: null };
      }
      return { column: columnId, direction: "asc" };
    });
  };

  return {
    columns,
    sortState,
    toggleColumn,
    resetColumns,
    handleSort,
    visibleColumns: columns.filter((c) => c.visible),
  };
}
