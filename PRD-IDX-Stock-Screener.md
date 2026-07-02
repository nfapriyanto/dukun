# Product Requirements Document (PRD)
## IDX Stock Screener — Web App

| | |
|---|---|
| **Nama Produk** | IDX Stock Screener |
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 2 Juli 2026 |
| **Tech Stack** | Next.js (App Router), Supabase, Shadcn/UI, TailwindCSS |
| **Sumber Data** | TradingView Scanner API (`scanner.tradingview.com`) |

---

## 1. Latar Belakang & Tujuan

Aplikasi ini adalah **stock screener** untuk saham-saham yang terdaftar di Bursa Efek Indonesia (IDX), terinspirasi dari fitur *Screener* milik TradingView. Data diambil dari endpoint publik TradingView Scanner (`/indonesia/scan`) dan endpoint detail simbol (`/symbol`), lalu ditampilkan dalam tabel interaktif dengan berbagai kategori data (Overview, Performance, Technicals, dst).

**Tujuan utama:**
1. Menyediakan tabel screener saham IDX yang cepat, modern, dan mudah difilter/di-*sort*.
2. Menyimpan **snapshot data historis** ke Supabase agar pengguna bisa membandingkan harga & metrik saham antar tanggal (fitur yang tidak dimiliki TradingView versi gratis).
3. Menyediakan halaman detail saham dengan indikator teknikal (RSI, MACD, Moving Average, Pivot Point, dll) mengikuti berbagai time-frame.

---

## 2. Target Pengguna

- Investor ritel / trader saham IDX yang ingin melakukan riset & screening cepat.
- Pengguna yang ingin membandingkan performa saham antar periode tertentu (misal: harga per 1 Jan vs 1 Jun).

---

## 3. Tech Stack & Arsitektur

| Layer | Teknologi |
|---|---|
| Frontend Framework | **Next.js 15 (App Router, Server Components)** |
| UI Components | **Shadcn/UI** + TailwindCSS |
| Backend / Database | **Supabase** (Postgres, Auth, Edge Functions, Cron) |
| Data Source | TradingView Scanner API (public, unofficial) |
| State/Data Fetching | React Server Components + `@tanstack/react-query` (client interactivity) |
| Charting (opsional) | `recharts` atau `lightweight-charts` untuk grafik indikator |
| Hosting | Vercel (frontend) + Supabase Cloud |

### 3.1 Alur Data (High Level)

```
TradingView Scanner API ──(Supabase Edge Function / Cron Job, tiap N menit)──▶ Supabase Postgres (snapshot table)
                                                                                        │
                                                                                        ▼
                                                                        Next.js App (Server Components)
                                                                                        │
                                                                                        ▼
                                                                        Shadcn Table + Filter + Pagination (Client)
```

Karena TradingView tidak menyediakan API resmi/publik yang stabil untuk pihak ketiga, dan CORS kemungkinan besar akan memblokir pemanggilan langsung dari browser, maka **semua fetch ke TradingView dilakukan di server (Next.js Route Handler / Supabase Edge Function)**, bukan langsung dari client.

---

## 4. Struktur Data Sumber (Ringkasan dari Riset)

Endpoint utama:
```
POST https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```

Terdapat **12 kategori tab** dengan kolom (`columns`) berbeda-beda, masing-masing di-*request* terpisah:

| # | Tab | Jumlah Kolom Tabel |
|---|---|---|
| 1 | Overview | 12 |
| 2 | Performance | 14 |
| 3 | Technicals | 11 |
| 4 | Extended Hours | 13 |
| 5 | Forecast | 13 |
| 6 | Valuation | 14 |
| 7 | Dividends | 9 |
| 8 | Profitability | 11 |
| 9 | Income Statement | 11 |
| 10 | Balance Sheet | 14 |
| 11 | Cash Flow | 8 |
| 12 | Per Share | 11 |

Setiap baris memiliki `s` (symbol, mis. `IDX:BBCA`) dan `d` (array data sesuai urutan `columns`).

