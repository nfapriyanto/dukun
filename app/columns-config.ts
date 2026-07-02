import { TabConfig } from "./types";

export interface ColumnMeta {
  label: string;
  type: "currency" | "percent" | "compact" | "number" | "string" | "rating" | "date";
  align?: "left" | "right" | "center";
}

export const TABS: TabConfig[] = [
  {
    id: "overview",
    label: "Overview",
    columns: [
      "ticker-view",
      "close",
      "change",
      "volume",
      "relative_volume_10d_calc",
      "market_cap_basic",
      "price_earnings_ttm",
      "earnings_per_share_diluted_ttm",
      "dividends_yield_current",
      "sector",
      "AnalystRating"
    ]
  },
  {
    id: "performance",
    label: "Performance",
    columns: [
      "ticker-view",
      "close",
      "change",
      "Perf.W",
      "Perf.1M",
      "Perf.3M",
      "Perf.6M",
      "Perf.YTD",
      "Perf.Y",
      "Perf.5Y",
      "Volatility.W",
      "Volatility.M"
    ]
  },
  {
    id: "technicals",
    label: "Technicals",
    columns: [
      "ticker-view",
      "close",
      "change",
      "TechRating_1D",
      "MARating_1D",
      "OsRating_1D",
      "RSI",
      "Mom",
      "AO",
      "CCI20",
      "Stoch.K",
      "Stoch.D"
    ]
  },
  {
    id: "extended-hours",
    label: "Extended Hours",
    columns: [
      "ticker-view",
      "close",
      "change",
      "premarket_close",
      "premarket_change",
      "premarket_gap",
      "premarket_volume",
      "postmarket_close",
      "postmarket_change",
      "postmarket_volume"
    ]
  },
  {
    id: "forecast",
    label: "Forecast",
    columns: [
      "ticker-view",
      "close",
      "market_cap_basic",
      "earnings_per_share_forecast_next_fy",
      "revenue_forecast_next_fy",
      "net_income_estimate_ntm",
      "free_cash_flow_estimate_ntm",
      "price_earnings_fwd",
      "price_sales_fwd",
      "total_debt_estimate_fy"
    ]
  },
  {
    id: "valuation",
    label: "Valuation",
    columns: [
      "ticker-view",
      "close",
      "market_cap_basic",
      "price_earnings_ttm",
      "price_earnings_growth_ttm",
      "price_sales_current",
      "price_book_fq",
      "price_to_cash_f_operating_activities_ttm",
      "price_free_cash_flow_ttm",
      "enterprise_value_current",
      "enterprise_value_to_revenue_ttm",
      "enterprise_value_ebitda_ttm"
    ]
  },
  {
    id: "dividends",
    label: "Dividends",
    columns: [
      "ticker-view",
      "close",
      "dps_common_stock_prim_issue_fy",
      "dps_common_stock_prim_issue_fq",
      "dividends_yield_current",
      "dividends_yield",
      "dividend_payout_ratio_ttm",
      "dps_common_stock_prim_issue_yoy_growth_fy",
      "continuous_dividend_payout",
      "continuous_dividend_growth"
    ]
  },
  {
    id: "profitability",
    label: "Profitability",
    columns: [
      "ticker-view",
      "close",
      "gross_margin_ttm",
      "operating_margin_ttm",
      "pre_tax_margin_ttm",
      "net_margin_ttm",
      "free_cash_flow_margin_ttm",
      "return_on_assets_fq",
      "return_on_equity_fq",
      "return_on_invested_capital_fq"
    ]
  },
  {
    id: "income-statement",
    label: "Income Statement",
    columns: [
      "ticker-view",
      "close",
      "fiscal_period_current",
      "fiscal_period_end_current",
      "total_revenue_ttm",
      "total_revenue_yoy_growth_ttm",
      "gross_profit_ttm",
      "oper_income_ttm",
      "net_income_ttm",
      "ebitda_ttm",
      "earnings_per_share_diluted_ttm"
    ]
  },
  {
    id: "balance-sheet",
    label: "Balance Sheet",
    columns: [
      "ticker-view",
      "close",
      "total_assets_fq",
      "total_current_assets_fq",
      "cash_n_short_term_invest_fq",
      "total_liabilities_fq",
      "total_debt_fq",
      "net_debt_fq",
      "total_equity_fq",
      "current_ratio_fq",
      "quick_ratio_fq",
      "debt_to_equity_fq"
    ]
  },
  {
    id: "cash-flow",
    label: "Cash Flow",
    columns: [
      "ticker-view",
      "close",
      "cash_f_operating_activities_ttm",
      "cash_f_investing_activities_ttm",
      "cash_f_financing_activities_ttm",
      "free_cash_flow_ttm",
      "neg_capital_expenditures_ttm"
    ]
  },
  {
    id: "per-share",
    label: "Per Share",
    columns: [
      "ticker-view",
      "close",
      "revenue_per_share_ttm",
      "earnings_per_share_basic_ttm",
      "earnings_per_share_diluted_ttm",
      "operating_cash_flow_per_share_ttm",
      "free_cash_flow_per_share_ttm",
      "book_value_per_share_fq",
      "total_debt_per_share_fq",
      "cash_per_share_fq"
    ]
  }
];

