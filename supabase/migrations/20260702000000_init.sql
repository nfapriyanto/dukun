-- Master data saham
create table if not exists stocks (
  symbol text primary key,        -- e.g. 'IDX:BBCA'
  ticker text not null,           -- 'BBCA'
  name text not null,             -- 'PT Bank Central Asia Tbk'
  logo_id text,
  sector text,
  type text,
  typespecs text[],
  updated_at timestamptz default now()
);

-- Snapshot data screener harian (per tanggal, per kategori tab)
create table if not exists stock_snapshots (
  id bigint generated always as identity primary key,
  symbol text references stocks(symbol) on delete cascade,
  snapshot_date date not null,
  category text not null,          -- 'overview' | 'performance' | 'technicals' | dst
  data jsonb not null,             -- simpan seluruh kolom kategori sbg JSON
  created_at timestamptz default now(),
  unique (symbol, snapshot_date, category)
);

create index if not exists idx_snapshots_date on stock_snapshots (snapshot_date);
create index if not exists idx_snapshots_symbol on stock_snapshots (symbol);
create index if not exists idx_snapshots_data_gin on stock_snapshots using gin (data);

-- Cache detail teknikal per simbol per timeframe (TTL pendek)
create table if not exists stock_technicals_cache (
  symbol text,
  timeframe text,                  -- '1', '5', '15', '30', '60', '120', '240', '1D', '1W', '1M'
  data jsonb not null,
  fetched_at timestamptz default now(),
  primary key (symbol, timeframe)
);
