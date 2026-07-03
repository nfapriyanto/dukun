import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgrespassword@localhost:5432/dukun_db";

export const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

let initialized = false;

export async function initDb() {
  if (initialized) return;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Stocks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.stocks (
        symbol TEXT PRIMARY KEY,
        ticker TEXT NOT NULL,
        name TEXT NOT NULL,
        logo_id TEXT,
        sector TEXT,
        type TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Stock snapshots table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.stock_snapshots (
        id SERIAL PRIMARY KEY,
        symbol TEXT NOT NULL REFERENCES public.stocks(symbol) ON DELETE CASCADE,
        snapshot_date DATE NOT NULL,
        category TEXT NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT uniq_symbol_date_cat UNIQUE (symbol, snapshot_date, category)
      );
    `);

    // Create indexes for fast querying on snapshots
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_snapshots_date_cat ON public.stock_snapshots (snapshot_date, category);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_snapshots_symbol ON public.stock_snapshots (symbol);
    `);

    // 3. KSEI holdings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.ksei_holdings (
        id SERIAL PRIMARY KEY,
        snapshot_date DATE NOT NULL,
        ticker TEXT NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT uniq_ksei_date_ticker UNIQUE (snapshot_date, ticker)
      );
    `);

    // Create index on KSEI ticker for detail page loading
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ksei_ticker ON public.ksei_holdings (ticker);
    `);

    await client.query("COMMIT");
    initialized = true;
    console.log("Database initialized successfully.");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Failed to initialize database:", e);
    throw e;
  } finally {
    client.release();
  }
}

// Helper to run query safely ensuring database is initialized
export async function query(text: string, params?: any[]) {
  await initDb();
  return pool.query(text, params);
}
