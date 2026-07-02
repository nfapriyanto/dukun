const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read .env.local manually to get Supabase credentials
const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const parts = line.trim().split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
      if (key === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') supabaseKey = val;
    }
  }
} catch (e) {
  console.error('Failed to read .env.local:', e);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Parse Date Helper
function parseKseiDate(dateStr) {
  // format: "30-JUN-2026"
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

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.log('Usage: node scripts/import_ksei.js <path_to_balancepos_txt_file>');
    process.exit(1);
  }

  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(1);
  }

  console.log(`Reading file: ${absolutePath}...`);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const lines = content.split(/\r?\n/);
  
  if (lines.length < 2) {
    console.error('Empty file or invalid format');
    process.exit(1);
  }

  const header = lines[0].split('|');
  console.log(`Parsing file with headers: ${header.slice(0, 5).join(', ')}...`);

  const records = [];
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split('|');
    if (cols.length < 25) {
      skipped++;
      continue;
    }

    const rawDate = cols[0];
    const parsedDate = parseKseiDate(rawDate);
    if (!parsedDate) {
      skipped++;
      continue;
    }

    const ticker = cols[1].toUpperCase();

    records.push({
      snapshot_date: parsedDate,
      ticker: ticker,
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

  console.log(`Successfully parsed ${records.length} records. Skipped ${skipped} lines.`);
  console.log('Uploading records in batches to Supabase...');

  // Batch insert to prevent payload size limits
  const batchSize = 200;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const { error } = await supabase
      .from('ksei_holdings')
      .upsert(batch, { onConflict: 'snapshot_date,ticker' });

    if (error) {
      console.error(`Error uploading batch starting at index ${i}:`, error);
    } else {
      console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)}`);
    }
  }

  console.log('Import completed successfully!');
}

main().catch(console.error);
