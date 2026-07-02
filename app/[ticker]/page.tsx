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

  // We convert TICKER back to IDX:TICKER for the TradingView scanner API
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

  const renderGauge = (val: number, title: string) => {
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

          <div className="w-[120px]" /> {/* Spacer */}
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
              <div>
                <h2 className="text-3xl font-bold text-zinc-100">{ticker}</h2>
                <p className="text-xs text-zinc-500 mt-1">PT Bursa Efek Indonesia (IDX) Stock Technicals Analysis Summary</p>
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
              {renderGauge(symbolDetail?.recommendation.other || 0, "Oscillators Summary")}
              {renderGauge(symbolDetail?.recommendation.all || 0, "Aggregate Summary")}
              {renderGauge(symbolDetail?.recommendation.ma || 0, "Moving Averages Summary")}
            </div>

            {/* Timeframe Toggles */}
            <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-4 overflow-x-auto">
              <span className="text-xs font-mono text-zinc-500 mr-2 uppercase tracking-wide">Timeframe:</span>
              {(["1m", "5m", "15m", "30m", "1h", "2h", "4h", "1D", "1W", "1M"] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setDetailTimeframe(tf)}
                  className={`px-3 py-1.5 text-xs font-bold font-mono rounded-lg border transition-all ${
                    detailTimeframe === tf
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
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            osc.action === "Buy" ? "bg-emerald-500/10 text-emerald-400" :
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
                            className="text-zinc-600 hover:text-emerald-400 transition-colors p-1"
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
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ma.action === "Buy" ? "bg-emerald-500/10 text-emerald-400" :
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
                  <table className="w-full text-xs font-mono text-left whitespace-nowrap min-w-[600px]">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-900 pb-1.5">
                        <th className="pb-2.5 font-normal">Pivot Type</th>
                        <th className="text-right pb-2.5 font-normal">S3</th>
                        <th className="text-right pb-2.5 font-normal">S2</th>
                        <th className="text-right pb-2.5 font-normal">S1</th>
                        <th className="text-right pb-2.5 font-normal font-bold text-zinc-400">Pivot</th>
                        <th className="text-right pb-2.5 font-normal">R1</th>
                        <th className="text-right pb-2.5 font-normal">R2</th>
                        <th className="text-right pb-2.5 font-normal">R3</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {symbolDetail?.pivotPoints.map((p) => (
                        <tr key={p.pivotType} className="hover:bg-zinc-900/10">
                          <td className="py-3 font-semibold text-zinc-300">{p.pivotType}</td>
                          <td className="py-3 text-right text-rose-500/70">{p.s3?.toLocaleString("id-ID") || "—"}</td>
                          <td className="py-3 text-right text-rose-500/70">{p.s2?.toLocaleString("id-ID") || "—"}</td>
                          <td className="py-3 text-right text-rose-450">{p.s1?.toLocaleString("id-ID") || "—"}</td>
                          <td className="py-3 text-right text-white font-bold bg-zinc-900/40 px-2 rounded">{p.pivot?.toLocaleString("id-ID") || "—"}</td>
                          <td className="py-3 text-right text-emerald-450">{p.r1?.toLocaleString("id-ID") || "—"}</td>
                          <td className="py-3 text-right text-emerald-500/70">{p.r2?.toLocaleString("id-ID") || "—"}</td>
                          <td className="py-3 text-right text-emerald-500/70">{p.r3?.toLocaleString("id-ID") || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}
