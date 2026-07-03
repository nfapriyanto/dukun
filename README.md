# Dukunmuu PRO - IDX Stock Screener & Analytics Terminal

Dukunmuu PRO is a state-of-the-art, high-performance IDX (Indonesian Stock Exchange) stock screener, technical analysis aggregator, and KSEI (Kustodian Sentral Efek Indonesia) holding composition visualizer. Built on a modernized, dockerized stack, the application guarantees sub-100ms loading speeds through server-side pagination and local database queries.

---

## 🌟 Key Features

1. **High-Performance Screener Dashboard**:
   - Tabbed indicators: *Overview, Performance, Technicals, Extended Hours, Forecast, Valuation, Dividends, Profitability, and Balance Sheets*.
   - Server-side sorting, search, sector filtering, and pagination for instant render times.
   - Dynamic Candlestick Pattern visualizations in the technicals tab.

2. **Historical KSEI Holding Composition**:
   - Displays all 25 columns of the official KSEI holding records in a scrollable historical table.
   - Visual **Local vs Foreign** ratio stacked bar indicator.
   - Visual **Retail vs Institutional** ratio stacked bar indicator.
   - Informative dotted underlines with hover descriptions for all complex investor acronyms.

3. **Date Comparison Mode**:
   - Compare stock performances and prices between two customizable historical snapshot dates.
   - Paginate, search, sector-filter, and sort directly across the comparison dataset.

4. **Real-time Event-Driven Data Sync**:
   - A dedicated manual "Sync Data" button in the header triggers a Server-Sent Events (SSE) stream.
   - Real-time progress bar shows status and updates as it pulls and caches all data categories from TradingView to the local database.

---

## 🏗️ Architecture & Technologies

- **Frontend & Backend**: Next.js (App Router, strict TypeScript)
- **Database**: PostgreSQL (packaged locally inside Docker, with optimized index scans)
- **Containerization**: Docker & Docker Compose
- **Design System**: Sleek modern dark mode using curated HSL color spaces and micro-animations.

---

## 🚀 Getting Started (Docker Installation)

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) on your machine.

### Installation Steps

1. **Clone the Repository** and navigate to the project folder:
   ```bash
   cd dukun
   ```

2. **Spin Up the Containers**:
   Execute the following command to build the Next.js app and run it alongside the PostgreSQL database:
   ```bash
   docker-compose up --build -d
   ```

3. **Access the Application**:
   - Open [http://localhost:3000](http://localhost:3000) in your browser.
   - The PostgreSQL instance runs on port `5432` with credentials defined in the `docker-compose.yml` file.

---

## 📊 Database Management

On the very first API request, the database client helper (`lib/db.ts`) will automatically run startup DDL scripts to create all tables and indexes.

### Database Schema
- **`stocks`**: Stores primary stock credentials (symbol, ticker, name, logo ID, sector).
- **`stock_snapshots`**: Stores category technical data JSONB snapshots per date.
- **`ksei_holdings`**: Stores KSEI detailed 25-column investor holding composition data.

---

## 🔄 How to Populate KSEI Data

The KSEI holding composition archive contains large files and is processed through standalone background utility scripts inside the container:

### Option A: Sync All Historical KSEI Data (Automated)
This downloads, extracts, parses, and uploads monthly KSEI report compositions from Jan 2023 to the current month:
```bash
docker exec -it dukun_web node scripts/auto_sync_ksei.js
```

### Option B: Manual File Import
To import a specific `.txt` report file that you have downloaded:
```bash
docker exec -it dukun_web node scripts/import_ksei.js /app/path_to_file.txt
```

---

## 🛠️ Local Development (Without Docker)

If you prefer to run Next.js outside of Docker for development:

1. Create a `.env.local` file in the root folder:
   ```env
   DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/dukun_db
   ```
2. Start the Postgres service (e.g. in Docker) to have the database running.
3. Install dependencies and start the Next.js dev server:
   ```bash
   npm install
   npm run dev
   ```
