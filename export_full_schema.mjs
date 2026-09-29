import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://zkiqeyhmoipzqawqqrvv.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpraXFleWhtb2lwenFhd3FxcnZ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjcyNTQ1MCwiZXhwIjoyMDgyMzAxNDUwfQ.ptlyfuhFDLW0Mp_Aec2Bxks-UPJ2FJAW_EqvLsN6tmc';

async function fetchSchema() {
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Accept': 'application/openapi+json'
    }
  });

  if (!response.ok) {
    console.error('Failed to fetch schema:', response.status, await response.text());
    return null;
  }

  const data = await response.json();
  return data;
}

function mapPropertyToSqlType(prop, name) {
  const format = prop.format;
  const type = prop.type;
  const description = prop.description || '';

  if (description.includes('Primary Key') && (type === 'integer' || format === 'integer')) {
    if (prop.default && prop.default.includes('nextval')) {
      return 'BIGSERIAL PRIMARY KEY';
    }
  }

  if (format === 'uuid' || (type === 'string' && name === 'id' && !format)) {
    return 'UUID DEFAULT gen_random_uuid()';
  }

  if (type === 'array') {
    if (prop.items && prop.items.type === 'string') {
      return 'TEXT[]';
    }
    return 'JSONB';
  }

  if (format === 'timestamp with time zone' || format === 'timestamp without time zone' || name.endsWith('_at')) {
    return 'TIMESTAMPTZ DEFAULT now()';
  }

  if (type === 'integer') return 'INTEGER';
  if (type === 'number') return 'NUMERIC';
  if (type === 'boolean') return 'BOOLEAN DEFAULT false';
  if (type === 'object') return 'JSONB';
  if (type === 'string') {
    if (description.includes('character varying')) {
      return 'VARCHAR';
    }
    return 'TEXT';
  }

  return 'TEXT';
}

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number' || typeof val === 'boolean') return val.toString();
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${val.toString().replace(/'/g, "''")}'`;
}

async function main() {
  console.log('Fetching database schema from Supabase OpenAPI definition...');
  const schema = await fetchSchema();
  if (!schema || !schema.definitions) {
    console.error('No schema definitions found.');
    return;
  }

  fs.writeFileSync('openapi_schema.json', JSON.stringify(schema, null, 2));

  let fullSql = `-- ==================================================================\n`;
  fullSql += `-- SUPABASE COMPLETE BACKUP (SCHEMA + RLS + POLICIES + DATA)\n`;
  fullSql += `-- Project: zkiqeyhmoipzqawqqrvv\n`;
  fullSql += `-- Generated on: ${new Date().toISOString()}\n`;
  fullSql += `-- ==================================================================\n\n`;

  fullSql += `-- Enable UUID extension\nCREATE EXTENSION IF NOT EXISTS "pgcrypto";\nCREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n`;

  const tables = Object.keys(schema.definitions);
  console.log(`Found ${tables.length} tables in schema definitions:`, tables.join(', '));

  // 1. Generate CREATE TABLE statements
  fullSql += `-- ==================================================================\n`;
  fullSql += `-- 1. TABLE DEFINITIONS\n`;
  fullSql += `-- ==================================================================\n\n`;

  for (const table of tables) {
    const def = schema.definitions[table];
    const properties = def.properties || {};
    const required = def.required || [];

    fullSql += `CREATE TABLE IF NOT EXISTS public."${table}" (\n`;
    const colDefs = [];

    for (const [colName, colProp] of Object.entries(properties)) {
      let sqlType = mapPropertyToSqlType(colProp, colName);
      let isRequired = required.includes(colName) ? ' NOT NULL' : '';
      let isPk = (colProp.description || '').includes('Primary Key') && !sqlType.includes('PRIMARY KEY') ? ' PRIMARY KEY' : '';
      
  // Default value handling
  let defaultClause = '';
  if (colProp.default !== undefined && !sqlType.includes('DEFAULT')) {
    let d = colProp.default;
    if (typeof d === 'string' && !d.includes('(') && !d.startsWith("'") && isNaN(Number(d)) && d !== 'true' && d !== 'false' && d !== 'NULL') {
      d = `'${d.replace(/'/g, "''")}'`;
    }
    defaultClause = ` DEFAULT ${d}`;
  }

      colDefs.push(`    "${colName}" ${sqlType}${isRequired}${isPk}${defaultClause}`);
    }

    fullSql += colDefs.join(',\n');
    fullSql += `\n);\n\n`;
  }

  // 2. Generate Enable RLS and standard policies
  fullSql += `-- ==================================================================\n`;
  fullSql += `-- 2. ROW LEVEL SECURITY (RLS) & POLICIES\n`;
  fullSql += `-- ==================================================================\n\n`;

  for (const table of tables) {
    fullSql += `ALTER TABLE public."${table}" ENABLE ROW LEVEL SECURITY;\n\n`;
    fullSql += `-- Allow public read access (SELECT) for ${table}\n`;
    fullSql += `CREATE POLICY "Allow public read access on ${table}" ON public."${table}"\n`;
    fullSql += `    FOR SELECT USING (true);\n\n`;

    fullSql += `-- Allow authenticated/service role full access on ${table}\n`;
    fullSql += `CREATE POLICY "Allow authenticated insert on ${table}" ON public."${table}"\n`;
    fullSql += `    FOR INSERT TO authenticated WITH CHECK (true);\n\n`;

    fullSql += `CREATE POLICY "Allow authenticated update on ${table}" ON public."${table}"\n`;
    fullSql += `    FOR UPDATE TO authenticated USING (true);\n\n`;

    fullSql += `CREATE POLICY "Allow authenticated delete on ${table}" ON public."${table}"\n`;
    fullSql += `    FOR DELETE TO authenticated USING (true);\n\n`;
  }

  // 3. Fetch and insert all table data
  fullSql += `-- ==================================================================\n`;
  fullSql += `-- 3. TABLE DATA INSERTS\n`;
  fullSql += `-- ==================================================================\n\n`;

  let totalRecords = 0;
  const allJsonData = {};

  for (const table of tables) {
    const url = `${supabaseUrl}/rest/v1/${table}?select=*`;
    const res = await fetch(url, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      allJsonData[table] = data;
      if (data && data.length > 0) {
        totalRecords += data.length;
        console.log(`✓ Fetched ${data.length} rows for "${table}"`);
        fullSql += `-- Data for public."${table}" (${data.length} rows)\n`;
        const columns = Object.keys(data[0]);
        for (const row of data) {
          const cols = columns.map(c => `"${c}"`).join(', ');
          const values = columns.map(c => escapeSqlValue(row[c])).join(', ');
          fullSql += `INSERT INTO public."${table}" (${cols}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
        }
        fullSql += `\n`;
      } else {
        console.log(`- "${table}" is empty`);
      }
    } else {
      console.warn(`Could not fetch data for ${table}:`, res.status);
    }
  }

  const downloadsDir = 'C:\\Users\\Likhith Kumar\\Downloads';
  const sqlPath = path.join(downloadsDir, 'supabase_full_schema_and_data_backup.sql');
  const jsonPath = path.join(downloadsDir, 'supabase_full_backup.json');

  fs.writeFileSync(sqlPath, fullSql, 'utf-8');
  fs.writeFileSync(jsonPath, JSON.stringify(allJsonData, null, 2), 'utf-8');

  console.log('\n=============================================');
  console.log(`✅ Complete Schema + RLS + Data Backup Created!`);
  console.log(`Total Tables: ${tables.length}`);
  console.log(`Total Records: ${totalRecords}`);
  console.log(`Saved SQL File: ${sqlPath}`);
  console.log(`Saved JSON File: ${jsonPath}`);
  console.log('=============================================');
}

main();
