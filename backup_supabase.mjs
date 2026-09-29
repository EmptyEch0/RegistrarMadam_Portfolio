import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://zkiqeyhmoipzqawqqrvv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpraXFleWhtb2lwenFhd3FxcnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MjU0NTAsImV4cCI6MjA4MjMwMTQ1MH0.RTwJEh1x_C1Tr5VdTXyVJDxebuOQwGsCeUiyB7MGYGk';

const knownTables = [
  'academic_governance',
  'committee_roles',
  'daily_activities',
  'invited_talks',
  'journals',
  'major_awards',
  'media',
  'publications_recognition',
  'international_conferences',
  'workshops_attended',
  'workshops_organized',
  'faculty_development_programs',
  'phd_scholars_awarded',
  'mca_scholars',
  'mtech_scholars',
  'btech_scholars',
  'puzzle_scores',
  'scholars',
  'profiles'
];

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number' || typeof val === 'boolean') return val.toString();
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${val.toString().replace(/'/g, "''")}'`;
}

async function fetchTable(table) {
  const url = `${supabaseUrl}/rest/v1/${table}?select=*`;
  const response = await fetch(url, {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { error: `HTTP ${response.status}: ${errorText}` };
  }

  const data = await response.json();
  return { data };
}

async function backupDatabase() {
  console.log('Starting Supabase Backup using REST API...');
  const allData = {};
  let sqlDump = `-- Supabase Backup for Project: zkiqeyhmoipzqawqqrvv\n-- Backup Date: ${new Date().toISOString()}\n\n`;

  let totalRecords = 0;

  for (const table of knownTables) {
    try {
      const res = await fetchTable(table);
      if (res.error) {
        if (!res.error.includes('does not exist')) {
          console.warn(`[${table}] Notice: ${res.error}`);
        }
        continue;
      }

      const data = res.data;
      allData[table] = data;

      if (data && data.length > 0) {
        totalRecords += data.length;
        console.log(`✓ [${table}]: ${data.length} records retrieved`);

        sqlDump += `--\n-- Table data for: ${table} (${data.length} rows)\n--\n`;
        const columns = Object.keys(data[0]);
        for (const row of data) {
          const cols = columns.map(c => `"${c}"`).join(', ');
          const values = columns.map(c => escapeSqlValue(row[c])).join(', ');
          sqlDump += `INSERT INTO "${table}" (${cols}) VALUES (${values});\n`;
        }
        sqlDump += `\n`;
      } else {
        console.log(`- [${table}]: 0 records (empty table)`);
      }
    } catch (e) {
      console.error(`Error querying ${table}:`, e.message);
    }
  }

  const downloadsDir = 'C:\\Users\\Likhith Kumar\\Downloads';
  const jsonPath = path.join(downloadsDir, 'supabase_backup.json');
  const sqlPath = path.join(downloadsDir, 'supabase_backup.sql');

  fs.writeFileSync(jsonPath, JSON.stringify(allData, null, 2), 'utf-8');
  fs.writeFileSync(sqlPath, sqlDump, 'utf-8');

  console.log('\n=============================================');
  console.log(`Backup completed successfully!`);
  console.log(`Total Tables Processed: ${Object.keys(allData).length}`);
  console.log(`Total Records Backed Up: ${totalRecords}`);
  console.log(`JSON Backup saved to: ${jsonPath}`);
  console.log(`SQL Backup saved to:  ${sqlPath}`);
  console.log('=============================================');
}

backupDatabase();
