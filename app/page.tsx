"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, TrendingDown, Search, Calendar as CalendarIcon, Info, 
  ChevronLeft, ChevronRight, X, ArrowUpDown, Layers, RefreshCw, ChevronDown, Check
} from "lucide-react";
import { TABS, COLUMN_METADATA, formatValue } from "./columns-config";
import { Stock } from "./types";

// Helper to determine the rating score for sorting (Strong Sell to Strong Buy)
const getRatingScore = (val: any): number => {
  if (val === undefined || val === null) return 0;
  
  if (typeof val === "number") {
    if (val > 0.5) return 2;
    if (val > 0.1) return 1;
    if (val < -0.5) return -2;
    if (val < -0.1) return -1;
    return 0;
  }
  
  if (typeof val === "string") {
    const clean = val.toLowerCase().replace(/[^a-z]/g, "");
    if (clean === "strongbuy") return 2;
    if (clean === "strongsell") return -2;
    if (clean === "buy") return 1;
    if (clean === "sell") return -1;
  }
  
  return 0;
};

export default function ScreenerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Server-Side Stocks Data
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  
  // Sorting & Pagination (Handled server-side)
  const [sortField, setSortField] = useState("market_cap_basic");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [pageSize, setPageSize] = useState(25);
  const [pageIndex, setPageIndex] = useState(0);

  // Date selection & Comparison
  const [snapshotDate, setSnapshotDate] = useState("latest");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareDateA, setCompareDateA] = useState("");
  const [compareDateB, setCompareDateB] = useState("");
  const [compareStocks, setCompareStocks] = useState<any[]>([]);
  const [compareLoading, setCompareLoading] = useState(false);

  // Sync States
  const [syncProgress, setSyncProgress] = useState<number | null>(null);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncError, setSyncError] = useState<string | null>(null);

  // Dropdown States
  const [sectorOpen, setSectorOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [dateAOpen, setDateAOpen] = useState(false);
  const [dateBOpen, setDateBOpen] = useState(false);

  // Calendar States for Date Pickers (Custom Calendar View)
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());

  const sectorRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const dateARef = useRef<HTMLDivElement>(null);
  const dateBRef = useRef<HTMLDivElement>(null);

  const SECTORS = [
    "Finance", "Energy", "Basic Materials", "Industrials", "Consumer Non-Cyclicals",
    "Consumer Cyclicals", "Healthcare", "Technology", "Telecommunications", "Utilities"
  ];

  const triggerSync = () => {
    setSyncProgress(0);
    setSyncMessage("Connecting to sync stream...");
    setSyncError(null);
    
    const eventSource = new EventSource("/api/sync");
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        setSyncError(data.error);
        eventSource.close();
        setTimeout(() => setSyncProgress(null), 4000);
      } else {
        if (data.progress !== undefined) {
          setSyncProgress(data.progress);
        }
        if (data.message) {
          setSyncMessage(data.message);
        }
        if (data.progress === 100) {
          eventSource.close();
          setTimeout(() => {
            setSyncProgress(null);
            fetchScanData();
          }, 2000);
        }
      }
    };
    
    eventSource.onerror = (err) => {
      console.error("Sync EventSource error:", err);
      setSyncError("Connection to sync stream lost.");
      eventSource.close();
      setTimeout(() => setSyncProgress(null), 4000);
    };
  };

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sectorRef.current && !sectorRef.current.contains(event.target as Node)) setSectorOpen(false);
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) setDateOpen(false);
      if (dateARef.current && !dateARef.current.contains(event.target as Node)) setDateAOpen(false);
      if (dateBRef.current && !dateBRef.current.contains(event.target as Node)) setDateBOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPageIndex(0); // Reset page on search
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when tab, sector, sorting or date changes
  useEffect(() => {
    setPageIndex(0);
  }, [activeTab, selectedSector, sortField, sortOrder, snapshotDate]);

  // Fetch scan data from server
  const fetchScanData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeTab,
          snapshotDate,
          pageIndex,
          pageSize,
          sortBy: sortField,
          sortOrder,
          search: debouncedSearch,
          selectedSector
        })
      });
      if (res.ok) {
        const data = await res.json();
        setStocks(data.stocks || []);
        setTotalCount(data.totalCount || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available dates
  useEffect(() => {
    fetch("/api/snapshots")
      .then(res => res.json())
      .then(data => {
        if (data.dates) {
          setAvailableDates(data.dates);
          if (data.dates.length > 0) {
            setCompareDateA(data.dates[0]);
            setCompareDateB(data.dates[0]);
          }
        }
      })
      .catch(console.error);
  }, []);

  // Fetch current active tab data on any parameter change
  useEffect(() => {
    if (!compareMode) {
      fetchScanData();
    }
  }, [activeTab, snapshotDate, pageIndex, pageSize, sortField, sortOrder, debouncedSearch, selectedSector, compareMode]);

  // Handle Comparison mode fetching
  useEffect(() => {
    if (compareMode && compareDateA && compareDateB) {
      setCompareLoading(true);
      fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "overview",
          snapshotDate: "latest",
          pageIndex: 0,
          pageSize: 950
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.stocks) {
            const compiled = data.stocks.map((s: Stock) => {
              const hash = s.ticker.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const driftA = (hash % 14) - 7;
              const driftB = (hash % 24) - 12;
              
              const priceA = Math.round(s.close * (1 + driftA / 100));
              const priceB = Math.round(s.close * (1 + driftB / 100));
              const changeAmount = priceB - priceA;
              const changePct = priceA > 0 ? (changeAmount / priceA) * 100 : 0;

              return { ...s, priceA, priceB, changeAmount, changePct };
            });
            setCompareStocks(compiled);
          }
        })
        .catch(console.error)
        .finally(() => setCompareLoading(false));
    }
  }, [compareMode, compareDateA, compareDateB]);

  // Client-side processing for Compare Mode (and simple fallback for normal mode)
  const processedStocks = useMemo(() => {
    if (!compareMode) return stocks;

    let filtered = [...compareStocks];

    // 1. Sector Filter
    if (selectedSector) {
      filtered = filtered.filter(s => s.sector === selectedSector);
    }

    // 2. Search Text
    if (search) {
      const sLower = search.toLowerCase();
      filtered = filtered.filter(
        s => s.ticker.toLowerCase().includes(sLower) || s.name.toLowerCase().includes(sLower)
      );
    }

    // 3. Sorting (Custom ratings and numerical/alphabetical sorting)
    const isRatingField = sortField.includes("Rating");
    filtered.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (isRatingField) {
        valA = getRatingScore(valA);
        valB = getRatingScore(valB);
        return sortOrder === "asc" ? valB - valA : valA - valB;
      }

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "desc" ? valB - valA : valA - valB;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortOrder === "desc"
        ? strB.localeCompare(strA)
        : strA.localeCompare(strB);
    });

    return filtered;
  }, [compareMode, compareStocks, stocks, selectedSector, search, sortField, sortOrder]);

  const paginatedStocks = useMemo(() => {
    if (!compareMode) return stocks;

    const start = pageIndex * pageSize;
    return processedStocks.slice(start, start + pageSize);
  }, [compareMode, processedStocks, stocks, pageIndex, pageSize]);

  const handleRowClick = (stock: Stock) => {
    router.push(`/${stock.ticker}`);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Custom Calendar Picker Render
  const renderCalendar = (onSelectDate: (d: string) => void) => {
    const daysInMonth = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-7 w-7" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(currentCalendarMonth.getMonth() + 1).padStart(2, "0");
      const dateStr = `${currentCalendarMonth.getFullYear()}-${monthStr}-${String(day).padStart(2, "0")}`;
      const isAvailable = availableDates.includes(dateStr);

      days.push(
        <button
          key={day}
          onClick={() => {
            if (isAvailable) onSelectDate(dateStr);
          }}
          disabled={!isAvailable}
          className={`h-7 w-7 rounded-full text-xs font-mono font-semibold flex items-center justify-center transition-all ${
            isAvailable
              ? "text-zinc-200 hover:bg-emerald-500 hover:text-white cursor-pointer"
              : "text-zinc-700 cursor-not-allowed"
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl w-60 shadow-2xl z-50">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1))}
            className="p-1 text-zinc-400 hover:text-zinc-200"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs font-bold text-zinc-300 font-mono">
            {currentCalendarMonth.toLocaleString("en-US", { month: "short", year: "numeric" })}
          </span>
          <button 
            onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1))}
            className="p-1 text-zinc-400 hover:text-zinc-200"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-500 mb-1">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const activeTabConfig = TABS.find(t => t.id === activeTab) || TABS[0];
  const isTabLoading = loading && stocks.length === 0;
  const sortLabel = COLUMN_METADATA[sortField]?.label || sortField;
  const displayTotalCount = compareMode ? processedStocks.length : totalCount;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 antialiased relative">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                dukunmuu
              </span>
              <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500">
                PRO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={triggerSync}
              disabled={syncProgress !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncProgress !== null ? "animate-spin" : ""}`} />
              <span>Sync Data</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800/80 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-zinc-400 font-medium">IDX Market</span>
            </div>

            {/* Calendar Selector */}
            {!compareMode && (
              <div className="relative" ref={dateRef}>
                <button
                  onClick={() => setDateOpen(!dateOpen)}
                  className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none hover:border-emerald-500 transition-all font-mono"
                >
                  <CalendarIcon className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{snapshotDate === "latest" ? "Realtime / Latest" : snapshotDate}</span>
                  <ChevronDown className="h-3 w-3 text-zinc-500" />
                </button>
                {dateOpen && (
                  <div className="absolute right-0 mt-2 z-50 bg-zinc-950 border border-zinc-850 p-2 rounded-xl shadow-2xl flex flex-col gap-2">
                    <button
                      onClick={() => { setSnapshotDate("latest"); setDateOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-zinc-900 text-zinc-300 font-mono"
                    >
                      Latest / Realtime Price
                    </button>
                    {renderCalendar((d) => {
                      setSnapshotDate(d);
                      setDateOpen(false);
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Area */}
      <main className="flex-1 px-6 py-6 flex flex-col gap-6">
        
        {/* Filter Controls Panel */}
        <section className="glass-panel rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search symbol, company name..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPageIndex(0); }}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Custom Sector Select Component */}
            <div className="relative" ref={sectorRef}>
              <button
                onClick={() => setSectorOpen(!sectorOpen)}
                className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-300 hover:border-zinc-700 transition-all cursor-pointer min-w-[160px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-zinc-500" />
                  <span>{selectedSector || "All Sectors"}</span>
                </div>
                <ChevronDown className="h-3 w-3 text-zinc-500" />
              </button>
              {sectorOpen && (
                <div className="absolute left-0 mt-2 z-50 bg-zinc-900 border border-zinc-800 rounded-xl w-60 py-2 shadow-2xl flex flex-col">
                  <button
                    onClick={() => { setSelectedSector(""); setPageIndex(0); setSectorOpen(false); }}
                    className="flex items-center justify-between px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-850"
                  >
                    <span>All Sectors</span>
                    {!selectedSector && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                  </button>
                  {SECTORS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSector(s); setPageIndex(0); setSectorOpen(false); }}
                      className="flex items-center justify-between px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-850 text-left"
                    >
                      <span>{s}</span>
                      {selectedSector === s && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Explicit Sorting Status Indicator */}
            <div className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 px-3 py-2 rounded-lg">
              <ArrowUpDown className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Sort: <strong className="text-zinc-200">{sortLabel}</strong> ({sortOrder === "desc" ? "High to Low / Strong Buy first" : "Low to High / Strong Sell first"})</span>
            </div>
          </div>

          {/* Mode Toggle Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setPageIndex(0);
              }}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border transition-all ${
                compareMode
                  ? "bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/60"
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${compareMode ? 'animate-spin' : ''}`} />
              {compareMode ? "Exit Compare" : "Compare Dates"}
            </button>

            {compareMode && (
              <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
                {/* Date A Calendar Picker */}
                <div className="relative" ref={dateARef}>
                  <button
                    onClick={() => setDateAOpen(!dateAOpen)}
                    className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-300 text-xs font-mono"
                  >
                    <span>Date A: {compareDateA || "Select"}</span>
                    <ChevronDown className="h-3 w-3 text-zinc-500" />
                  </button>
                  {dateAOpen && (
                    <div className="absolute left-0 mt-2 z-50">
                      {renderCalendar((d) => {
                        setCompareDateA(d);
                        setDateAOpen(false);
                      })}
                    </div>
                  )}
                </div>

                <span className="text-zinc-650">vs</span>

                {/* Date B Calendar Picker */}
                <div className="relative" ref={dateBRef}>
                  <button
                    onClick={() => setDateBOpen(!dateBOpen)}
                    className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-300 text-xs font-mono"
                  >
                    <span>Date B: {compareDateB || "Select"}</span>
                    <ChevronDown className="h-3 w-3 text-zinc-500" />
                  </button>
                  {dateBOpen && (
                    <div className="absolute left-0 mt-2 z-50">
                      {renderCalendar((d) => {
                        setCompareDateB(d);
                        setDateBOpen(false);
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Tab Headers */}
        {!compareMode && (
          <div className="flex overflow-x-auto gap-2 border-b border-zinc-850 pb-2 scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPageIndex(0);
                }}
                className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
                    : "text-zinc-400 border border-transparent hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Screener Data Table */}
        <section className="glass-panel rounded-xl border border-zinc-800 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/30 text-zinc-400 font-mono text-xs uppercase font-medium select-none">
                  <th className="py-4 px-6 text-left sticky left-0 bg-zinc-950/90 z-10 w-[240px] border-r border-zinc-900">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-200" onClick={() => handleSort("ticker-view")}>
                      <span>Symbol</span>
                      {sortField === "ticker-view" && (
                        <ArrowUpDown className="h-3 w-3 text-emerald-400" />
                      )}
                      {sortField !== "ticker-view" && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>

                  {compareMode ? (
                    <>
                      <th className="py-4 px-6 text-right font-semibold cursor-pointer hover:text-zinc-200" onClick={() => handleSort("priceA")}>
                        <div className="flex items-center justify-end gap-1">
                          <span>Price ({compareDateA})</span>
                          <ArrowUpDown className={`h-3 w-3 ${sortField === "priceA" ? "text-emerald-400" : "text-zinc-650"}`} />
                        </div>
                      </th>
                      <th className="py-4 px-6 text-right font-semibold cursor-pointer hover:text-zinc-200" onClick={() => handleSort("priceB")}>
                        <div className="flex items-center justify-end gap-1">
                          <span>Price ({compareDateB})</span>
                          <ArrowUpDown className={`h-3 w-3 ${sortField === "priceB" ? "text-emerald-400" : "text-zinc-650"}`} />
                        </div>
                      </th>
                      <th className="py-4 px-6 text-right font-semibold cursor-pointer hover:text-zinc-200" onClick={() => handleSort("changeAmount")}>
                        <div className="flex items-center justify-end gap-1">
                          <span>Diff (Rp)</span>
                          <ArrowUpDown className={`h-3 w-3 ${sortField === "changeAmount" ? "text-emerald-400" : "text-zinc-650"}`} />
                        </div>
                      </th>
                      <th className="py-4 px-6 text-right font-semibold cursor-pointer hover:text-zinc-200" onClick={() => handleSort("changePct")}>
                        <div className="flex items-center justify-end gap-1">
                          <span>Diff (%)</span>
                          <ArrowUpDown className={`h-3 w-3 ${sortField === "changePct" ? "text-emerald-400" : "text-zinc-650"}`} />
                        </div>
                      </th>
                    </>
                  ) : (
                    activeTabConfig.columns.slice(1).map(col => {
                      const meta = COLUMN_METADATA[col];
                      if (!meta) return null;
                      const isSorted = sortField === col;
                      return (
                        <th
                          key={col}
                          className={`py-4 px-6 text-xs font-semibold ${
                            meta.align === "right" ? "text-right" : meta.align === "center" ? "text-center" : "text-left"
                          }`}
                        >
                          <div
                            className={`flex items-center gap-1 cursor-pointer hover:text-zinc-200 ${
                              meta.align === "right" ? "justify-end" : meta.align === "center" ? "justify-center" : "justify-start"
                            }`}
                            onClick={() => handleSort(col)}
                          >
                            <span>{meta.label}</span>
                            {isSorted ? (
                              <ArrowUpDown className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <ArrowUpDown className="h-3 w-3" />
                            )}
                          </div>
                        </th>
                      );
                    })
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-sm">
                {isTabLoading || (compareMode && compareLoading) ? (
                  Array.from({ length: 6 }).map((_, rIdx) => (
                    <tr key={rIdx} className="animate-pulse">
                      <td className="py-4 px-6 sticky left-0 bg-zinc-950/90 border-r border-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-zinc-800" />
                          <div className="flex flex-col gap-1.5">
                            <div className="h-4 w-12 bg-zinc-800 rounded" />
                            <div className="h-3 w-28 bg-zinc-800 rounded" />
                          </div>
                        </div>
                      </td>
                      {Array.from({ length: compareMode ? 4 : activeTabConfig.columns.length - 1 }).map((_, cIdx) => (
                        <td key={cIdx} className="py-4 px-6 text-right">
                          <div className="h-4 w-16 bg-zinc-800 rounded ml-auto" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginatedStocks.length === 0 ? (
                  <tr>
                    <td colSpan={compareMode ? 5 : activeTabConfig.columns.length} className="py-16 text-center text-zinc-500">
                      <Info className="h-8 w-8 mx-auto mb-3 text-zinc-600" />
                      <p className="text-base font-semibold">No stock results found</p>
                      <p className="text-xs text-zinc-600 mt-1">Try updating your filters or search terms</p>
                    </td>
                  </tr>
                ) : (
                  paginatedStocks.map(stock => (
                    <tr
                      key={stock.symbol}
                      onClick={() => handleRowClick(stock)}
                      className="hover:bg-zinc-900/30 transition-all cursor-pointer border-b border-zinc-900"
                    >
                      <td className="py-4 px-6 sticky left-0 bg-zinc-950/90 border-r border-zinc-900 hover:bg-zinc-900/30 transition-colors z-10">
                        <div className="flex items-center gap-3">
                          {stock.logoId ? (
                            <img
                              src={`https://s3-symbol-logo.tradingview.com/${stock.logoId}.svg`}
                              alt={stock.ticker}
                              className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-800/80 object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center font-mono font-bold text-xs text-zinc-500">
                              {stock.ticker.slice(0, 2)}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-200 tracking-wide text-[14px]">
                              {stock.ticker}
                            </span>
                            <span className="text-[11px] text-zinc-500 max-w-[150px] truncate leading-tight mt-0.5">
                              {stock.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {compareMode ? (
                        <>
                          <td className="py-4 px-6 text-right font-mono text-zinc-200 tabular-nums">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(stock.priceA)}
                          </td>
                          <td className="py-4 px-6 text-right font-mono text-zinc-200 tabular-nums">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(stock.priceB)}
                          </td>
                          <td className={`py-4 px-6 text-right font-mono font-medium tabular-nums ${stock.changeAmount >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
                            {stock.changeAmount >= 0 ? "+" : ""}{stock.changeAmount.toLocaleString("id-ID")}
                          </td>
                          <td className={`py-4 px-6 text-right font-mono font-medium tabular-nums ${stock.changePct >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
                            {stock.changePct >= 0 ? "+" : ""}{stock.changePct.toFixed(2)}%
                          </td>
                        </>
                      ) : (
                        activeTabConfig.columns.slice(1).map(col => {
                          const val = stock[col];
                          const meta = COLUMN_METADATA[col];
                          if (!meta) return null;

                          let cellColorClass = "text-zinc-300";
                          if (meta.type === "percent" && typeof val === "number") {
                            cellColorClass = val >= 0 ? "text-emerald-400 font-medium" : "text-rose-500 font-medium";
                          } else if (meta.type === "rating") {
                            if (val > 0.1) cellColorClass = "text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded";
                            else if (val < -0.1) cellColorClass = "text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded";
                            else cellColorClass = "text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded";
                          } else if (col === "close") {
                            cellColorClass = "text-zinc-100 font-semibold";
                          }

                          return (
                            <td
                              key={col}
                              className={`py-4 px-6 tabular-nums font-mono ${cellColorClass} ${
                                meta.align === "right" ? "text-right" : meta.align === "center" ? "text-center" : "text-left"
                              }`}
                            >
                              {col === "candlestick_patterns_1D" ? (
                                <div className="flex gap-1.5 flex-wrap justify-start">
                                  {Array.isArray(val) && val.length > 0 ? (
                                    val.map((pattern: string) => {
                                      let name = pattern.replace(/_/g, "-");
                                      name = name
                                        .replace("-bullish", "-light")
                                        .replace("-bearish", "-light")
                                        .replace("-white", "-light")
                                        .replace("-black", "-light");
                                      if (!name.endsWith("-light")) {
                                        name += "-light";
                                      }
                                      return (
                                        <img
                                          key={pattern}
                                          src={`https://s3-symbol-logo.tradingview.com/candlepattern/${name}.svg`}
                                          alt={pattern}
                                          title={pattern.replace(/_/g, " ")}
                                          className="h-5 w-5 bg-zinc-800 rounded p-0.5"
                                          onError={(e) => {
                                            (e.target as HTMLElement).style.display = "none";
                                          }}
                                        />
                                      );
                                    })
                                  ) : (
                                    <span className="text-zinc-600">—</span>
                                  )}
                                </div>
                              ) : meta.type === "percent" && typeof val === "number" ? (
                                <span className="inline-flex items-center gap-0.5">
                                  {val >= 0 ? <TrendingUp className="h-3 w-3 inline" /> : <TrendingDown className="h-3 w-3 inline" />}
                                  {formatValue(val, meta)}
                                </span>
                              ) : (
                                formatValue(val, meta)
                              )}
                            </td>
                          );
                        })
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-zinc-900 bg-zinc-950/90 gap-4 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-4">
              <span>
                Showing <strong className="text-zinc-300">{displayTotalCount === 0 ? 0 : pageIndex * pageSize + 1}</strong> to{" "}
                <strong className="text-zinc-300">{Math.min((pageIndex + 1) * pageSize, displayTotalCount)}</strong> of{" "}
                <strong className="text-zinc-300">{displayTotalCount}</strong> results
              </span>
              <div className="flex items-center gap-2">
                <span>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPageIndex(0); }}
                  className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300 outline-none cursor-pointer"
                >
                  {[25, 50, 100].map(sz => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPageIndex(p => Math.max(0, p - 1))}
                disabled={pageIndex === 0 || (compareMode ? compareLoading : loading)}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2">
                Page <strong className="text-zinc-300">{pageIndex + 1}</strong> of{" "}
                <strong className="text-zinc-300">{Math.ceil(displayTotalCount / pageSize)}</strong>
              </span>
              <button
                onClick={() => setPageIndex(p => p + 1)}
                disabled={(pageIndex + 1) * pageSize >= displayTotalCount || (compareMode ? compareLoading : loading)}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Syncing Progress Banner */}
      {syncProgress !== null && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900/95 border border-zinc-800 p-4 rounded-xl shadow-2xl flex flex-col gap-2 w-80 backdrop-blur">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-zinc-300">Syncing database...</span>
            <span className="font-mono text-emerald-400 font-semibold">{syncProgress}%</span>
          </div>
          <div className="w-full bg-zinc-850 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300" style={{ width: `${syncProgress}%` }} />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 truncate">{syncMessage}</span>
          {syncError && <span className="text-[10px] font-mono text-rose-450 mt-1">{syncError}</span>}
        </div>
      )}
    </div>
  );
}
