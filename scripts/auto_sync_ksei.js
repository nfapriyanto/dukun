const fs = require('fs');
const path = require('path');
const http = require('https');
const { execSync } = require('child_process');
const { Pool } = require('pg');

// 1. Load database credentials from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@localhost:5432/dukun_db';

try {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const parts = line.trim().split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        if (key === 'DATABASE_URL') databaseUrl = val;
      }
    }
  }
} catch (e) {
  console.error('Failed to read .env.local:', e);
}

const pool = new Pool({
  connectionString: databaseUrl
});

// Helper to calculate last business day of a month
function getLastBusinessDay(year, month) {
  const lastDay = new Date(year, month + 1, 0);
  let dayOfWeek = lastDay.getDay(); // 0 = Sun, 6 = Sat
  
  if (dayOfWeek === 0) { // Sunday -> go back to Friday
    lastDay.setDate(lastDay.getDate() - 2);
  } else if (dayOfWeek === 6) { // Saturday -> go back to Friday
    lastDay.setDate(lastDay.getDate() - 1);
  }
  
  const yyyy = lastDay.getFullYear();
  const mm = String(lastDay.getMonth() + 1).padStart(2, '0');
  const dd = String(lastDay.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

// Convert YYYYMMDD to YYYY-MM-DD
function formatDateString(str) {
  return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
}

// Download Helper
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(dest, () => {});
        reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// Parse Date from txt Date format (e.g. 30-JUN-2026 to YYYY-MM-DD)
function parseKseiDate(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const day = parts[0];
  const monthName = parts[1].toUpperCase();
  const year = parts[2];
  const months = {
    JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
    JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12'
  };
  const month = months[monthName];
  if (!month) return null;
  return `${year}-${month}-${day.padStart(2, '0')}`;
}

async function syncMonth(year, month) {
  const yyyymmdd = getLastBusinessDay(year, month);
  const targetDate = formatDateString(yyyymmdd);
  console.log(`Checking composition for: ${targetDate} (WIB Date Key: ${yyyymmdd})...`);

  // 1. Check if date already exists in Local PostgreSQL
  try {
    const res = await pool.query(
      'SELECT 1 FROM public.ksei_holdings WHERE snapshot_date = $1 LIMIT 1',
      [targetDate]
    );

    if (res.rows.length > 0) {
      console.log(`-> KSEI data for ${targetDate} already synced in Database. Skipping.`);
      return;
    }
  } catch (checkError) {
    console.error(`Check error for ${targetDate}:`, checkError);
    return;
  }

  // 2. Download ZIP
  const url = `https://web.ksei.co.id/Download/BalanceposEfek${yyyymmdd}.zip`;
  const tempDir = path.join(__dirname, '..', 'temp_ksei');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const zipPath = path.join(tempDir, `BalanceposEfek${yyyymmdd}.zip`);
  const extractPath = path.join(tempDir, `extracted_${yyyymmdd}`);

  try {
    console.log(`-> Downloading: ${url}`);
    await downloadFile(url, zipPath);
    console.log('-> Download successful. Extracting archive...');

    // Extract using Windows PowerShell Expand-Archive natively
    if (!fs.existsSync(extractPath)) fs.mkdirSync(extractPath);
    execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractPath}' -Force"`);

    // Find txt file in extracted folder
    const files = fs.readdirSync(extractPath);
    const txtFile = files.find(f => f.toLowerCase().endsWith('.txt'));

    if (!txtFile) {
      throw new Error('No txt data file found in extracted zip archive');
    }

    const txtFilePath = path.join(extractPath, txtFile);
    console.log(`-> Parsing txt report: ${txtFilePath}`);

    const content = fs.readFileSync(txtFilePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split('|');
      if (cols.length < 25) continue;

      const rawDate = cols[0];
      const parsedDate = parseKseiDate(rawDate);
      if (!parsedDate) continue;

      records.push({
        snapshot_date: parsedDate,
        ticker: cols[1].toUpperCase(),
        sec_num: parseInt(cols[3]) || 0,
        price: parseFloat(cols[4]) || 0,
        local_is: parseInt(cols[5]) || 0,
        local_cp: parseInt(cols[6]) || 0,
        local_pf: parseInt(cols[7]) || 0,
        local_ib: parseInt(cols[8]) || 0,
        local_id: parseInt(cols[9]) || 0,
        local_mf: parseInt(cols[10]) || 0,
        local_sc: parseInt(cols[11]) || 0,
        local_fd: parseInt(cols[12]) || 0,
        local_ot: parseInt(cols[13]) || 0,
        local_total: parseInt(cols[14]) || 0,
        foreign_is: parseInt(cols[15]) || 0,
        foreign_cp: parseInt(cols[16]) || 0,
        foreign_pf: parseInt(cols[17]) || 0,
        foreign_ib: parseInt(cols[18]) || 0,
        foreign_id: parseInt(cols[19]) || 0,
        foreign_mf: parseInt(cols[20]) || 0,
        foreign_sc: parseInt(cols[21]) || 0,
        foreign_fd: parseInt(cols[22]) || 0,
        foreign_ot: parseInt(cols[23]) || 0,
        foreign_total: parseInt(cols[24]) || 0
      });
    }

    console.log(`-> Uploading ${records.length} records to local database...`);
    const batchSize = 100;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      const values = [];
      const placeholders = batch.map((r, idx) => {
        const base = idx * 3;
        const dataObject = { ...r };
        delete dataObject.snapshot_date;
        delete dataObject.ticker;
        
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

    console.log(`-> Successfully synced KSEI data for ${targetDate}!`);
  } catch (err) {
    console.warn(`-> Skip/Failed for ${targetDate}: ${err.message}`);
  } finally {
    // Cleanup temporary files
    try {
      if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
      if (fs.existsSync(extractPath)) {
        fs.rmSync(extractPath, { recursive: true, force: true });
      }
    } catch (cleanupErr) {
      // ignore cleanup errors
    }
  }
}

async function main() {
  console.log('=== KSEI Holding Composition Auto Sync Started ===');
  
  // Ensure tables exist before running sync
  await pool.query(`
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

  const startDate = new Date('2023-01-01');
  const endDate = new Date();

  // Loop monthly from Jan 2023 to current month
  let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  while (current <= endDate) {
    const year = current.getFullYear();
    const month = current.getMonth();
    
    await syncMonth(year, month);
    
    // Increment month
    current.setMonth(current.getMonth() + 1);
  }

  // Cleanup temp dir if empty
  const tempDir = path.join(__dirname, '..', 'temp_ksei');
  try {
    if (fs.existsSync(tempDir) && fs.readdirSync(tempDir).length === 0) {
      fs.rmdirSync(tempDir);
    }
  } catch (e) {}

  await pool.end();
  console.log('=== KSEI Holding Composition Auto Sync Finished ===');
}

main().catch(console.error);
