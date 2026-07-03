import { NextResponse } from "next/server";
import * as db from "@/lib/db";

const SCAN_COLUMNS_MAPPING: Record<string, string[]> = {
  overview: [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "change", "volume", "relative_volume_10d_calc", "market_cap_basic", "fundamental_currency_code",
    "price_earnings_ttm", "earnings_per_share_diluted_ttm", "earnings_per_share_diluted_yoy_growth_ttm",
    "dividends_yield_current", "sector.tr", "market", "sector", "AnalystRating", "AnalystRating.tr"
  ],
  performance: [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "change", "Perf.W", "Perf.1M", "Perf.3M", "Perf.6M", "Perf.YTD", "Perf.Y", "Perf.5Y", "Perf.10Y", "Perf.All",
    "Volatility.W", "Volatility.M"
  ],
  technicals: [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "change", "TechRating_1D", "TechRating_1D.tr", "MARating_1D", "MARating_1D.tr", "OsRating_1D", "OsRating_1D.tr",
    "RSI", "Mom", "AO", "CCI20", "Stoch.K", "Stoch.D", "candlestick_patterns_1D"
  ],
  "extended-hours": [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "change", "premarket_close", "premarket_change", "premarket_gap", "premarket_volume",
    "gap", "volume", "volume_change", "postmarket_close", "postmarket_change", "postmarket_volume"
  ],
  forecast: [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "market_cap_basic", "fundamental_currency_code", "earnings_per_share_forecast_next_fy", "revenue_forecast_next_fy",
    "net_income_estimate_ntm", "free_cash_flow_estimate_ntm", "price_earnings_fwd", "enterprise_value_ebitda_fwd",
    "price_sales_fwd", "total_debt_estimate_fy", "book_value_per_share_estimate_fy", "dps_estimate_ntm"
  ],
  valuation: [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "market_cap_basic", "fundamental_currency_code", "Perf.1Y.MarketCap", "price_earnings_ttm", "price_earnings_growth_ttm",
    "price_sales_current", "price_book_fq", "price_to_cash_f_operating_activities_ttm", "price_free_cash_flow_ttm",
    "price_to_cash_ratio", "enterprise_value_current", "enterprise_value_to_revenue_ttm", "enterprise_value_to_ebit_ttm",
    "enterprise_value_ebitda_ttm"
  ],
  dividends: [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "dps_common_stock_prim_issue_fy", "fundamental_currency_code", "dps_common_stock_prim_issue_fq", "dividends_yield_current",
    "dividends_yield", "dividend_payout_ratio_ttm", "dps_common_stock_prim_issue_yoy_growth_fy",
    "continuous_dividend_payout", "continuous_dividend_growth"
  ],
  profitability: [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "gross_margin_ttm", "operating_margin_ttm", "pre_tax_margin_ttm", "net_margin_ttm", "free_cash_flow_margin_ttm",
    "return_on_assets_fq", "return_on_equity_fq", "return_on_invested_capital_fq", "research_and_dev_ratio_ttm",
    "sell_gen_admin_exp_other_ratio_ttm"
  ],
  "income-statement": [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "fiscal_period_current", "fiscal_period_end_current", "total_revenue_ttm", "fundamental_currency_code",
    "total_revenue_yoy_growth_ttm", "gross_profit_ttm", "oper_income_ttm", "net_income_ttm", "ebitda_ttm",
    "earnings_per_share_diluted_ttm", "earnings_per_share_diluted_yoy_growth_ttm"
  ],
  "balance-sheet": [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "fiscal_period_current", "fiscal_period_end_current", "total_assets_fq", "fundamental_currency_code",
    "total_current_assets_fq", "cash_n_short_term_invest_fq", "total_liabilities_fq", "total_debt_fq", "net_debt_fq",
    "total_equity_fq", "current_ratio_fq", "quick_ratio_fq", "debt_to_equity_fq", "cash_n_short_term_invest_to_total_debt_fq"
  ],
  "cash-flow": [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "fiscal_period_current", "fiscal_period_end_current", "cash_f_operating_activities_ttm", "fundamental_currency_code",
    "cash_f_investing_activities_ttm", "cash_f_financing_activities_ttm", "free_cash_flow_ttm", "neg_capital_expenditures_ttm"
  ],
  "per-share": [
    "ticker-view", "close", "type", "typespecs", "pricescale", "minmov", "fractional", "minmove2", "currency",
    "revenue_per_share_ttm", "fundamental_currency_code", "earnings_per_share_basic_ttm", "earnings_per_share_diluted_ttm",
    "operating_cash_flow_per_share_ttm", "free_cash_flow_per_share_ttm", "ebit_per_share_ttm", "ebitda_per_share_ttm",
    "book_value_per_share_fq", "total_debt_per_share_fq", "cash_per_share_fq"
  ]
};

