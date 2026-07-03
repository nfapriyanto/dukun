const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

// 1. Load credentials from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl = '';
let supabaseKey = '';
let databaseUrl = 'postgresql://postgres:postgrespassword@localhost:5432/dukun_db';

try {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const parts = line.trim().split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
        if (key === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') supabaseKey = val;
        if (key === 'DATABASE_URL') databaseUrl = val;
      }
    }
  }
} catch (e) {
  console.error('Failed to read .env.local:', e);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in .env.local. Cannot migrate.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const pool = new Pool({
  connectionString: databaseUrl
});

async function main() {
  console.log('=== Migration from Supabase to Local PostgreSQL Started ===');

  // Ensure local tables exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.stocks (
      symbol TEXT PRIMARY KEY,
      ticker TEXT NOT NULL,
      name TEXT NOT NULL,
      logo_id TEXT,
      sector TEXT,
      type TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS public.stock_snapshots (
      id SERIAL PRIMARY KEY,
      symbol TEXT NOT NULL REFERENCES public.stocks(symbol) ON DELETE CASCADE,
      snapshot_date DATE NOT NULL,
      category TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT uniq_symbol_date_cat UNIQUE (symbol, snapshot_date, category)
    );
    CREATE INDEX IF NOT EXISTS idx_snapshots_date_cat ON public.stock_snapshots (snapshot_date, category);
    CREATE INDEX IF NOT EXISTS idx_snapshots_symbol ON public.stock_snapshots (symbol);
    CREATE TABLE IF NOT EXISTS public.ksei_holdings (
      id SERIAL PRIMARY KEY,
      snapshot_date DATE NOT NULL,
      ticker TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT uniq_ksei_date_ticker UNIQUE (snapshot_date, ticker)
    );
    CREATE INDEX IF NOT EXISTS idx_ksei_ticker ON public.ksei_holdings (ticker);
  `);

  // 1. Migrate Stocks
  console.log('-> Fetching stocks from Supabase...');
  const { data: supabaseStocks, error: stocksErr } = await supabase.from('stocks').select('*');
  if (stocksErr) throw stocksErr;

  if (supabaseStocks && supabaseStocks.length > 0) {
    console.log(`-> Migrating ${supabaseStocks.length} stocks to local PostgreSQL...`);
    for (const s of supabaseStocks) {
      await pool.query(
        `INSERT INTO public.stocks (symbol, ticker, name, logo_id, sector, type, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (symbol) DO UPDATE
         SET ticker = EXCLUDED.ticker, name = EXCLUDED.name, logo_id = EXCLUDED.logo_id, sector = EXCLUDED.sector, type = EXCLUDED.type, updated_at = EXCLUDED.updated_at`,
        [s.symbol, s.ticker, s.name, s.logo_id, s.sector, s.type, s.updated_at]
      );
    }
  }

  // 2. Migrate Stock Snapshots
  console.log('-> Fetching stock snapshots from Supabase...');
  const { data: supabaseSnaps, error: snapsErr } = await supabase.from('stock_snapshots').select('*');
  if (snapsErr) throw snapsErr;

  if (supabaseSnaps && supabaseSnaps.length > 0) {
    console.log(`-> Migrating ${supabaseSnaps.length} snapshots to local PostgreSQL...`);
    const batchSize = 100;
    for (let i = 0; i < supabaseSnaps.length; i += batchSize) {
      const batch = supabaseSnaps.slice(i, i + batchSize);
      
      const values = [];
      const placeholders = batch.map((snap, idx) => {
        const base = idx * 5;
        values.push(snap.symbol, snap.snapshot_date, snap.category, JSON.stringify(snap.data), snap.created_at);
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
      }).join(', ');

      await pool.query(
        `INSERT INTO public.stock_snapshots (symbol, snapshot_date, category, data, created_at)
         VALUES ${placeholders}
         ON CONFLICT (symbol, snapshot_date, category) DO UPDATE
         SET data = EXCLUDED.data, created_at = EXCLUDED.created_at`,
        values
      );
    }
  }

  // 3. Migrate KSEI Holdings
  console.log('-> Fetching KSEI holdings from Supabase...');
  const { data: supabaseKsei, error: kseiErr } = await supabase.from('ksei_holdings').select('*');
  if (kseiErr) throw kseiErr;

  if (supabaseKsei && supabaseKsei.length > 0) {
    console.log(`-> Migrating ${supabaseKsei.length} KSEI holding records to local PostgreSQL...`);
    const batchSize = 100;
    for (let i = 0; i < supabaseKsei.length; i += batchSize) {
      const batch = supabaseKsei.slice(i, i + batchSize);
      
      const values = [];
      const placeholders = batch.map((r, idx) => {
        const base = idx * 3;
        // Supabase might have stored it flat, let's structure it or keep it as data JSONB
        // Check if data is already in row.data (if Supabase migration was done later)
        let dataObject = {};
        if (r.data) {
          dataObject = r.data;
        } else {
          dataObject = { ...r };
          delete dataObject.snapshot_date;
          delete dataObject.ticker;
          delete dataObject.id;
          delete dataObject.created_at;
        }
        
        values.push(r.snapshot_date, r.ticker, JSON.stringify(dataObject));
        return `($${base + 1}, $${base + 2}, $${base + 3})`;
      }).join(', ');

      await pool.query(
        `INSERT INTO public.ksei_holdings (snapshot_date, ticker, data)
         VALUES ${placeholders}
         ON CONFLICT (snapshot_date, ticker) DO UPDATE
         SET data = EXCLUDED.data`,
        values
      );
    }
  }

  await pool.end();
  console.log('=== Migration Completed Successfully! ===');
}

main().catch(e => {
  console.error('Migration failed:', e);
  process.exit(1);
});
