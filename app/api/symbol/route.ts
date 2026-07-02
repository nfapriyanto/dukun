import { NextResponse } from "next/server";
import { TechnicalIndicator, PivotPoints, Timeframe } from "../../types";

const BASE_FIELDS = [
  "Recommend.Other", "Recommend.All", "Recommend.MA", "RSI", "RSI[1]",
  "Stoch.K", "Stoch.D", "Stoch.K[1]", "Stoch.D[1]", "CCI20", "CCI20[1]",
  "ADX", "ADX+DI", "ADX-DI", "ADX+DI[1]", "ADX-DI[1]", "AO", "AO[1]", "AO[2]",
  "Mom", "Mom[1]", "MACD.macd", "MACD.signal", "Rec.Stoch.RSI", "Stoch.RSI.K",
  "Rec.WR", "W.R", "Rec.BBPower", "BBPower", "Rec.UO", "UO", "EMA10", "close",
  "SMA10", "EMA20", "SMA20", "EMA30", "SMA30", "EMA50", "SMA50", "EMA100", "SMA100",
  "EMA200", "SMA200", "Rec.Ichimoku", "Ichimoku.BLine", "Rec.VWMA", "VWMA",
  "Rec.HullMA9", "HullMA9",
  // Pivot Classic
  "Pivot.M.Classic.R3", "Pivot.M.Classic.R2", "Pivot.M.Classic.R1", "Pivot.M.Classic.Middle", "Pivot.M.Classic.S1", "Pivot.M.Classic.S2", "Pivot.M.Classic.S3",
  // Pivot Fibonacci
  "Pivot.M.Fibonacci.R3", "Pivot.M.Fibonacci.R2", "Pivot.M.Fibonacci.R1", "Pivot.M.Fibonacci.Middle", "Pivot.M.Fibonacci.S1", "Pivot.M.Fibonacci.S2", "Pivot.M.Fibonacci.S3",
  // Pivot Camarilla
  "Pivot.M.Camarilla.R3", "Pivot.M.Camarilla.R2", "Pivot.M.Camarilla.R1", "Pivot.M.Camarilla.Middle", "Pivot.M.Camarilla.S1", "Pivot.M.Camarilla.S2", "Pivot.M.Camarilla.S3",
  // Pivot Woodie
  "Pivot.M.Woodie.R3", "Pivot.M.Woodie.R2", "Pivot.M.Woodie.R1", "Pivot.M.Woodie.Middle", "Pivot.M.Woodie.S1", "Pivot.M.Woodie.S2", "Pivot.M.Woodie.S3",
  // Pivot Demark
  "Pivot.M.Demark.R1", "Pivot.M.Demark.Middle", "Pivot.M.Demark.S1"
];

