export interface Stock {
  symbol: string;         // e.g. "IDX:BBCA"
  ticker: string;         // e.g. "BBCA"
  name: string;           // e.g. "PT Bank Central Asia Tbk"
  logoId?: string;        // e.g. "bank-central-asia"
  sector?: string;        // e.g. "Finance"
  type?: string;          // e.g. "stock"
  typespecs?: string[];   // e.g. ["common"]
  close: number;          // Latest closing price
  change: number;         // Chg %
  volume: number;         // Volume
  marketCap?: number;     // Market Cap
  peRatio?: number;       // P/E Ratio
  divYield?: number;      // Dividend Yield %
  analystRating?: string; // Analyst Rating e.g. "Buy"
  [key: string]: any;     // Other category fields
}

export type Timeframe = "1m" | "5m" | "15m" | "30m" | "1h" | "2h" | "4h" | "1D" | "1W" | "1M";

export interface TechnicalIndicator {
  name: string;
  value: number | string | null;
  action: "Buy" | "Sell" | "Neutral";
}

export interface PivotPoints {
  pivotType: string;
  r3: number | null;
  r2: number | null;
  r1: number | null;
  pivot: number | null;
  s1: number | null;
  s2: number | null;
  s3: number | null;
}

export interface SymbolDetail {
  symbol: string;
  name: string;
  close: number;
  timeframe: Timeframe;
  recommendation: {
    all: number;
    ma: number;
    other: number;
    text: "Strong Buy" | "Buy" | "Neutral" | "Sell" | "Strong Sell";
  };
  oscillators: TechnicalIndicator[];
  movingAverages: TechnicalIndicator[];
  pivotPoints: PivotPoints[];
}

export interface TabConfig {
  id: string;
  label: string;
  columns: string[];
}
