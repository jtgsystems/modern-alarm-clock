"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { 
  Calendar, 
  Clock, 
  Filter, 
  SortAsc, 
  SortDesc, 
  ArrowDownUp,
  AlarmClock,
  Tag,
  CalendarDays,
  LayoutList,
  LayoutGrid,
  ChevronRight,
  Bell,
  BellRing,
  Check,
  AlertCircle,
  Search,
  X,
  LayoutPanelTop,
  Clock3,
  AlarmClockOff,
  Pencil,
  Trash2,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { 
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface Alarm {
  id: string
  time: string
  label?: string
  isRecurring?: boolean
  reminderDate?: Date
}

interface UpcomingAlarmsProps {
  alarms: Alarm[]
  onEditAlarm?: (alarm: Alarm) => void
  onDeleteAlarm?: (id: string) => void
}

type SortOrder = "asc" | "desc"
type SortBy = "time" | "label" | "date"
type FilterType = "all" | "today" | "recurring" | "scheduled"
type ViewMode = "grouped" | "list" | "compact"

function getTimeStatus(alarmTime: string, reminderDate?: Date) {
  const now = new Date()
  const [hours, minutes] = alarmTime.split(":").map(Number)
  const alarmDateTime = reminderDate ? new Date(reminderDate) : new Date()
  alarmDateTime.setHours(hours, minutes, 0, 0)

  const diffMs = alarmDateTime.getTime() - now.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  
  if (diffMins < 0) return "past"
  if (diffMins < 60) return "soon"
  if (diffMins < 24 * 60) return "today"
  return "upcoming"
}

interface AlarmCardProps {
  alarm: Alarm
  viewMode: ViewMode
  onEdit?: (alarm: Alarm) => void
  onDelete?: (id: string) => void
}

function AlarmCard({ alarm, viewMode, onEdit, onDelete }: AlarmCardProps) {
  const timeStatus = getTimeStatus(alarm.time, alarm.reminderDate)
  
  return (
    <div
      className={cn(
        "group relative",
        viewMode === "grouped" 
          ? "bg-gray-800/30 hover:bg-gray-800/50"
          : viewMode === "compact"
          ? "bg-gray-800/30 hover:bg-gray-800/50"
          : "bg-transparent hover:bg-gray-800/30",
        "backdrop-blur-sm",
        "rounded-lg p-3",
        "transition-all duration-200"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0">
            {alarm.isRecurring ? (
              <BellRing className="h-4 w-4 text-purple-400/90" />
            ) : (
              <Bell className="h-4 w-4 text-white/60" />
            )}
          </div>
          
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-mono text-base text-white/90">{alarm.time}</p>
              {timeStatus === "soon" && (
                <Badge variant="destructive" className="animate-pulse">Soon</Badge>
              )}
              {timeStatus === "past" && (
                <Badge variant="secondary" className="bg-white/5">Past</Badge>
              )}
            </div>
            
            {alarm.label && (
              <p className="text-sm text-white/60 truncate">{alarm.label}</p>
            )}
            
            {alarm.reminderDate && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-white/40">
                  {new Date(alarm.reminderDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: new Date(alarm.reminderDate).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                  })}
                </p>
                {timeStatus === "today" && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-0">Today</Badge>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {alarm.isRecurring && (
            <Badge variant="outline" className="border-purple-500/20 text-purple-400">
              Recurring
            </Badge>
          )}
          
          {/* Quick Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-white/10"
              onClick={() => onEdit?.(alarm)}
            >
              <Pencil className="h-3.5 w-3.5" />
              <span className="sr-only">Edit alarm</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-red-500/20 hover:text-red-400"
              onClick={() => onDelete?.(alarm.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Delete alarm</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-white/10"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-gray-900/95 border-white/10"
              >
                <DropdownMenuItem onClick={() => onEdit?.(alarm)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Alarm
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(alarm.id)}
                  className="text-red-400 focus:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Alarm
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <div className={cn(
        "absolute inset-px rounded-lg",
        "bg-gradient-to-r from-cyan-500/10 to-purple-500/10",
        "opacity-0 group-hover:opacity-100 transition-opacity",
        timeStatus === "soon" && "!opacity-100 !from-red-500/20 !to-orange-500/20"
      )} />
    </div>
  )
}

function EmptyState({ filterType }: { filterType: FilterType }) {
  return (
    <div className="text-center py-8 px-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
        <AlarmClockOff className="h-6 w-6 text-white/40" />
      </div>
      <h3 className="text-base font-medium text-white/80 mb-2">No alarms found</h3>
      <p className="text-sm text-white/50">
        {filterType === "all" 
          ? "Create an alarm to get started"
          : `No alarms match your "${filterType}" filter`}
      </p>
    </div>
  )
}

export default function UpcomingAlarms({ alarms, onEditAlarm, onDeleteAlarm }: UpcomingAlarmsProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [sortBy, setSortBy] = useState<SortBy>("time")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("grouped")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [focusedGroup, setFocusedGroup] = useState<string | null>(null)
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && !isFilterMenuOpen) {
        e.preventDefault()
        setIsSearching(true)
      }

      if (e.key === 'Escape' && isSearching) {
        setIsSearching(false)
        setSearchTerm("")
      }

      if (isFilterMenuOpen) {
        switch(e.key.toLowerCase()) {
          case 'a':
            setFilterType("all")
            setIsFilterMenuOpen(false)
            break
          case 't':
            setFilterType("today")
            setIsFilterMenuOpen(false)
            break
          case 'r':
            setFilterType("recurring")
            setIsFilterMenuOpen(false)
            break
          case 's':
            setFilterType("scheduled")
            setIsFilterMenuOpen(false)
            break
          case 'escape':
            setIsFilterMenuOpen(false)
            break
        }
      } else {
        switch(e.key.toLowerCase()) {
          case 'v':
            setViewMode(prev => prev === "grouped" ? "list" : prev === "list" ? "compact" : "grouped")
            break
          case '1':
            setSortBy("time")
            break
          case '2':
            setSortBy("label")
            break
          case '3':
            setSortBy("date")
            break
          case ' ':
            e.preventDefault()
            setSortOrder(prev => prev === "asc" ? "desc" : "asc")
            break
        }
      }

      // Quick navigation between groups (Alt + 1-5)
      if (e.altKey && viewMode === "grouped") {
        const groupKeys = ["today", "tomorrow", "thisWeek", "later", "recurring"]
        const groupIndex = Number(e.key) - 1
        
        if (groupIndex >= 0 && groupIndex < groupKeys.length) {
          e.preventDefault()
          const groupKey = groupKeys[groupIndex]
          const groupEl = groupRefs.current[groupKey]
          if (groupEl) {
            groupEl.scrollIntoView({ behavior: "smooth" })
            setFocusedGroup(groupKey)
            // Auto-clear focus after animation
            setTimeout(() => setFocusedGroup(null), 1000)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFilterMenuOpen, isSearching, viewMode])

  const filteredAndSortedAlarms = useMemo(() => {
    let filtered = [...alarms]

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(alarm => 
        alarm.time.toLowerCase().includes(searchLower) ||
        alarm.label?.toLowerCase().includes(searchLower) ||
        alarm.reminderDate?.toLocaleDateString().toLowerCase().includes(searchLower)
      )
    }

    switch (filterType) {
      case "today": {
        const today = new Date()
        filtered = filtered.filter(alarm => {
          if (!alarm.reminderDate) return true
          const alarmDate = new Date(alarm.reminderDate)
          return alarmDate.toDateString() === today.toDateString()
        })
        break
      }
      case "recurring":
        filtered = filtered.filter(alarm => alarm.isRecurring)
        break
      case "scheduled":
        filtered = filtered.filter(alarm => alarm.reminderDate)
        break
    }

    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "time": {
          const timeA = new Date(`1970/01/01 ${a.time}`).getTime()
          const timeB = new Date(`1970/01/01 ${b.time}`).getTime()
          comparison = timeA - timeB
          break
        }
        case "label": {
          comparison = (a.label || "").localeCompare(b.label || "")
          break
        }
        case "date": {
          const dateA = a.reminderDate ? new Date(a.reminderDate).getTime() : 0
          const dateB = b.reminderDate ? new Date(b.reminderDate).getTime() : 0
          comparison = dateA - dateB
          break
        }
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [alarms, searchTerm, filterType, sortBy, sortOrder])

  const groupedAlarms = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const groups = {
      today: [] as Alarm[],
      tomorrow: [] as Alarm[],
      thisWeek: [] as Alarm[],
      later: [] as Alarm[],
      recurring: [] as Alarm[],
    }

    filteredAndSortedAlarms.forEach(alarm => {
      if (alarm.isRecurring) {
        groups.recurring.push(alarm)
        return
      }

      if (!alarm.reminderDate) {
        groups.today.push(alarm)
        return
      }

      const alarmDate = new Date(alarm.reminderDate)
      alarmDate.setHours(0, 0, 0, 0)

      if (alarmDate.getTime() === today.getTime()) {
        groups.today.push(alarm)
      } else if (alarmDate.getTime() === tomorrow.getTime()) {
        groups.tomorrow.push(alarm)
      } else if (alarmDate < nextWeek) {
        groups.thisWeek.push(alarm)
      } else {
        groups.later.push(alarm)
      }
    })

    return groups
  }, [filteredAndSortedAlarms])

  function AlarmGroup({ title, alarms, groupKey, onEdit, onDelete }: { title: string; alarms: Alarm[]; groupKey: string, onEdit?: (alarm: Alarm) => void, onDelete?: (id: string) => void }) {
    if (alarms.length === 0) return null

    return (
      <div 
        ref={(el) => { groupRefs.current[groupKey] = el }}
        className={cn(
          "space-y-2 transition-colors duration-300",
          focusedGroup === groupKey && "bg-white/5 -mx-2 px-2 rounded-lg"
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
            {title}
            <span className="text-xs text-white/40">({alarms.length})</span>
          </h3>
          {groupKey !== "recurring" && (
            <span className="text-xs text-white/40">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded">Alt + {
                { today: "1", tomorrow: "2", thisWeek: "3", later: "4", recurring: "5" }[groupKey]
              }</kbd>
            </span>
          )}
        </div>
        {alarms.map((alarm) => (
          <AlarmCard key={alarm.id} alarm={alarm} viewMode={viewMode} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "rounded-xl",
        "backdrop-blur-sm",
        "transition-all duration-300 ease-in-out",
        viewMode === "grouped" ? "bg-gray-900/20" : "bg-transparent",
        "border border-white/5"
      )}>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              {isSearching ? (
                <div className="flex-1 max-w-md relative">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search alarms..."
                    className={cn(
                      "pl-9 pr-8",
                      "bg-white/5 border-white/10",
                      "text-white placeholder:text-white/50",
                      "focus:border-white/20 focus:ring-0",
                      "h-9 rounded-lg"
                    )}
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-white/10"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ) : (
                <h2 className="text-lg font-medium text-white/90">Upcoming Alarms</h2>
              )}
              {!isSearching && filterType !== "all" && (
                <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded animate-in fade-in-50 duration-300">
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isSearching && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSearching(true)}
                      className="hover:bg-white/10"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-gray-900/95 border-white/10">
                    <p>Search alarms (Ctrl/⌘ + F)</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-white/10"
                      >
                        {viewMode === "grouped" ? (
                          <LayoutGrid className="h-4 w-4" />
                        ) : viewMode === "list" ? (
                          <LayoutList className="h-4 w-4" />
                        ) : (
                          <LayoutPanelTop className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-gray-900/95 border-white/10"
                    >
                      <DropdownMenuRadioGroup value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                        <DropdownMenuRadioItem value="grouped" className="text-white/70 flex items-center gap-2">
                          <LayoutGrid className="h-4 w-4" />
                          Grouped
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="list" className="text-white/70 flex items-center gap-2">
                          <LayoutList className="h-4 w-4" />
                          List
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="compact" className="text-white/70 flex items-center gap-2">
                          <LayoutPanelTop className="h-4 w-4" />
                          Compact
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-900/95 border-white/10">
                  <p>Change view mode (V)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "hover:bg-white/10",
                          sortBy !== "time" && "text-purple-400"
                        )}
                      >
                        <ArrowDownUp className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-52 bg-gray-900/95 border-white/10 backdrop-blur-xl"
                    >
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium text-white/80">Sort By</p>
                      </div>
                      <Separator className="bg-white/10" />
                      <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                        <DropdownMenuRadioItem 
                          value="time" 
                          className="text-white/70 flex items-center gap-2"
                        >
                          <AlarmClock className="h-4 w-4" />
                          Time
                          <kbd className="ml-auto text-xs text-white/40 px-1.5 py-0.5 bg-white/5 rounded">1</kbd>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem 
                          value="label" 
                          className="text-white/70 flex items-center gap-2"
                        >
                          <Tag className="h-4 w-4" />
                          Label
                          <kbd className="ml-auto text-xs text-white/40 px-1.5 py-0.5 bg-white/5 rounded">2</kbd>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem 
                          value="date" 
                          className="text-white/70 flex items-center gap-2"
                        >
                          <CalendarDays className="h-4 w-4" />
                          Date
                          <kbd className="ml-auto text-xs text-white/40 px-1.5 py-0.5 bg-white/5 rounded">3</kbd>
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                      <Separator className="bg-white/10" />
                      <div className="p-2">
                        <Toggle
                          pressed={sortOrder === "desc"}
                          onPressedChange={(pressed) => setSortOrder(pressed ? "desc" : "asc")}
                          className="w-full justify-start gap-2 hover:bg-white/10"
                        >
                          {sortOrder === "asc" ? (
                            <><SortAsc className="h-4 w-4" /> Ascending</>
                          ) : (
                            <><SortDesc className="h-4 w-4" /> Descending</>
                          )}
                          <kbd className="ml-auto text-xs text-white/40 px-1.5 py-0.5 bg-white/5 rounded">Space</kbd>
                        </Toggle>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-900/95 border-white/10">
                  <p>Sort options (1,2,3 to change, Space to toggle order)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Popover open={isFilterMenuOpen} onOpenChange={setIsFilterMenuOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "hover:bg-white/10",
                          filterType !== "all" && "text-purple-400"
                        )}
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-56 bg-gray-900/95 border-white/10 backdrop-blur-xl"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between px-2 pb-2">
                          <h3 className="text-sm font-medium text-white/80">Filter Alarms</h3>
                          <kbd className="text-xs text-white/40 px-1.5 py-0.5 bg-white/5 rounded">ESC to close</kbd>
                        </div>
                        <Separator className="bg-white/10" />
                        <button
                          onClick={() => {
                            setFilterType("all")
                            setIsFilterMenuOpen(false)
                          }}
                          className={cn(
                            "w-full px-2 py-1.5 text-sm text-left rounded",
                            "transition-colors duration-150",
                            "hover:bg-white/10",
                            "flex items-center justify-between",
                            filterType === "all" ? "text-white bg-white/10" : "text-white/70"
                          )}>
                          All Alarms
                          <kbd className="text-xs text-white/40 px-1.5 py-0.5 bg-white/5 rounded">A</kbd>
                        </button>
                        <button
                          onClick={() => {
                            setFilterType("today")
                            setIsFilterMenuOpen(false)
                          }}
                          className={cn(
                            "w-full px-2 py-1.5 text-sm text-left rounded flex items-center justify-between",
                            "transition-colors duration-150",
                            "hover:bg-white/10",
                            filterType === "today" ? "text-white bg-white/10" : "text-white/70"
                          )}>
                          <span className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            Today
                          </span>
                          <kbd className="text-xs text-white/40 px-1.5 py-0.5 bg-white/5 rounded">T</kbd>
                        </button>
                        <button
                          onClick={() => {
                            setFilterType("recurring")
                            setIsFilterMenuOpen(false)
                          }}
                          className={cn(
                            "w-full px-2 py-1.5 text-sm text-left rounded flex items-center justify-between",
                            "transition-colors duration-150",
                            "hover:bg-white/10",
                            filterType === "recurring" ? "text-white bg-white/10" : "text-white/70"
                          )}>
                          <span className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            Recurring
                          </span>
                          <kbd className="text-xs text-white/40 px-1.5 py-0.5 bg-white/5 rounded">R</kbd>
                        </button>
                        <button
                          onClick={() => {
                            setFilterType("scheduled")
                            setIsFilterMenuOpen(false)
                          }}
                          className={cn(
                            "w-full px-2 py-1.5 text-sm text-left rounded flex items-center justify-between",
                            "transition-colors duration-150",
                            "hover:bg-white/10",
                            filterType === "scheduled" ? "text-white bg-white/10" : "text-white/70"
                          )}>
                          <span className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            Scheduled
                          </span>
                          <kbd className="text-xs text-white/40 px-1.5 py-0.5 bg-white/5 rounded">S</kbd>
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-900/95 border-white/10">
                  <p>Filter alarms (A,T,R,S when menu open)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {searchTerm && (
            <div className="text-sm text-white/60">
              Found {filteredAndSortedAlarms.length} {filteredAndSortedAlarms.length === 1 ? 'alarm' : 'alarms'}
            </div>
          )}

          <div className={cn(
            "grid gap-2",
            "animate-in fade-in-50 duration-300",
            viewMode === "compact" && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          )}>
            {filteredAndSortedAlarms.length === 0 ? (
              <EmptyState filterType={filterType} />
            ) : viewMode === "grouped" ? (
              <>
                <AlarmGroup title="Today" alarms={groupedAlarms.today} groupKey="today" onEdit={onEditAlarm} onDelete={onDeleteAlarm} />
                <AlarmGroup title="Tomorrow" alarms={groupedAlarms.tomorrow} groupKey="tomorrow" onEdit={onEditAlarm} onDelete={onDeleteAlarm} />
                <AlarmGroup title="This Week" alarms={groupedAlarms.thisWeek} groupKey="thisWeek" onEdit={onEditAlarm} onDelete={onDeleteAlarm} />
                <AlarmGroup title="Later" alarms={groupedAlarms.later} groupKey="later" onEdit={onEditAlarm} onDelete={onDeleteAlarm} />
                <AlarmGroup title="Recurring" alarms={groupedAlarms.recurring} groupKey="recurring" onEdit={onEditAlarm} onDelete={onDeleteAlarm} />
              </>
            ) : viewMode === "list" ? (
              <div className="space-y-1 pt-2">
                {filteredAndSortedAlarms.map((alarm) => (
                  <AlarmCard key={alarm.id} alarm={alarm} viewMode={viewMode} onEdit={onEditAlarm} onDelete={onDeleteAlarm} />
                ))}
              </div>
            ) : (
              filteredAndSortedAlarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={cn(
                    "group relative",
                    "bg-gray-800/30 hover:bg-gray-800/50",
                    "backdrop-blur-sm",
                    "rounded-lg p-3",
                    "transition-all duration-200",
                    "flex flex-col gap-2"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-base text-white/90">{alarm.time}</p>
                    {alarm.isRecurring && (
                      <BellRing className="h-3.5 w-3.5 text-purple-400/90" />
                    )}
                  </div>
                  
                  {alarm.label && (
                    <p className="text-sm text-white/60 truncate">{alarm.label}</p>
                  )}
                  
                  {alarm.reminderDate && (
                    <p className="text-xs text-white/40 mt-auto">
                      {new Date(alarm.reminderDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  
                  <div className="absolute inset-px rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
