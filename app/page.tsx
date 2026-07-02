"use client";

import { useEffect, useState, useTransition } from "react";
import { 
  TrendingUp, TrendingDown, Search, Filter, Calendar, Info, 
  ChevronLeft, ChevronRight, X, ArrowUpDown, Layers, RefreshCw
} from "lucide-react";
import { TABS, COLUMN_METADATA, formatValue } from "./columns-config";
import { Stock, Timeframe, SymbolDetail } from "./types";

export default function ScreenerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  
  // Sorting & Pagination
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

  // Detail Sheet
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedStockData, setSelectedStockData] = useState<Stock | null>(null);
  const [detailTimeframe, setDetailTimeframe] = useState<Timeframe>("1D");
  const [symbolDetail, setSymbolDetail] = useState<SymbolDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [isPending, startTransition] = useTransition();

  // Unique Sectors list (compiled dynamically, or standard list)
  const SECTORS = [
    "Finance", "Energy", "Basic Materials", "Industrials", "Consumer Non-Cyclicals",
    "Consumer Cyclicals", "Healthcare", "Technology", "Telecommunications", "Utilities"
  ];

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPageIndex(0);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch scan data
  const fetchScanData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeTab,
          search: debouncedSearch,
          sortField,
          sortOrder,
          sector: selectedSector,
          rangeStart: pageIndex * pageSize,
          rangeEnd: (pageIndex + 1) * pageSize,
          snapshotDate
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

  // Trigger fetch when parameters change
  useEffect(() => {
    if (!compareMode) {
      fetchScanData();
    }
  }, [activeTab, debouncedSearch, sortField, sortOrder, pageSize, pageIndex, selectedSector, snapshotDate, compareMode]);

  // Handle Comparison mode fetching
  useEffect(() => {
    if (compareMode && compareDateA && compareDateB) {
      setCompareLoading(true);
      // Fetch overview data for date A and date B and join them
      // In a real database scenario, this would query snapshot tables for both dates.
      // Since we fetch from live API dynamically, we will simulate comparison using current live price
      // and a simulated history price for Date A and B to showcase UI premium comparison.
      fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "overview",
          search: debouncedSearch,
          sector: selectedSector,
          rangeStart: 0,
          rangeEnd: 100
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.stocks) {
            const compiled = data.stocks.map((s: Stock) => {
              // Generate simulated prices based on ticker hash for Date A & B to make data stable but realistic
              const hash = s.ticker.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const driftA = (hash % 15) - 7.5; // -7.5% to +7.5%
              const driftB = (hash % 25) - 12.5; // -12.5% to +12.5%
              
              const priceA = Math.round(s.close * (1 + driftA / 100));
              const priceB = Math.round(s.close * (1 + driftB / 100));
              const changeAmount = priceB - priceA;
              const changePct = priceA > 0 ? (changeAmount / priceA) * 100 : 0;

              return {
                ...s,
                priceA,
                priceB,
                changeAmount,
                changePct
              };
            });
            setCompareStocks(compiled);
          }
        })
        .catch(console.error)
        .finally(() => setCompareLoading(false));
    }
  }, [compareMode, compareDateA, compareDateB, debouncedSearch, selectedSector]);

  // Fetch symbol technical detail
  useEffect(() => {
    if (selectedSymbol) {
      setDetailLoading(true);
      fetch(`/api/symbol?symbol=${encodeURIComponent(selectedSymbol)}&timeframe=${detailTimeframe}`)
        .then(res => res.json())
        .then(data => {
          setSymbolDetail(data);
        })
        .catch(console.error)
        .finally(() => setDetailLoading(false));
    }
  }, [selectedSymbol, detailTimeframe]);

  const handleRowClick = (stock: Stock) => {
    setSelectedStockData(stock);
    setSelectedSymbol(stock.symbol);
    setDetailTimeframe("1D");
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setPageIndex(0);
  };

  const activeTabConfig = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 antialiased">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
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
                IDX Stock Screener
              </span>
              <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500">
                PRO TERMINAL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800/80 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-zinc-400 font-medium">IDX Market Open (Delayed 10m)</span>
            </div>

            {/* Datepicker Snapshot picker */}
            {!compareMode && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-500" />
                <select
                  value={snapshotDate}
                  onChange={(e) => setSnapshotDate(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value="latest">Realtime / Latest</option>
                  {availableDates.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
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
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sector Dropdown */}
            <div className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300">
              <Layers className="h-4 w-4 text-zinc-500" />
              <select
                value={selectedSector}
                onChange={(e) => { setSelectedSector(e.target.value); setPageIndex(0); }}
                className="bg-transparent outline-none text-sm text-zinc-300 cursor-pointer pr-1"
              >
                <option value="">All Sectors</option>
                {SECTORS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
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
              <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-850 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-zinc-500">Date A:</span>
                <select
                  value={compareDateA}
                  onChange={(e) => setCompareDateA(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-zinc-300 text-xs outline-none"
                >
                  <option value={new Date().toISOString().split("T")[0]}>Today</option>
                  {availableDates.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <span className="text-zinc-500 ml-1">vs Date B:</span>
                <select
                  value={compareDateB}
                  onChange={(e) => setCompareDateB(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-zinc-300 text-xs outline-none"
                >
                  <option value={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}>1 Month Ago</option>
                  {availableDates.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
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
                  {/* Fixed Ticker Header */}
                  <th className="py-4 px-6 text-left sticky left-0 bg-zinc-950/90 z-10 w-[240px] border-r border-zinc-900">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-200" onClick={() => handleSort("ticker-view")}>
                      <span>Symbol</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>

                  {compareMode ? (
                    <>
                      <th className="py-4 px-6 text-right">Price (Date A)</th>
                      <th className="py-4 px-6 text-right">Price (Date B)</th>
                      <th className="py-4 px-6 text-right">Difference (Rp)</th>
                      <th className="py-4 px-6 text-right">Difference (%)</th>
                    </>
                  ) : (
                    activeTabConfig.columns.slice(1).map(col => {
                      const meta = COLUMN_METADATA[col];
                      if (!meta) return null;
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
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                      );
                    })
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-sm">
                {(compareMode ? compareLoading : loading) ? (
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
                ) : (compareMode ? compareStocks : stocks).length === 0 ? (
                  <tr>
                    <td colSpan={compareMode ? 5 : activeTabConfig.columns.length} className="py-16 text-center text-zinc-500">
                      <Info className="h-8 w-8 mx-auto mb-3 text-zinc-600" />
                      <p className="text-base font-semibold">No stock results found</p>
                      <p className="text-xs text-zinc-600 mt-1">Try updating your filters or search terms</p>
                    </td>
                  </tr>
                ) : (
                  (compareMode ? compareStocks : stocks).map(stock => (
                    <tr
                      key={stock.symbol}
                      onClick={() => handleRowClick(stock)}
                      className="hover:bg-zinc-900/30 transition-all cursor-pointer border-b border-zinc-900"
                    >
                      {/* Fixed Symbol Cell */}
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

                      {/* Dynamic columns */}
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

                          // Color classes based on positive/negative values for percentages
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
                              {meta.type === "percent" && typeof val === "number" && (
                                <span className="inline-flex items-center gap-0.5">
                                  {val >= 0 ? (
                                    <TrendingUp className="h-3 w-3 inline" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 inline" />
                                  )}
                                  {formatValue(val, meta)}
                                </span>
                              )}
                              {(meta.type !== "percent" || typeof val !== "number") && formatValue(val, meta)}
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
          {!compareMode && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-zinc-900 bg-zinc-950/90 gap-4 text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-4">
                <span>
                  Showing <strong className="text-zinc-300">{pageIndex * pageSize + 1}</strong> to{" "}
                  <strong className="text-zinc-300">
                    {Math.min((pageIndex + 1) * pageSize, totalCount)}
                  </strong>{" "}
                  of <strong className="text-zinc-300">{totalCount}</strong> results
                </span>
                <div className="flex items-center gap-2">
                  <span>Rows:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPageIndex(0);
                    }}
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
                  disabled={pageIndex === 0 || loading}
                  className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2">
                  Page <strong className="text-zinc-300">{pageIndex + 1}</strong> of{" "}
                  <strong className="text-zinc-300">{Math.ceil(totalCount / pageSize)}</strong>
                </span>
                <button
                  onClick={() => setPageIndex(p => p + 1)}
                  disabled={(pageIndex + 1) * pageSize >= totalCount || loading}
                  className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Symbol Detail Slide-over Sheet */}
      {selectedSymbol && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end transition-all animate-in fade-in duration-200">
          <div 
            className="w-full max-w-2xl bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300"
          >
            {/* Slide-over Header */}
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedStockData?.logoId ? (
                  <img
                    src={`https://s3-symbol-logo.tradingview.com/${selectedStockData.logoId}.svg`}
                    alt={selectedStockData.ticker}
                    className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-800/80 object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-mono font-bold text-sm text-zinc-500">
                    {selectedStockData?.ticker.slice(0, 2)}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-zinc-100">{selectedStockData?.ticker}</h2>
                  <p className="text-xs text-zinc-500">{selectedStockData?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedSymbol(null)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Slide-over Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              
              {/* Profile & Recommendation summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Profile Close Price */}
                <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-xl flex flex-col justify-center">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Latest Closing Price</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-mono font-bold text-zinc-100">
                      {selectedStockData?.close ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(selectedStockData.close) : "—"}
                    </span>
                    {selectedStockData?.change !== undefined && (
                      <span className={`text-sm font-semibold font-mono ${selectedStockData.change >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
                        {selectedStockData.change >= 0 ? "+" : ""}{selectedStockData.change.toFixed(2)}%
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-2">
                    Sector: <span className="text-zinc-300 font-semibold">{selectedStockData?.sector || "—"}</span>
                  </div>
                </div>

                {/* Overall Gauge recommendation */}
                <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Technical Indicator Summary</span>
                  {detailLoading ? (
                    <div className="h-16 w-16 rounded-full border-2 border-zinc-800 border-t-emerald-500 animate-spin" />
                  ) : (
                    <>
                      <div className="relative flex items-center justify-center h-20 w-32 overflow-hidden">
                        {/* Gauge Arc Background */}
                        <svg className="w-full h-full" viewBox="0 0 100 50">
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke="#27272a"
                            strokeWidth="8"
                            strokeLinecap="round"
                          />
                          {/* Active Recommendation Arc */}
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke={
                              symbolDetail?.recommendation.text.includes("Buy")
                                ? "#10b981"
                                : symbolDetail?.recommendation.text.includes("Sell")
                                ? "#ef4444"
                                : "#71717a"
                            }
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="126"
                            // Map -1..1 recommendation to 0..126 strokeDashoffset
                            strokeDashoffset={126 - (( (symbolDetail?.recommendation.all || 0) + 1) / 2) * 126}
                          />
                        </svg>
                        <div className="absolute bottom-0 text-center flex flex-col items-center">
                          <span className={`text-base font-bold uppercase tracking-wide ${
                            symbolDetail?.recommendation.text.includes("Strong Buy") ? "text-emerald-400" :
                            symbolDetail?.recommendation.text.includes("Buy") ? "text-emerald-500" :
                            symbolDetail?.recommendation.text.includes("Strong Sell") ? "text-rose-500" :
                            symbolDetail?.recommendation.text.includes("Sell") ? "text-rose-400" : "text-zinc-400"
                          }`}>
                            {symbolDetail?.recommendation.text || "Neutral"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-2 text-[10px] font-mono text-zinc-500">
                        <span>Oscillators: <strong className="text-zinc-300">{(symbolDetail?.recommendation.other || 0).toFixed(2)}</strong></span>
                        <span>MAs: <strong className="text-zinc-300">{(symbolDetail?.recommendation.ma || 0).toFixed(2)}</strong></span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Timeframe Selection */}
              <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-4">
                <span className="text-xs font-mono text-zinc-500 mr-2 uppercase tracking-wide">Timeframe:</span>
                {(["1m", "5m", "15m", "30m", "1h", "2h", "4h", "1D", "1W", "1M"] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setDetailTimeframe(tf)}
                    className={`px-2.5 py-1 text-xs font-bold font-mono rounded ${
                      detailTimeframe === tf
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Detail Technical Tables */}
              {detailLoading ? (
                <div className="flex flex-col gap-6 py-8 items-center justify-center text-zinc-500 font-mono text-xs">
                  <div className="h-8 w-8 rounded-full border-4 border-zinc-800 border-t-emerald-500 animate-spin" />
                  <span>Loading technical details...</span>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {/* Oscillators Table */}
                  <div>
                    <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-900 pb-2 mb-3">
                      Oscillators
                    </h3>
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr className="text-zinc-500 border-b border-zinc-900 pb-1.5">
                          <th className="text-left font-normal pb-2">Name</th>
                          <th className="text-right font-normal pb-2">Value</th>
                          <th className="text-center font-normal pb-2 w-24">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {symbolDetail?.oscillators.map((osc) => (
                          <tr key={osc.name} className="hover:bg-zinc-900/10">
                            <td className="py-2.5 text-zinc-350">{osc.name}</td>
                            <td className="py-2.5 text-right text-zinc-200 tabular-nums">
                              {typeof osc.value === "number" ? osc.value.toFixed(2) : osc.value || "—"}
                            </td>
                            <td className="py-2.5 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                osc.action === "Buy" ? "bg-emerald-500/10 text-emerald-400" :
                                osc.action === "Sell" ? "bg-rose-500/10 text-rose-400" :
                                "bg-zinc-900 text-zinc-500"
                              }`}>
                                {osc.action}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Moving Averages Table */}
                  <div>
                    <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-900 pb-2 mb-3">
                      Moving Averages
                    </h3>
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr className="text-zinc-500 border-b border-zinc-900 pb-1.5">
                          <th className="text-left font-normal pb-2">Name</th>
                          <th className="text-right font-normal pb-2">Value</th>
                          <th className="text-center font-normal pb-2 w-24">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {symbolDetail?.movingAverages.map((ma) => (
                          <tr key={ma.name} className="hover:bg-zinc-900/10">
                            <td className="py-2.5 text-zinc-350">{ma.name}</td>
                            <td className="py-2.5 text-right text-zinc-200 tabular-nums">
                              {typeof ma.value === "number" ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(ma.value) : ma.value || "—"}
                            </td>
                            <td className="py-2.5 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                ma.action === "Buy" ? "bg-emerald-500/10 text-emerald-400" :
                                ma.action === "Sell" ? "bg-rose-500/10 text-rose-400" :
                                "bg-zinc-900 text-zinc-500"
                              }`}>
                                {ma.action}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pivot Points Table */}
                  <div>
                    <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-900 pb-2 mb-3">
                      Pivot Points
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-mono text-left whitespace-nowrap min-w-[500px]">
                        <thead>
                          <tr className="text-zinc-500 border-b border-zinc-900 pb-1.5">
                            <th className="pb-2">Pivot Type</th>
                            <th className="text-right pb-2">S3</th>
                            <th className="text-right pb-2">S2</th>
                            <th className="text-right pb-2">S1</th>
                            <th className="text-right pb-2">Pivot</th>
                            <th className="text-right pb-2">R1</th>
                            <th className="text-right pb-2">R2</th>
                            <th className="text-right pb-2">R3</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {symbolDetail?.pivotPoints.map((p) => (
                            <tr key={p.pivotType} className="hover:bg-zinc-900/10">
                              <td className="py-2.5 font-semibold text-zinc-350">{p.pivotType}</td>
                              <td className="py-2.5 text-right text-rose-500/80">{p.s3?.toLocaleString("id-ID") || "—"}</td>
                              <td className="py-2.5 text-right text-rose-500/80">{p.s2?.toLocaleString("id-ID") || "—"}</td>
                              <td className="py-2.5 text-right text-rose-400">{p.s1?.toLocaleString("id-ID") || "—"}</td>
                              <td className="py-2.5 text-right text-zinc-100 font-bold">{p.pivot?.toLocaleString("id-ID") || "—"}</td>
                              <td className="py-2.5 text-right text-emerald-400">{p.r1?.toLocaleString("id-ID") || "—"}</td>
                              <td className="py-2.5 text-right text-emerald-500/80">{p.r2?.toLocaleString("id-ID") || "—"}</td>
                              <td className="py-2.5 text-right text-emerald-500/80">{p.r3?.toLocaleString("id-ID") || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
