import { NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function GET() {
  try {
    const dates = [new Date().toISOString().split("T")[0]];

    try {
      const result = await db.query(
        "SELECT DISTINCT snapshot_date::text FROM public.stock_snapshots ORDER BY snapshot_date DESC"
      );
      
      const uniqueDates = result.rows.map(row => row.snapshot_date);
      if (uniqueDates.length > 0) {
        return NextResponse.json({ dates: uniqueDates });
      }
    } catch (dbErr) {
      console.warn("Failed to fetch dates from PostgreSQL, using defaults:", dbErr);
    }

    return NextResponse.json({ dates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch dates" }, { status: 500 });
  }
}