Endpoint detail simbol (saat baris/simbol diklik) — mengembalikan indikator teknikal per *time-frame* (1m, 5m, 15m, 30m, 1h, 2h, 4h, 1D, 1W, 1M):
```
GET https://scanner.tradingview.com/symbol?symbol=IDX:{TICKER}&fields=...&label-product=popup-technicals
```

> Catatan penting: mapping **Action (Buy/Neutral/Sell)** untuk masing-masing indikator (RSI, MACD, MA, dll) belum diketahui rumus pastinya dari dokumentasi yang ada — **perlu riset/reverse-engineering tambahan** terhadap logic `Recommend.*` milik TradingView sebelum fitur rating indikator ditampilkan sebagai fakta ke user (lihat **Open Question #1**).

---

## 5. Ruang Lingkup Fitur (Scope)

### 5.1 Fitur Utama (MVP)

#### A. Tabel Screener dengan Tab Kategori
- Navbar/tab horizontal (pakai `Tabs` dari Shadcn) untuk 12 kategori: Overview, Performance, Technicals, Extended Hours, Forecast, Valuation, Dividends, Profitability, Income Statement, Balance Sheet, Cash Flow, Per Share.
- Tabel menggunakan `@tanstack/react-table` + Shadcn `Table` component (data table pattern resmi Shadcn).
- Kolom Symbol menampilkan: logo (dari `s3-symbol-logo.tradingview.com`), ticker, dan nama perusahaan.
- Format angka otomatis: mata uang (IDR), persentase (+/− dengan warna hijau/merah), besaran (Juta/M, Miliar/B, Triliun/T).

#### B. Search Bar
- Search real-time (debounced) berdasarkan ticker atau nama perusahaan.
- Menggunakan Shadcn `Input` + `Command` (combobox) untuk quick search dengan hasil dropdown (opsional: tampilkan logo + harga saat mengetik).

#### C. Filtering
- Panel filter (`Sheet`/`Popover` dari Shadcn) dengan opsi:
  - Sektor (Finance, Energy, Consumer, dll — dari kolom `sector`)
  - Market Cap range (slider min–max)
  - Price range
  - Analyst Rating (Strong Buy, Buy, Neutral, Sell, Strong Sell)
  - P/E, Div Yield, dsb (sesuai tab aktif)
- Filter yang aktif ditampilkan sebagai `Badge` yang bisa dihapus satu per satu.
- Filter dikombinasikan dengan sorting kolom (klik header kolom untuk sort asc/desc).

#### D. Pagination
- Pagination di bawah tabel menggunakan Shadcn `Pagination` component.
- Pilihan jumlah baris per halaman: 25 / 50 / 100.
- Server-side pagination bila data di Supabase sudah besar (gunakan `range()` Supabase, sesuai pola `range: [0, 100]` di payload asli TradingView).

#### E. Tampilan Berdasarkan Tanggal (Snapshot Historis)
- Data discrape berkala (misal tiap hari setelah market tutup, via Supabase Cron/Edge Function) dan disimpan sebagai **snapshot** dengan kolom `snapshot_date`.
- Date picker (Shadcn `Calendar` + `Popover`) untuk memilih tanggal tertentu → tabel menampilkan data screener **per tanggal tersebut** (bukan hanya data real-time terbaru).
- Default: tanggal terbaru (hari ini/hari kerja terakhir).

#### F. Perbandingan Harga Berdasarkan 2 Tanggal
- Halaman/mode khusus "Compare" dengan 2 date picker (Tanggal A & Tanggal B).
- Tabel menampilkan per saham:
  - Harga pada Tanggal A
  - Harga pada Tanggal B
  - Selisih (Rp dan %)
  - Indikator visual (panah naik/turun + warna)
- Bisa difilter per simbol tertentu atau ditampilkan untuk semua saham hasil filter/search yang sedang aktif.
- Opsional: mini sparkline chart pergerakan harga antar 2 tanggal tersebut (pakai `recharts`).

#### G. Detail Saham (Symbol Detail Page/Modal)
- Klik simbol pada baris tabel → buka `Sheet`/`Dialog` (slide-over) berisi:
  - Ringkasan harga & profil singkat.
  - Tab time-frame: 1m, 5m, 15m, 30m, 1h, 2h, 4h, 1D, 1W, 1M.
  - Tabel **Oscillators** (RSI, Stoch, CCI, ADX, AO, Momentum, MACD, Stoch RSI, Williams %R, BBPower, UO) dengan Value + Action (Buy/Neutral/Sell).
  - Tabel **Moving Averages** (EMA/SMA 10/20/30/50/100/200, Ichimoku, VWMA, HullMA) dengan Value + Action.
  - Tabel **Pivot Points** (Classic, Fibonacci, Camarilla, Woodie, Demark) — R3-R2-R1-P-S1-S2-S3.
  - Ringkasan keseluruhan: **Summary Gauge** (Strong Sell → Strong Buy) berdasarkan agregat `Recommend.All`, `Recommend.MA`, `Recommend.Other`.

### 5.2 Fitur Tambahan (Nice-to-have, Fase 2)
- Watchlist per user (butuh Supabase Auth).
- Export data ke CSV/Excel.
- Alert harga (Supabase Realtime + notifikasi).
- Dark mode (Shadcn theme toggle).
- Comparison lebih dari 2 tanggal (multi-date trend chart).

### 5.3 Di Luar Scope (Out of Scope)
- Eksekusi order jual/beli (bukan aplikasi trading, murni screener/analytic).
- Data real-time tick-by-tick (data TradingView scanner ini delay ~10 menit, `"kind-delay": 600`).

---

## 6. Desain & UX

Mengacu pada prinsip *modern web design*:
- **Layout**: sidebar/topbar minimal, fokus ke data table (mirip TradingView/Bloomberg terminal tapi lebih clean & light).
- **Warna**: skema netral (putih/abu gelap untuk dark mode) dengan aksen hijau (naik) & merah (turun) konsisten di seluruh angka persentase.
- **Tipografi**: gunakan font monospace/tabular-nums untuk kolom angka agar rapi sejajar.
- **Komponen Shadcn** yang dipakai: `Table`, `Tabs`, `Command`, `Popover`, `Sheet`, `Dialog`, `Calendar`, `Badge`, `Skeleton` (loading state), `Pagination`, `Select`, `Slider`, `Tooltip`.
- **Responsive**: tabel dapat di-scroll horizontal di mobile, kolom penting (Symbol, Price, Chg%) tetap *sticky* di kiri.
- **Loading & Empty State**: skeleton loader saat fetch data; empty state ilustratif saat filter tidak menghasilkan data.

---

## 7. Skema Database (Supabase / Postgres) — Usulan Awal

```sql
-- Master data saham
create table stocks (
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
create table stock_snapshots (
  id bigint generated always as identity primary key,
  symbol text references stocks(symbol),
  snapshot_date date not null,
  category text not null,          -- 'overview' | 'performance' | 'technicals' | dst
  data jsonb not null,             -- simpan seluruh kolom kategori sbg JSON
  created_at timestamptz default now(),
  unique (symbol, snapshot_date, category)
);

create index idx_snapshots_date on stock_snapshots (snapshot_date);
create index idx_snapshots_symbol on stock_snapshots (symbol);
create index idx_snapshots_data_gin on stock_snapshots using gin (data);

-- Cache detail teknikal per simbol per timeframe (opsional, TTL pendek)
create table stock_technicals_cache (
  symbol text,
  timeframe text,                  -- '1', '5', '15', '30', '60', '120', '240', '1D', '1W', '1M'
  data jsonb not null,
  fetched_at timestamptz default now(),
  primary key (symbol, timeframe)
);
```

> Pendekatan `jsonb` dipilih agar fleksibel terhadap 12 kategori kolom yang berbeda tanpa perlu 12 tabel terpisah. Query filter/sort spesifik bisa memakai *generated columns* atau *GIN index* pada field JSON yang sering difilter (mis. `market_cap_basic`, `close`, `sector`).

### 7.1 Ingestion Job
- Supabase Edge Function (`fetch-scanner-snapshot`) dijadwalkan via **pg_cron** / Supabase Scheduled Trigger, berjalan misalnya tiap hari jam 16:15 WIB (setelah bursa tutup) untuk menyimpan snapshot harian, dan opsional tiap 15–30 menit selama jam bursa untuk data yang lebih fresh.
- Job memanggil ke-12 endpoint kategori TradingView, lalu upsert ke `stock_snapshots`.

---

## 8. Kebutuhan Non-Fungsional

| Aspek | Requirement |
|---|---|
| Performa | Tabel awal render < 2 detik untuk 100 baris; pagination lanjutan < 500ms |
| Skalabilitas | Mendukung ±900 saham IDX, snapshot harian selama minimal 2 tahun |
| Keandalan | Fallback ke snapshot terakhir jika fetch TradingView gagal/limit |
| Keamanan | Semua pemanggilan TradingView dari server, bukan expose langsung ke client; rate-limit di Edge Function |
| Aksesibilitas | Kontras warna memenuhi WCAG AA, keyboard-navigable table |
| Legal/Compliance | Cantumkan disclaimer bahwa data bersumber dari TradingView (unofficial/public endpoint), delay ~10 menit, bukan untuk keputusan transaksi real-time |

---

## 9. Metrik Keberhasilan (Success Metrics)
- Waktu load tabel screener (TTFB → interactive) < 2 detik.
- Tingkat penggunaan fitur filter & compare-by-date oleh pengguna aktif > 40%.
- Snapshot job berjalan sukses (tanpa gagal) ≥ 99% per hari.

---

## 10. Roadmap / Fase Pengembangan

| Fase | Deliverable |
|---|---|
| **Fase 0** | Setup project Next.js + Supabase + Shadcn, skema DB, Edge Function ingestion dasar (tab Overview saja) |
| **Fase 1 (MVP)** | Tabel Overview + Performance + Technicals lengkap dengan search, filter, pagination, sort |
| **Fase 2** | 9 kategori tab sisanya (Extended Hours, Forecast, Valuation, Dividends, Profitability, Income Statement, Balance Sheet, Cash Flow, Per Share) |
| **Fase 3** | Fitur tanggal (date picker snapshot) + fitur perbandingan 2 tanggal |
| **Fase 4** | Detail simbol (Sheet/Dialog) dengan oscillators, moving averages, pivot points multi-timeframe |
| **Fase 5** | Polish UX (dark mode, skeleton, responsive), watchlist, export CSV |

---

## 11. Open Questions / Risiko

1. **Rumus Action (Buy/Neutral/Sell) belum pasti.** Contoh data mentah menunjukkan Momentum bernilai −275 diberi label "Buy" sementara nilai negatif biasanya berkonotasi bearish — kemungkinan besar rating dihitung dari perbandingan `value` saat ini vs `value[1]` (candle sebelumnya) atau terhadap threshold tertentu (bukan dari nilai absolut). **Perlu riset lanjutan / reverse-engineer** rumus resmi TradingView (`Recommend.Other`, `Recommend.MA`, `Recommend.All`) sebelum ditampilkan sebagai rating final ke pengguna — atau beri label "estimasi" dengan disclaimer.
2. **Legalitas penggunaan endpoint tidak resmi TradingView** — endpoint `scanner.tradingview.com` bukan API publik yang didokumentasikan resmi; ada risiko perubahan/pemblokiran sewaktu-waktu. Perlu monitoring & fallback data source alternatif (mis. IDX resmi, Yahoo Finance) sebagai mitigasi jangka panjang.
3. **Rate limiting** dari TradingView terhadap IP server — perlu strategi caching/snapshot agar tidak memanggil endpoint terlalu sering.
4. **Volume data historis** — jika snapshot disimpan tiap hari untuk ±900 saham × 12 kategori, ukuran tabel `stock_snapshots` akan tumbuh cukup besar; perlu strategi partisi tabel per bulan/tahun di Postgres.

---

## 12. Lampiran: Contoh Struktur Kolom per Kategori

Detail lengkap 12 kategori tab (Overview, Performance, Technicals, Extended Hours, Forecast, Valuation, Dividends, Profitability, Income Statement, Balance Sheet, Cash Flow, Per Share) beserta contoh request payload, response JSON, dan mapping kolom tabel mengikuti hasil riset teknis yang telah didokumentasikan terpisah (referensi API TradingView Scanner) dan menjadi acuan tim engineering saat membangun *data mapping layer* di Edge Function ingestion.