const ALL_UNIQUE_COLUMNS = [
  "ticker-view",
  ...Array.from(new Set(Object.values(SCAN_COLUMNS_MAPPING).flat().filter(c => c !== "ticker-view")))
];

function getRatingScore(rating: string | null | undefined): number {
  if (!rating) return 0;
  const cleaned = rating.replace(/[^a-zA-Z]/g, "").toLowerCase();
  if (cleaned === "strongbuy") return 2;
  if (cleaned === "buy") return 1;
  if (cleaned === "neutral" || cleaned === "norating") return 0;
  if (cleaned === "sell") return -1;
  if (cleaned === "strongsell") return -2;
  return 0;
}

// Background sync helper from TradingView to Local Postgres
async function fetchTradingViewAndUpsert(targetDate: string, category: string, columns: string[]): Promise<any[]> {
  const payload = {
    columns,
    filter: [{ left: "is_primary", operation: "equal", right: true }],
    ignore_unknown_fields: false,
    options: { lang: "en" },
    range: [0, 950],
    sort: { sortBy: "market_cap_basic", sortOrder: "desc" },
    symbols: { query: { types: ["stock"] }, uuid: "idx-stocks" }
  };

  const response = await fetch("https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`TradingView Scan API error: ${response.statusText}`);
  }

  const data = await response.json();
  const stocks = data.data.map((item: any) => {
    const mapped: Record<string, any> = {
      symbol: item.s,
      ticker: item.d[0]?.name || item.s.replace("IDX:", ""),
      name: item.d[0]?.description || item.d[0]?.name || item.s.replace("IDX:", ""),
      logoId: item.d[0]?.logoid || item.d[0]?.logo?.logoid || "",
    };

    columns.forEach((col, idx) => {
      if (col === "ticker-view") return;
      mapped[col] = item.d[idx];
    });

    return mapped;
  });

  // Write to Local PostgreSQL
  if (stocks.length > 0) {
    try {
      const stockMasterList = stocks.map((s: any) => ({
        symbol: s.symbol,
        ticker: s.ticker,
        name: s.name,
        logo_id: s.logoId,
        sector: s.sector || "",
        type: s.type || "stock",
        updated_at: new Date().toISOString()
      }));

      // Batch Upsert to Stocks
      const stockValues: any[] = [];
      const stockPlaceholders = stockMasterList.map((s: any, idx: number) => {
        const base = idx * 7;
        stockValues.push(s.symbol, s.ticker, s.name, s.logo_id, s.sector, s.type, s.updated_at);
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`;
      }).join(", ");

      await db.query(
        `INSERT INTO public.stocks (symbol, ticker, name, logo_id, sector, type, updated_at)
         VALUES ${stockPlaceholders}
         ON CONFLICT (symbol) DO UPDATE
         SET ticker = EXCLUDED.ticker, name = EXCLUDED.name, logo_id = EXCLUDED.logo_id, sector = EXCLUDED.sector, type = EXCLUDED.type, updated_at = EXCLUDED.updated_at`,
        stockValues
      );

      const snapshotItems = stocks.map((s: any) => {
        const dataCopy = { ...s };
        delete dataCopy.symbol;
        delete dataCopy.ticker;
        delete dataCopy.name;
        delete dataCopy.logoId;

        return {
          symbol: s.symbol,
          snapshot_date: targetDate,
          category,
          data: dataCopy,
          created_at: new Date().toISOString()
        };
      });

      // Batch Upsert to Stock Snapshots
      const snapValues: any[] = [];
      const snapPlaceholders = snapshotItems.map((snap: any, idx: number) => {
        const base = idx * 5;
        snapValues.push(snap.symbol, snap.snapshot_date, snap.category, JSON.stringify(snap.data), snap.created_at);
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
      }).join(", ");

      await db.query(
        `INSERT INTO public.stock_snapshots (symbol, snapshot_date, category, data, created_at)
         VALUES ${snapPlaceholders}
         ON CONFLICT (symbol, snapshot_date, category) DO UPDATE
         SET data = EXCLUDED.data, created_at = EXCLUDED.created_at`,
        snapValues
      );
    } catch (dbWriteErr) {
      console.error("Failed to save snapshots to PostgreSQL:", dbWriteErr);
    }
  }

  return stocks;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      category = "overview",
      snapshotDate = "latest",
      pageIndex = 0,
      pageSize = 25,
      sortBy = "market_cap_basic",
      sortOrder = "desc",
      search = "",
      selectedSector = ""
    } = body;

    const columns = ALL_UNIQUE_COLUMNS;
    const targetDate = snapshotDate === "latest" ? new Date().toISOString().split("T")[0] : snapshotDate;

    let stocks: any[] = [];
    let fetchedFromDb = false;

    // 1. Try to query from PostgreSQL database
    try {
      const result = await db.query(
        `SELECT ss.symbol, ss.snapshot_date, ss.data, ss.created_at,
                s.ticker, s.name, s.logo_id, s.sector
         FROM public.stock_snapshots ss
         LEFT JOIN public.stocks s ON ss.symbol = s.symbol
         WHERE ss.snapshot_date = $1 AND ss.category = $2`,
        [targetDate, category]
      );

      const dbData = result.rows;

      if (dbData && dbData.length > 0) {
        const firstRecord = dbData[0];
        const isToday = targetDate === new Date().toISOString().split("T")[0];
        
        if (!isToday) {
          stocks = dbData.map((row: any) => ({
            symbol: row.symbol,
            ticker: row.ticker || row.symbol.replace("IDX:", ""),
            name: row.name || row.symbol.replace("IDX:", ""),
            logoId: row.logo_id || "",
            sector: row.sector || "",
            ...row.data
          }));
          fetchedFromDb = true;
        } else {
          // Get current hour/min in Jakarta (WIB)
          const now = new Date();
          const formatter = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", hour12: false, hour: "numeric", minute: "numeric" });
          const parts = formatter.formatToParts(now);
          const currentWibHour = parseInt(parts.find(p => p.type === "hour")?.value || "0");
          const currentWibMin = parseInt(parts.find(p => p.type === "minute")?.value || "0");
          const currentWibTimeVal = currentWibHour * 100 + currentWibMin;

          // Get cache creation hour/min in Jakarta (WIB)
          const cacheTime = new Date(firstRecord.created_at);
          const cacheParts = formatter.formatToParts(cacheTime);
          const cacheWibHour = parseInt(cacheParts.find(p => p.type === "hour")?.value || "0");
          const cacheWibMin = parseInt(cacheParts.find(p => p.type === "minute")?.value || "0");
          const cacheWibTimeVal = cacheWibHour * 100 + cacheWibMin;

          // If it is now after 16:00 WIB, and the cache was created before 16:00 WIB, we force fetch/upsert
          const needsClosingUpdate = currentWibTimeVal >= 1600 && cacheWibTimeVal < 1600;

          // Serve cached data first
          stocks = dbData.map((row: any) => ({
            symbol: row.symbol,
            ticker: row.ticker || row.symbol.replace("IDX:", ""),
            name: row.name || row.symbol.replace("IDX:", ""),
            logoId: row.logo_id || "",
            sector: row.sector || "",
            ...row.data
          }));
          fetchedFromDb = true;

          // If we need the final 16:00 closing prices, trigger refresh in the background
          if (needsClosingUpdate) {
            console.log("Triggering 16:00 WIB closing cache refresh in background...");
            fetchTradingViewAndUpsert(targetDate, category, columns).catch(e => {
              console.error("Background cache refresh failed:", e);
            });
          }
        }
      }
    } catch (dbErr) {
      console.warn("PostgreSQL Fetch Error, falling back to direct TradingView fetch:", dbErr);
    }

    // 2. Fetch from TradingView directly if not found in DB
    if (!fetchedFromDb) {
      stocks = await fetchTradingViewAndUpsert(targetDate, category, columns);
    }

    // 3. Server-Side Filtering, Searching, and Sorting
    let processed = [...stocks];

    // Filter by Sector
    if (selectedSector) {
      processed = processed.filter(s => s.sector === selectedSector);
    }

    // Filter by Search Query
    if (search) {
      const q = search.toLowerCase();
      processed = processed.filter(s => 
        s.ticker.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(q)
      );
    }

    // Sort by Field
    const isRatingField = sortBy.includes("Rating");
    processed.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

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

    const totalCount = processed.length;

    // Slice Paginated Page
    const start = pageIndex * pageSize;
    const paginated = processed.slice(start, start + pageSize);

    return NextResponse.json({
      totalCount,
      stocks: paginated
    });
  } catch (error: any) {
    console.error("Scan API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