const TIMEFRAME_SUFFIXES: Record<string, string> = {
  "1m": "|1",
  "5m": "|5",
  "15m": "|15",
  "30m": "|30",
  "1h": "|60",
  "2h": "|120",
  "4h": "|240",
  "1D": "",
  "1W": "|1W",
  "1M": "|1M"
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const timeframeParam = searchParams.get("timeframe") || "1D";

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    const suffix = TIMEFRAME_SUFFIXES[timeframeParam] !== undefined ? TIMEFRAME_SUFFIXES[timeframeParam] : "";
    const fields = BASE_FIELDS.map(f => `${f}${suffix}`).join(",");

    const tvUrl = `https://scanner.tradingview.com/symbol?symbol=${encodeURIComponent(symbol)}&fields=${encodeURIComponent(fields)}&no_404=true&label-product=popup-technicals`;

    const response = await fetch(tvUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      next: { revalidate: 30 } // Cache detail 30 seconds
    });

    if (!response.ok) {
      throw new Error(`TradingView Symbol Detail API error: ${response.statusText}`);
    }

    const rawData = await response.json();

    // Map result: TradingView might return keys with suffix or flat depending on how fields are requested.
    // Usually they return the exact keys as requested in `fields` but without suffix if they match the requested format.
    // Let's create a mapper that checks both flat key and suffixed key.
    const getVal = (key: string): any => {
      if (rawData[`${key}${suffix}`] !== undefined) return rawData[`${key}${suffix}`];
      if (rawData[key] !== undefined) return rawData[key];
      return null;
    };

    const closePrice = getVal("close");

    // Action calculations based on values and recommendations
    const getActionText = (recVal: number | null): "Buy" | "Sell" | "Neutral" => {
      if (recVal === null || recVal === undefined) return "Neutral";
      if (recVal > 0.1) return "Buy";
      if (recVal < -0.1) return "Sell";
      return "Neutral";
    };

    // Calculate actions for moving averages based on close price comparison
    const getMAAction = (maValue: number | null): "Buy" | "Sell" | "Neutral" => {
      if (!maValue || !closePrice) return "Neutral";
      return closePrice > maValue ? "Buy" : closePrice < maValue ? "Sell" : "Neutral";
    };

    // Calculate action for oscillators
    const getOscillatorAction = (name: string): "Buy" | "Sell" | "Neutral" => {
      const val = getVal(name);
      switch (name) {
        case "RSI":
          if (val === null) return "Neutral";
          return val < 30 ? "Buy" : val > 70 ? "Sell" : "Neutral";
        case "Stoch.K":
          if (val === null) return "Neutral";
          return val < 20 ? "Buy" : val > 80 ? "Sell" : "Neutral";
        case "CCI20":
          if (val === null) return "Neutral";
          return val < -100 ? "Buy" : val > 100 ? "Sell" : "Neutral";
        case "ADX":
          const pDI = getVal("ADX+DI");
          const mDI = getVal("ADX-DI");
          if (val === null || pDI === null || mDI === null) return "Neutral";
          if (val > 20) {
            return pDI > mDI ? "Buy" : "Sell";
          }
          return "Neutral";
        case "AO":
          const ao1 = getVal("AO[1]");
          if (val === null || ao1 === null) return "Neutral";
          return val > 0 && val > ao1 ? "Buy" : val < 0 && val < ao1 ? "Sell" : "Neutral";
        case "Mom":
          const mom1 = getVal("Mom[1]");
          if (val === null || mom1 === null) return "Neutral";
          return val > mom1 ? "Buy" : val < mom1 ? "Sell" : "Neutral";
        case "MACD.macd":
          const sig = getVal("MACD.signal");
          if (val === null || sig === null) return "Neutral";
          return val > sig ? "Buy" : "Sell";
        case "Stoch.RSI.K":
          return getActionText(getVal("Rec.Stoch.RSI"));
        case "W.R":
          return getActionText(getVal("Rec.WR"));
        case "BBPower":
          return getActionText(getVal("Rec.BBPower"));
        case "UO":
          return getActionText(getVal("Rec.UO"));
        default:
          return "Neutral";
      }
    };

    const recommendAll = getVal("Recommend.All") || 0;
    const recommendMA = getVal("Recommend.MA") || 0;
    const recommendOther = getVal("Recommend.Other") || 0;

    let recommendationText: "Strong Buy" | "Buy" | "Neutral" | "Sell" | "Strong Sell" = "Neutral";
    if (recommendAll > 0.5) recommendationText = "Strong Buy";
    else if (recommendAll > 0.1) recommendationText = "Buy";
    else if (recommendAll < -0.5) recommendationText = "Strong Sell";
    else if (recommendAll < -0.1) recommendationText = "Sell";

    const oscillators: TechnicalIndicator[] = [
      { name: "Relative Strength Index (14)", value: getVal("RSI"), action: getOscillatorAction("RSI") },
      { name: "Stochastic %K (14, 3, 3)", value: getVal("Stoch.K"), action: getOscillatorAction("Stoch.K") },
      { name: "Commodity Channel Index (20)", value: getVal("CCI20"), action: getOscillatorAction("CCI20") },
      { name: "Average Directional Index (14)", value: getVal("ADX"), action: getOscillatorAction("ADX") },
      { name: "Awesome Oscillator", value: getVal("AO"), action: getOscillatorAction("AO") },
      { name: "Momentum (10)", value: getVal("Mom"), action: getOscillatorAction("Mom") },
      { name: "MACD Level (12, 26)", value: getVal("MACD.macd"), action: getOscillatorAction("MACD.macd") },
      { name: "Stochastic RSI Fast (3, 3, 14, 14)", value: getVal("Stoch.RSI.K"), action: getOscillatorAction("Stoch.RSI.K") },
      { name: "Williams Percent Range (14)", value: getVal("W.R"), action: getOscillatorAction("W.R") },
      { name: "Bull Bear Power", value: getVal("BBPower"), action: getOscillatorAction("BBPower") },
      { name: "Ultimate Oscillator (7, 14, 28)", value: getVal("UO"), action: getOscillatorAction("UO") }
    ];

    const movingAverages: TechnicalIndicator[] = [
      { name: "Exponential Moving Average (10)", value: getVal("EMA10"), action: getMAAction(getVal("EMA10")) },
      { name: "Simple Moving Average (10)", value: getVal("SMA10"), action: getMAAction(getVal("SMA10")) },
      { name: "Exponential Moving Average (20)", value: getVal("EMA20"), action: getMAAction(getVal("EMA20")) },
      { name: "Simple Moving Average (20)", value: getVal("SMA20"), action: getMAAction(getVal("SMA20")) },
      { name: "Exponential Moving Average (30)", value: getVal("EMA30"), action: getMAAction(getVal("EMA30")) },
      { name: "Simple Moving Average (30)", value: getVal("SMA30"), action: getMAAction(getVal("SMA30")) },
      { name: "Exponential Moving Average (50)", value: getVal("EMA50"), action: getMAAction(getVal("EMA50")) },
      { name: "Simple Moving Average (50)", value: getVal("SMA50"), action: getMAAction(getVal("SMA50")) },
      { name: "Exponential Moving Average (100)", value: getVal("EMA100"), action: getMAAction(getVal("EMA100")) },
      { name: "Simple Moving Average (100)", value: getVal("SMA100"), action: getMAAction(getVal("SMA100")) },
      { name: "Exponential Moving Average (200)", value: getVal("EMA200"), action: getMAAction(getVal("EMA200")) },
      { name: "Simple Moving Average (200)", value: getVal("SMA200"), action: getMAAction(getVal("SMA200")) },
      { name: "Ichimoku Base Line (9, 26, 52, 26)", value: getVal("Ichimoku.BLine"), action: getActionText(getVal("Rec.Ichimoku")) },
      { name: "Volume Weighted Moving Average (20)", value: getVal("VWMA"), action: getMAAction(getVal("VWMA")) },
      { name: "Hull Moving Average (9)", value: getVal("HullMA9"), action: getActionText(getVal("Rec.HullMA9")) }
    ];

    const pivotPoints: PivotPoints[] = [
      {
        pivotType: "Classic",
        r3: getVal("Pivot.M.Classic.R3"), r2: getVal("Pivot.M.Classic.R2"), r1: getVal("Pivot.M.Classic.R1"),
        pivot: getVal("Pivot.M.Classic.Middle"),
        s1: getVal("Pivot.M.Classic.S1"), s2: getVal("Pivot.M.Classic.S2"), s3: getVal("Pivot.M.Classic.S3")
      },
      {
        pivotType: "Fibonacci",
        r3: getVal("Pivot.M.Fibonacci.R3"), r2: getVal("Pivot.M.Fibonacci.R2"), r1: getVal("Pivot.M.Fibonacci.R1"),
        pivot: getVal("Pivot.M.Fibonacci.Middle"),
        s1: getVal("Pivot.M.Fibonacci.S1"), s2: getVal("Pivot.M.Fibonacci.S2"), s3: getVal("Pivot.M.Fibonacci.S3")
      },
      {
        pivotType: "Camarilla",
        r3: getVal("Pivot.M.Camarilla.R3"), r2: getVal("Pivot.M.Camarilla.R2"), r1: getVal("Pivot.M.Camarilla.R1"),
        pivot: getVal("Pivot.M.Camarilla.Middle"),
        s1: getVal("Pivot.M.Camarilla.S1"), s2: getVal("Pivot.M.Camarilla.S2"), s3: getVal("Pivot.M.Camarilla.S3")
      },
      {
        pivotType: "Woodie",
        r3: getVal("Pivot.M.Woodie.R3"), r2: getVal("Pivot.M.Woodie.R2"), r1: getVal("Pivot.M.Woodie.R1"),
        pivot: getVal("Pivot.M.Woodie.Middle"),
        s1: getVal("Pivot.M.Woodie.S1"), s2: getVal("Pivot.M.Woodie.S2"), s3: getVal("Pivot.M.Woodie.S3")
      },
      {
        pivotType: "Demark",
        r3: null, r2: null, r1: getVal("Pivot.M.Demark.R1"),
        pivot: getVal("Pivot.M.Demark.Middle"),
        s1: getVal("Pivot.M.Demark.S1"), s2: null, s3: null
      }
    ];

    const result = {
      symbol,
      close: closePrice,
      timeframe: timeframeParam,
      recommendation: {
        all: recommendAll,
        ma: recommendMA,
        other: recommendOther,
        text: recommendationText
      },
      oscillators,
      movingAverages,
      pivotPoints
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Symbol API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
