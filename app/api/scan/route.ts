import { NextResponse } from "next/server";
import { TABS } from "../../columns-config";

// Column lists matching what TradingView expects for the scan API
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      category = "overview",
      search = "",
      sortField = "market_cap_basic",
      sortOrder = "desc",
      sector = "",
      rangeStart = 0,
      rangeEnd = 100,
      snapshotDate = "latest"
    } = body;

    const columns = SCAN_COLUMNS_MAPPING[category] || SCAN_COLUMNS_MAPPING.overview;

    // Filters for TradingView scan query
    const filters: any[] = [
      {
        left: "is_primary",
        operation: "equal",
        right: true
      }
    ];

    // Handle sector filter
    if (sector) {
      filters.push({
        left: "sector",
        operation: "equal",
        right: sector
      });
    }

    // TradingView request payload
    const payload = {
      columns,
      filter: filters,
      ignore_unknown_fields: false,
      options: {
        lang: "en"
      },
      range: [rangeStart, rangeEnd],
      sort: {
        sortBy: sortField,
        sortOrder: sortOrder
      },
      markets: ["indonesia"],
      filter2: {
        operator: "and",
        operands: [
          {
            operation: {
              operator: "or",
              operands: [
                {
                  operation: {
                    operator: "and",
                    operands: [
                      { expression: { left: "type", operation: "equal", right: "stock" } },
                      { expression: { left: "typespecs", operation: "has", right: ["common"] } }
                    ]
                  }
                },
                {
                  operation: {
                    operator: "and",
                    operands: [
                      { expression: { left: "type", operation: "equal", right: "stock" } },
                      { expression: { left: "typespecs", operation: "has", right: ["preferred"] } }
                    ]
                  }
                },
                {
                  operation: {
                    operator: "and",
                    operands: [
                      { expression: { left: "type", operation: "equal", right: "dr" } }
                    ]
                  }
                },
                {
                  operation: {
                    operator: "and",
                    operands: [
                      { expression: { left: "type", operation: "equal", right: "fund" } },
                      { expression: { left: "typespecs", operation: "has_none_of", right: ["etf", "mutual"] } }
                    ]
                  }
                }
              ]
            }
          },
          {
            expression: {
              left: "typespecs",
              operation: "has_none_of",
              right: ["pre-ipo"]
            }
          }
        ]
      }
    };

    // If search text is provided, add to operands
    if (search) {
      const searchLower = search.toLowerCase();
      // Add text search filter on name or description or ticker
      (payload.filter2.operands as any).push({
        operation: {
          operator: "or",
          operands: [
            { expression: { left: "name", operation: "match", right: searchLower } },
            { expression: { left: "description", operation: "match", right: searchLower } }
          ]
        }
      });
    }

    const response = await fetch("https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify(payload),
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`TradingView Scan API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Map response array back to objects based on columns sequence
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

    return NextResponse.json({
      totalCount: data.totalCount,
      stocks
    });
  } catch (error: any) {
    console.error("Scan API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
