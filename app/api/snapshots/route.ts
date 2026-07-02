import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const dates = [new Date().toISOString().split("T")[0]];

    if (supabaseUrl && supabaseKey) {
      try {
        const { data, error } = await supabase
          .from("stock_snapshots")
          .select("snapshot_date");

        if (!error && data) {
          const uniqueDates = Array.from(new Set(data.map(item => item.snapshot_date)));
          // Sort descending
          uniqueDates.sort((a, b) => b.localeCompare(a));
          if (uniqueDates.length > 0) {
            return NextResponse.json({ dates: uniqueDates });
          }
        }
      } catch (dbErr) {
        console.warn("Failed to fetch dates from Supabase, using defaults:", dbErr);
      }
    }

    return NextResponse.json({ dates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch dates" }, { status: 500 });
  }
}
