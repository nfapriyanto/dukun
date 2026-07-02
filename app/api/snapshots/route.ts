import { NextResponse } from "next/server";

export async function GET() {
  try {
    // If Supabase is configured in the environment, we could fetch dates from the stock_snapshots table.
    // For now, we return today's date and some historical dates for testing purposes.
    const dates = [
      new Date().toISOString().split("T")[0]
    ];
    return NextResponse.json({ dates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch dates" }, { status: 500 });
  }
}