export const COLUMN_METADATA: Record<string, ColumnMeta> = {
  "ticker-view": { label: "Symbol", type: "string", align: "left" },
  "close": { label: "Last Price", type: "currency", align: "right" },
  "change": { label: "Chg %", type: "percent", align: "right" },
  "volume": { label: "Volume", type: "number", align: "right" },
  "relative_volume_10d_calc": { label: "Rel Volume (10d)", type: "number", align: "right" },
  "market_cap_basic": { label: "Market Cap", type: "compact", align: "right" },
  "price_earnings_ttm": { label: "P/E (TTM)", type: "number", align: "right" },
  "earnings_per_share_diluted_ttm": { label: "EPS (TTM)", type: "currency", align: "right" },
  "earnings_per_share_diluted_yoy_growth_ttm": { label: "EPS Growth YoY %", type: "percent", align: "right" },
  "dividends_yield_current": { label: "Div Yield %", type: "percent", align: "right" },
  "sector": { label: "Sector", type: "string", align: "left" },
  "AnalystRating": { label: "Analyst Rating", type: "rating", align: "center" },

  // Performance
  "Perf.W": { label: "Perf 1W %", type: "percent", align: "right" },
  "Perf.1M": { label: "Perf 1M %", type: "percent", align: "right" },
  "Perf.3M": { label: "Perf 3M %", type: "percent", align: "right" },
  "Perf.6M": { label: "Perf 6M %", type: "percent", align: "right" },
  "Perf.YTD": { label: "Perf YTD %", type: "percent", align: "right" },
  "Perf.Y": { label: "Perf 1Y %", type: "percent", align: "right" },
  "Perf.5Y": { label: "Perf 5Y %", type: "percent", align: "right" },
  "Perf.10Y": { label: "Perf 10Y %", type: "percent", align: "right" },
  "Perf.All": { label: "Perf All %", type: "percent", align: "right" },
  "Volatility.W": { label: "Volatility 1W %", type: "percent", align: "right" },
  "Volatility.M": { label: "Volatility 1M %", type: "percent", align: "right" },

  // Technicals
  "TechRating_1D": { label: "Tech Rating", type: "rating", align: "center" },
  "MARating_1D": { label: "MA Rating", type: "rating", align: "center" },
  "OsRating_1D": { label: "Osc Rating", type: "rating", align: "center" },
  "RSI": { label: "RSI (14)", type: "number", align: "right" },
  "Mom": { label: "Momentum", type: "number", align: "right" },
  "AO": { label: "Awesome Osc", type: "number", align: "right" },
  "CCI20": { label: "CCI (20)", type: "number", align: "right" },
  "Stoch.K": { label: "Stoch %K", type: "number", align: "right" },
  "Stoch.D": { label: "Stoch %D", type: "number", align: "right" },

  // Extended Hours
  "premarket_close": { label: "Pre Market Close", type: "currency", align: "right" },
  "premarket_change": { label: "Pre Market Chg %", type: "percent", align: "right" },
  "premarket_gap": { label: "Pre Market Gap %", type: "percent", align: "right" },
  "premarket_volume": { label: "Pre Market Vol", type: "number", align: "right" },
  "postmarket_close": { label: "Post Market Close", type: "currency", align: "right" },
  "postmarket_change": { label: "Post Market Chg %", type: "percent", align: "right" },
  "postmarket_volume": { label: "Post Market Vol", type: "number", align: "right" },

  // Forecast
  "earnings_per_share_forecast_next_fy": { label: "Est EPS Next FY", type: "currency", align: "right" },
  "revenue_forecast_next_fy": { label: "Est Rev Next FY", type: "compact", align: "right" },
  "net_income_estimate_ntm": { label: "Est Net Income NTM", type: "compact", align: "right" },
  "free_cash_flow_estimate_ntm": { label: "Est FCF NTM", type: "compact", align: "right" },
  "price_earnings_fwd": { label: "Forward P/E", type: "number", align: "right" },
  "price_sales_fwd": { label: "Forward P/S", type: "number", align: "right" },
  "total_debt_estimate_fy": { label: "Est Debt FY", type: "compact", align: "right" },

  // Valuation
  "price_earnings_growth_ttm": { label: "PEG Ratio", type: "number", align: "right" },
  "price_sales_current": { label: "Price / Sales", type: "number", align: "right" },
  "price_book_fq": { label: "Price / Book", type: "number", align: "right" },
  "price_to_cash_f_operating_activities_ttm": { label: "Price / Cash Flow", type: "number", align: "right" },
  "price_free_cash_flow_ttm": { label: "Price / FCF", type: "number", align: "right" },
  "enterprise_value_current": { label: "Enterprise Value", type: "compact", align: "right" },
  "enterprise_value_to_revenue_ttm": { label: "EV / Revenue", type: "number", align: "right" },
  "enterprise_value_ebitda_ttm": { label: "EV / EBITDA", type: "number", align: "right" },

  // Dividends
  "dps_common_stock_prim_issue_fy": { label: "DPS (FY)", type: "currency", align: "right" },
  "dps_common_stock_prim_issue_fq": { label: "DPS (FQ)", type: "currency", align: "right" },
  "dividends_yield": { label: "Dividend Yield", type: "percent", align: "right" },
  "dividend_payout_ratio_ttm": { label: "Payout Ratio %", type: "percent", align: "right" },
  "dps_common_stock_prim_issue_yoy_growth_fy": { label: "DPS Growth YoY %", type: "percent", align: "right" },
  "continuous_dividend_payout": { label: "Div Years Payout", type: "number", align: "right" },
  "continuous_dividend_growth": { label: "Div Years Growth", type: "number", align: "right" },

  // Profitability
  "gross_margin_ttm": { label: "Gross Margin %", type: "percent", align: "right" },
  "operating_margin_ttm": { label: "Operating Margin %", type: "percent", align: "right" },
  "pre_tax_margin_ttm": { label: "Pre-tax Margin %", type: "percent", align: "right" },
  "net_margin_ttm": { label: "Net Margin %", type: "percent", align: "right" },
  "free_cash_flow_margin_ttm": { label: "FCF Margin %", type: "percent", align: "right" },
  "return_on_assets_fq": { label: "ROA %", type: "percent", align: "right" },
  "return_on_equity_fq": { label: "ROE %", type: "percent", align: "right" },
  "return_on_invested_capital_fq": { label: "ROIC %", type: "percent", align: "right" },

  // Income Statement
  "fiscal_period_current": { label: "Period", type: "string", align: "center" },
  "fiscal_period_end_current": { label: "Period End", type: "date", align: "center" },
  "total_revenue_ttm": { label: "Revenue", type: "compact", align: "right" },
  "total_revenue_yoy_growth_ttm": { label: "Rev Growth YoY %", type: "percent", align: "right" },
  "gross_profit_ttm": { label: "Gross Profit", type: "compact", align: "right" },
  "oper_income_ttm": { label: "Operating Income", type: "compact", align: "right" },
  "net_income_ttm": { label: "Net Income", type: "compact", align: "right" },
  "ebitda_ttm": { label: "EBITDA", type: "compact", align: "right" },

  // Balance Sheet
  "total_assets_fq": { label: "Total Assets", type: "compact", align: "right" },
  "total_current_assets_fq": { label: "Current Assets", type: "compact", align: "right" },
  "cash_n_short_term_invest_fq": { label: "Cash & ST Invest", type: "compact", align: "right" },
  "total_liabilities_fq": { label: "Total Liabilities", type: "compact", align: "right" },
  "total_debt_fq": { label: "Total Debt", type: "compact", align: "right" },
  "net_debt_fq": { label: "Net Debt", type: "compact", align: "right" },
  "total_equity_fq": { label: "Total Equity", type: "compact", align: "right" },
  "current_ratio_fq": { label: "Current Ratio", type: "number", align: "right" },
  "quick_ratio_fq": { label: "Quick Ratio", type: "number", align: "right" },
  "debt_to_equity_fq": { label: "Debt to Equity", type: "number", align: "right" },

  // Cash Flow
  "cash_f_operating_activities_ttm": { label: "Cash from Ops", type: "compact", align: "right" },
  "cash_f_investing_activities_ttm": { label: "Cash from Investing", type: "compact", align: "right" },
  "cash_f_financing_activities_ttm": { label: "Cash from Financing", type: "compact", align: "right" },
  "free_cash_flow_ttm": { label: "Free Cash Flow", type: "compact", align: "right" },
  "neg_capital_expenditures_ttm": { label: "CapEx", type: "compact", align: "right" },

  // Per Share
  "revenue_per_share_ttm": { label: "Rev Per Share", type: "currency", align: "right" },
  "earnings_per_share_basic_ttm": { label: "Basic EPS", type: "currency", align: "right" },
  "operating_cash_flow_per_share_ttm": { label: "CF Per Share", type: "currency", align: "right" },
  "free_cash_flow_per_share_ttm": { label: "FCF Per Share", type: "currency", align: "right" },
  "book_value_per_share_fq": { label: "Book Value Per Share", type: "currency", align: "right" },
  "total_debt_per_share_fq": { label: "Debt Per Share", type: "currency", align: "right" },
  "cash_per_share_fq": { label: "Cash Per Share", type: "currency", align: "right" }
};

