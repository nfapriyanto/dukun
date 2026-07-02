"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Info, TrendingUp, TrendingDown } from "lucide-react";
import { Timeframe, SymbolDetail } from "../types";

export default function SymbolDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const ticker = resolvedParams.ticker;

  const [detailTimeframe, setDetailTimeframe] = useState<Timeframe>("1D");
  const [symbolDetail, setSymbolDetail] = useState<SymbolDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndicator, setHoveredIndicator] = useState<{
    name: string;
    description: string;
    x: number;
    y: number;
  } | null>(null);
  const [expandedKseiRow, setExpandedKseiRow] = useState<string | null>(null);

  const symbol = `IDX:${ticker}`;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/symbol?symbol=${encodeURIComponent(symbol)}&timeframe=${detailTimeframe}`)
      .then(res => res.json())
      .then(data => {
        setSymbolDetail(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [symbol, detailTimeframe]);

  const renderGauge = (val: number, title: string, sell: number, neutral: number, buy: number) => {
    let recommendation = "Neutral";
    let color = "#71717a";

    if (val > 0.5) {
      recommendation = "Strong Buy";
      color = "#10b981";
    } else if (val > 0.1) {
      recommendation = "Buy";
      color = "#34d399";
    } else if (val < -0.5) {
      recommendation = "Strong Sell";
      color = "#ef4444";
    } else if (val < -0.1) {
      recommendation = "Sell";
      color = "#f87171";
    }

    const normalized = (val + 1) / 2;
    const offset = 126 - (normalized * 126);

    return (
      <div className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-zinc-700/60 transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-[3px] transition-all duration-300 group-hover:h-[5px]" style={{ backgroundColor: color }} />
        <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase mb-2">{title}</span>

        <div className="relative flex items-center justify-center h-24 w-36 overflow-hidden mt-2">
          <svg className="w-full h-full" viewBox="0 0 100 50">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#27272a"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={color}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="126"
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute bottom-0 text-center flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-zinc-500 tabular-nums">{val > 0 ? "+" : ""}{val.toFixed(2)}</span>
            <span className="text-[13px] font-bold uppercase tracking-wider mt-0.5" style={{ color }}>
              {recommendation}
            </span>
          </div>
        </div>

        {/* Counter Summary Below the Gauge */}
        <div className="flex justify-between w-full mt-5 text-[11px] font-mono border-t border-zinc-800/60 pt-3 px-1">
          <span className="text-rose-400 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Sell: {sell}
          </span>
          <span className="text-zinc-500 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-650" />
            Neutral: {neutral}
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Buy: {buy}
          </span>
        </div>
      </div>
    );
  };

  const getIndicatorTooltipText = (name: string, value: any): string => {
    if (name.includes("RSI")) {
      return `Relative Strength Index (RSI): Current value is ${value || "—"}. Value <30 triggers Buy (Oversold), >70 triggers Sell (Overbought).`;
    }
    if (name.includes("Stochastic %K")) {
      return `Stochastic Oscillator: Current value is ${value || "—"}. Value <20 triggers Buy (Oversold), >80 triggers Sell (Overbought).`;
    }
    if (name.includes("CCI")) {
      return `Commodity Channel Index (CCI): Current value is ${value || "—"}. Value <-100 triggers Buy, >100 triggers Sell.`;
    }
    if (name.includes("ADX")) {
      return `Average Directional Index (ADX): Current value is ${value || "—"}. Evaluates trend strength (value >20 represents trending markets).`;
    }
    if (name.includes("Awesome")) {
      return `Awesome Oscillator (AO): Current value is ${value || "—"}. Value >0 and rising triggers Buy, <0 and falling triggers Sell.`;
    }
    if (name.includes("Momentum")) {
      return `Momentum: Current value is ${value || "—"}. Compares current price to past price. Rising value triggers Buy.`;
    }
    if (name.includes("MACD")) {
      return `Moving Average Convergence Divergence (MACD): Current value is ${value || "—"}. Line crossing above signal line triggers Buy.`;
    }
    if (name.includes("Moving Average")) {
      return `Moving Average: Current price compared to MA value. Price > MA triggers Buy, Price < MA triggers Sell.`;
    }
    return `${name}: Current value is ${value || "—"}. Standard technical recommendation indicator value.`;
  };

  // Helper to count sinyals inside oscillators or MAs arrays
  const getCounts = (indicators: { action: string }[]) => {
    let sell = 0;
    let neutral = 0;
    let buy = 0;
    indicators.forEach(ind => {
      if (ind.action === "Buy") buy++;
      else if (ind.action === "Sell") sell++;
      else neutral++;
    });
    return { sell, neutral, buy };
  };

  const getPivotValue = (type: string, key: "r3" | "r2" | "r1" | "pivot" | "s1" | "s2" | "s3") => {
    if (!symbolDetail || !symbolDetail.pivotPoints) return "—";
    const p = symbolDetail.pivotPoints.find(item => item.pivotType.toLowerCase() === type.toLowerCase());
    if (!p) return "—";
    const val = p[key];
    if (val === null || val === undefined) return "—";
    return val.toLocaleString("id-ID");
  };

  const oscCounts = symbolDetail ? getCounts(symbolDetail.oscillators) : { sell: 0, neutral: 0, buy: 0 };
  const maCounts = symbolDetail ? getCounts(symbolDetail.movingAverages) : { sell: 0, neutral: 0, buy: 0 };
  const summaryCounts = {
    sell: oscCounts.sell + maCounts.sell,
    neutral: oscCounts.neutral + maCounts.neutral,
    buy: oscCounts.buy + maCounts.buy
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 antialiased relative">
      {hoveredIndicator && (
        <div
          className="fixed z-50 max-w-xs p-3 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-xl shadow-2xl pointer-events-none"
          style={{ top: hoveredIndicator.y + 15, left: Math.min(hoveredIndicator.x + 15, window.innerWidth - 300) }}
        >
          <h4 className="font-bold text-emerald-400 mb-1">{hoveredIndicator.name}</h4>
          <p className="leading-relaxed font-mono text-[11px]">{hoveredIndicator.description}</p>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6 max-w-6xl mx-auto">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Screener</span>
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">{ticker} Technical analysis</h1>
          </div>

          <div className="w-[120px]" />
        </div>
      </header>

      {/* Detail Content */}
      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Profile Card & Recommendation summary */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Header info card */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center">
                {symbolDetail?.logoId ? (
                  <img
                    src={`https://s3-symbol-logo.tradingview.com/${symbolDetail.logoId}.svg`}
                    alt={ticker}
                    className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 object-cover mr-4"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-sm text-zinc-500 mr-4">
                    {ticker.slice(0, 2)}
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-bold text-zinc-100">{ticker}</h2>
                  <p className="text-xs text-zinc-500 mt-1">PT Bursa Efek Indonesia (IDX) Stock Technicals Analysis Summary</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-mono text-zinc-505 uppercase tracking-wider">Last Price</span>
                <span className="text-3xl font-bold font-mono text-white">
                  {symbolDetail?.close ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(symbolDetail.close) : "—"}
                </span>
              </div>
            </div>

            {/* Gauges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderGauge(symbolDetail?.recommendation.other || 0, "Oscillators Summary", oscCounts.sell, oscCounts.neutral, oscCounts.buy)}
              {renderGauge(symbolDetail?.recommendation.all || 0, "Aggregate Summary", summaryCounts.sell, summaryCounts.neutral, summaryCounts.buy)}
              {renderGauge(symbolDetail?.recommendation.ma || 0, "Moving Averages Summary", maCounts.sell, maCounts.neutral, maCounts.buy)}
            </div>

            {/* Timeframe Toggles */}
            <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-4 overflow-x-auto">
              <span className="text-xs font-mono text-zinc-505 mr-2 uppercase tracking-wide">Timeframe:</span>
              {(["1m", "5m", "15m", "30m", "1h", "2h", "4h", "1D", "1W", "1M"] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setDetailTimeframe(tf)}
                  className={`px-3 py-1.5 text-xs font-bold font-mono rounded-lg border transition-all ${detailTimeframe === tf
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-900/60"
                    }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Technical Detail tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Oscillators List */}
              <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl flex flex-col">
                <h3 className="text-sm font-mono text-zinc-350 uppercase tracking-wider border-b border-zinc-905 pb-3 mb-4 font-bold">
                  Oscillators analysis
                </h3>
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-900">
                      <th className="pb-2.5 font-normal">Name</th>
                      <th className="pb-2.5 text-right font-normal">Value</th>
                      <th className="pb-2.5 text-center font-normal w-24">Action</th>
                      <th className="pb-2.5 text-center font-normal w-12">Info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {symbolDetail?.oscillators.map((osc) => (
                      <tr key={osc.name} className="hover:bg-zinc-900/20">
                        <td className="py-3 text-zinc-400">{osc.name}</td>
                        <td className="py-3 text-right text-zinc-200 tabular-nums">
                          {typeof osc.value === "number" ? osc.value.toFixed(2) : osc.value || "—"}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${osc.action === "Buy" ? "bg-emerald-500/10 text-emerald-400" :
                              osc.action === "Sell" ? "bg-rose-500/10 text-rose-400" :
                                "bg-zinc-900/60 text-zinc-500 border border-zinc-800/40"
                            }`}>
                            {osc.action}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onMouseEnter={(e) => {
                              setHoveredIndicator({
                                name: osc.name,
                                description: getIndicatorTooltipText(osc.name, osc.value),
                                x: e.clientX,
                                y: e.clientY
                              });
                            }}
                            onMouseLeave={() => setHoveredIndicator(null)}
                            className="text-zinc-605 hover:text-emerald-400 transition-colors p-1"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MAs List */}
              <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl flex flex-col">
                <h3 className="text-sm font-mono text-zinc-350 uppercase tracking-wider border-b border-zinc-905 pb-3 mb-4 font-bold">
                  Moving Averages analysis
                </h3>
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-900">
                      <th className="pb-2.5 font-normal">Name</th>
                      <th className="pb-2.5 text-right font-normal">Value</th>
                      <th className="pb-2.5 text-center font-normal w-24">Action</th>
                      <th className="pb-2.5 text-center font-normal w-12">Info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {symbolDetail?.movingAverages.map((ma) => (
                      <tr key={ma.name} className="hover:bg-zinc-900/20">
                        <td className="py-3 text-zinc-400">{ma.name}</td>
                        <td className="py-3 text-right text-zinc-200 tabular-nums">
                          {typeof ma.value === "number" ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(ma.value) : ma.value || "—"}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ma.action === "Buy" ? "bg-emerald-500/10 text-emerald-400" :
                              ma.action === "Sell" ? "bg-rose-500/10 text-rose-400" :
                                "bg-zinc-900/60 text-zinc-500 border border-zinc-800/40"
                            }`}>
                            {ma.action}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onMouseEnter={(e) => {
                              setHoveredIndicator({
                                name: ma.name,
                                description: getIndicatorTooltipText(ma.name, ma.value),
                                x: e.clientX,
                                y: e.clientY
                              });
                            }}
                            onMouseLeave={() => setHoveredIndicator(null)}
                            className="text-zinc-650 hover:text-emerald-400 transition-colors p-1"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pivot Points Table */}
              <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl flex flex-col lg:col-span-2">
                <h3 className="text-sm font-mono text-zinc-350 uppercase tracking-wider border-b border-zinc-905 pb-3 mb-4 font-bold">
                  Pivot Points Support & Resistance
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono text-left whitespace-nowrap min-w-[500px]">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-900 pb-1.5">
                        <th className="pb-2.5 font-normal">Pivot</th>
                        <th className="text-right pb-2.5 font-normal">Classic</th>
                        <th className="text-right pb-2.5 font-normal">Fibonacci</th>
                        <th className="text-right pb-2.5 font-normal">Camarilla</th>
                        <th className="text-right pb-2.5 font-normal">Woodie</th>
                        <th className="text-right pb-2.5 font-normal">DM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {/* R3 Row */}
                      <tr className="hover:bg-zinc-900/10">
                        <td className="py-3 font-semibold text-emerald-400">R3</td>
                        <td className="py-3 text-right text-emerald-500/70">{getPivotValue("Classic", "r3")}</td>
                        <td className="py-3 text-right text-emerald-500/70">{getPivotValue("Fibonacci", "r3")}</td>
                        <td className="py-3 text-right text-emerald-500/70">{getPivotValue("Camarilla", "r3")}</td>
                        <td className="py-3 text-right text-emerald-500/70">{getPivotValue("Woodie", "r3")}</td>
                        <td className="py-3 text-right text-emerald-500/70">{getPivotValue("Demark", "r3")}</td>
                      </tr>
                      {/* R2 Row */}
                      <tr className="hover:bg-zinc-900/10">
                        <td className="py-3 font-semibold text-emerald-400">R2</td>
                        <td className="py-3 text-right text-emerald-500/70">{getPivotValue("Classic", "r2")}</td>
                        <td className="py-3 text-right text-emerald-500/70">{getPivotValue("Fibonacci", "r2")}</td>
                        <td className="py-3 text-right text-emerald-500/70">{getPivotValue("Camarilla", "r2")}</td>
                        <td className="py-3 text-right text-emerald-500/70">{getPivotValue("Woodie", "r2")}</td>
                        <td className="py-3 text-right text-emerald-500/70">{getPivotValue("Demark", "r2")}</td>
                      </tr>
                      {/* R1 Row */}
                      <tr className="hover:bg-zinc-900/10">
                        <td className="py-3 font-semibold text-emerald-450">R1</td>
                        <td className="py-3 text-right text-emerald-450">{getPivotValue("Classic", "r1")}</td>
                        <td className="py-3 text-right text-emerald-450">{getPivotValue("Fibonacci", "r1")}</td>
                        <td className="py-3 text-right text-emerald-450">{getPivotValue("Camarilla", "r1")}</td>
                        <td className="py-3 text-right text-emerald-450">{getPivotValue("Woodie", "r1")}</td>
                        <td className="py-3 text-right text-emerald-450">{getPivotValue("Demark", "r1")}</td>
                      </tr>
                      {/* P Row */}
                      <tr className="hover:bg-zinc-900/10">
                        <td className="py-3 font-semibold text-white">P</td>
                        <td className="py-3 text-right text-white">{getPivotValue("Classic", "pivot")}</td>
                        <td className="py-3 text-right text-white">{getPivotValue("Fibonacci", "pivot")}</td>
                        <td className="py-3 text-right text-white">{getPivotValue("Camarilla", "pivot")}</td>
                        <td className="py-3 text-right text-white">{getPivotValue("Woodie", "pivot")}</td>
                        <td className="py-3 text-right text-white">{getPivotValue("Demark", "pivot")}</td>
                      </tr>
                      {/* S1 Row */}
                      <tr className="hover:bg-zinc-900/10">
                        <td className="py-3 font-semibold text-rose-450">S1</td>
                        <td className="py-3 text-right text-rose-450">{getPivotValue("Classic", "s1")}</td>
                        <td className="py-3 text-right text-rose-450">{getPivotValue("Fibonacci", "s1")}</td>
                        <td className="py-3 text-right text-rose-450">{getPivotValue("Camarilla", "s1")}</td>
                        <td className="py-3 text-right text-rose-450">{getPivotValue("Woodie", "s1")}</td>
                        <td className="py-3 text-right text-rose-450">{getPivotValue("Demark", "s1")}</td>
                      </tr>
                      {/* S2 Row */}
                      <tr className="hover:bg-zinc-900/10">
                        <td className="py-3 font-semibold text-rose-500/70">S2</td>
                        <td className="py-3 text-right text-rose-500/70">{getPivotValue("Classic", "s2")}</td>
                        <td className="py-3 text-right text-rose-500/70">{getPivotValue("Fibonacci", "s2")}</td>
                        <td className="py-3 text-right text-rose-500/70">{getPivotValue("Camarilla", "s2")}</td>
                        <td className="py-3 text-right text-rose-500/70">{getPivotValue("Woodie", "s2")}</td>
                        <td className="py-3 text-right text-rose-500/70">{getPivotValue("Demark", "s2")}</td>
                      </tr>
                      {/* S3 Row */}
                      <tr className="hover:bg-zinc-900/10">
                        <td className="py-3 font-semibold text-rose-500/70">S3</td>
                        <td className="py-3 text-right text-rose-500/70">{getPivotValue("Classic", "s3")}</td>
                        <td className="py-3 text-right text-rose-500/70">{getPivotValue("Fibonacci", "s3")}</td>
                        <td className="py-3 text-right text-rose-500/70">{getPivotValue("Camarilla", "s3")}</td>
                        <td className="py-3 text-right text-rose-500/70">{getPivotValue("Woodie", "s3")}</td>
                        <td className="py-3 text-right text-rose-500/70">{getPivotValue("Demark", "s3")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* KSEI Holdings Table */}
              <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl flex flex-col lg:col-span-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-905 pb-3 mb-4 gap-2">
                  <h3 className="text-sm font-mono text-zinc-350 uppercase tracking-wider font-bold">
                    Kepemilikan Efek KSEI (Lokal vs Asing)
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">
                    * Arahkan kursor pada kode kolom untuk melihat detail tipe investor
                  </span>
                </div>
                {symbolDetail?.kseiHistory && symbolDetail.kseiHistory.length > 0 ? (
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-xs font-mono text-left whitespace-nowrap">
                      <thead>
                        <tr className="text-zinc-500 border-b border-zinc-900 pb-1.5">
                          <th className="pb-2.5 font-normal px-2 pl-0">Date</th>
                          <th className="pb-2.5 font-normal text-right px-2" title="Outstanding Shares (Jumlah Saham Beredar)">Total Shares</th>
                          <th className="pb-2.5 font-normal text-right px-2" title="Harga Penutupan Pasar (Price)">Price</th>
                          <th className="pb-2.5 font-normal text-center px-4 w-[160px]"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Perbandingan Kepemilikan Investor Lokal (Domestik) vs Asing (Foreign)">L/F Ratio</span></th>
                          <th className="pb-2.5 font-normal text-center px-4 w-[160px]"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Perbandingan Kepemilikan Investor Ritel Perorangan (ID) vs Lembaga/Institusi">Retail/Inst</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Lokal - Retail Individual (Ritel Perorangan)">L-ID</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Lokal - Mutual Fund (Reksadana)">L-MF</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Lokal - Corporate (Korporasi/Perusahaan)">L-CP</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Lokal - Pension Fund (Dana Pensiun)">L-PF</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Lokal - Financial Institution / Investment Bank">L-IB</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Lokal - Insurance (Asuransi)">L-IS</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Lokal - Securities Company (Perusahaan Sekuritas)">L-SC</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Lokal - Foundation (Yayasan)">L-FD</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Lokal - Others (Lain-lain)">L-OT</span></th>
                          <th className="pb-2.5 font-bold text-right px-2 text-emerald-450" title="Total Saham Dimiliki Pihak Domestik/Lokal">L-Total</th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Asing - Retail Individual (Ritel Perorangan)">F-ID</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Asing - Mutual Fund (Reksadana)">F-MF</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Asing - Corporate (Korporasi/Perusahaan)">F-CP</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Asing - Pension Fund (Dana Pensiun)">F-PF</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Asing - Financial Institution / Investment Bank">F-IB</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Asing - Insurance (Asuransi)">F-IS</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Asing - Securities Company (Perusahaan Sekuritas)">F-SC</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Asing - Foundation (Yayasan)">F-FD</span></th>
                          <th className="pb-2.5 font-normal text-right px-2"><span className="cursor-help border-b border-dashed border-zinc-700/60 pb-0.5" title="Asing - Others (Lain-lain)">F-OT</span></th>
                          <th className="pb-2.5 font-bold text-right px-2 pr-0 text-indigo-400" title="Total Saham Dimiliki Pihak Asing">F-Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {symbolDetail.kseiHistory.map((h: any) => {
                          const dateObj = new Date(h.snapshot_date);
                          const formattedDate = dateObj.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
                          const total = h.local_total + h.foreign_total;
                          const localPct = total > 0 ? (h.local_total / total) * 100 : 0;
                          const foreignPct = total > 0 ? (h.foreign_total / total) * 100 : 0;

                          const retailTotal = h.local_id + h.foreign_id;
                          const retailPct = total > 0 ? (retailTotal / total) * 100 : 0;
                          const instPct = 100 - retailPct;

                          return (
                            <tr key={h.id} className="hover:bg-zinc-900/10 transition-colors">
                              <td className="py-3 px-2 pl-0 font-semibold text-zinc-300">{formattedDate}</td>
                              <td className="py-3 px-2 text-right text-zinc-200 tabular-nums">{h.sec_num.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-200 tabular-nums">{h.price ? h.price.toLocaleString("id-ID") : "—"}</td>
                              {/* Ratios */}
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center gap-1.5 justify-center">
                                  <span className="text-[10px] text-emerald-450 font-bold w-8 text-right">{localPct.toFixed(0)}%</span>
                                  <div className="w-12 h-1.5 rounded bg-zinc-800 overflow-hidden flex">
                                    <div className="h-full bg-emerald-500" style={{ width: `${localPct}%` }} title={`Local: ${localPct.toFixed(1)}%`} />
                                    <div className="h-full bg-indigo-500" style={{ width: `${foreignPct}%` }} title={`Foreign: ${foreignPct.toFixed(1)}%`} />
                                  </div>
                                  <span className="text-[10px] text-indigo-400 font-bold w-8 text-left">{foreignPct.toFixed(0)}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center gap-1.5 justify-center">
                                  <span className="text-[10px] text-zinc-350 font-bold w-8 text-right">{retailPct.toFixed(0)}%</span>
                                  <div className="w-12 h-1.5 rounded bg-zinc-800 overflow-hidden flex">
                                    <div className="h-full bg-zinc-400" style={{ width: `${retailPct}%` }} title={`Retail: ${retailPct.toFixed(1)}%`} />
                                    <div className="h-full bg-zinc-600" style={{ width: `${instPct}%` }} title={`Institutional: ${instPct.toFixed(1)}%`} />
                                  </div>
                                  <span className="text-[10px] text-zinc-550 font-bold w-8 text-left">{instPct.toFixed(0)}%</span>
                                </div>
                              </td>
                              {/* Local */}
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.local_id.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.local_mf.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.local_cp.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.local_pf.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.local_ib.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.local_is.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.local_sc.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.local_fd.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.local_ot.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-emerald-450 font-bold tabular-nums">{h.local_total.toLocaleString("id-ID")}</td>
                              {/* Foreign */}
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.foreign_id.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.foreign_mf.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.foreign_cp.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.foreign_pf.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.foreign_ib.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.foreign_is.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.foreign_sc.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.foreign_fd.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-zinc-400 tabular-nums">{h.foreign_ot.toLocaleString("id-ID")}</td>
                              <td className="py-3 px-2 text-right text-indigo-400 font-bold pr-0 tabular-nums">{h.foreign_total.toLocaleString("id-ID")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-zinc-500 text-xs">
                    No KSEI holding composition history records found for {ticker}
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}