export function formatValue(value: any, meta: ColumnMeta): string {
  if (value === undefined || value === null || (typeof value === "number" && isNaN(value))) {
    return "—";
  }

  switch (meta.type) {
    case "currency":
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);

    case "percent":
      const val = typeof value === "string" ? parseFloat(value) : value;
      const sign = val > 0 ? "+" : "";
      return `${sign}${val.toFixed(2)}%`;

    case "compact":
      return formatCompactNumber(value);

    case "number":
      return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value);

    case "rating":
      if (typeof value === "number") {
        if (value > 0.5) return "Strong Buy";
        if (value > 0.1) return "Buy";
        if (value < -0.5) return "Strong Sell";
        if (value < -0.1) return "Sell";
        return "Neutral";
      }
      return String(value);

    case "date":
      try {
        return new Date(value).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      } catch (e) {
        return String(value);
      }

    default:
      return String(value);
  }
}

function formatCompactNumber(num: number): string {
  if (num === null || num === undefined) return "—";
  const absNum = Math.abs(num);
  if (absNum >= 1e12) {
    return `${(num / 1e12).toFixed(2)} T`;
  }
  if (absNum >= 1e9) {
    return `${(num / 1e9).toFixed(2)} B`;
  }
  if (absNum >= 1e6) {
    return `${(num / 1e6).toFixed(2)} M`;
  }
  return num.toLocaleString("id-ID");
}
