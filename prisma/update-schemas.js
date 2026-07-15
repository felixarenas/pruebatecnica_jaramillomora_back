// prisma/update-schemas.js
// Detecta schemas en la BD y actualiza schema.prisma automáticamente.
// Compatible con Prisma 7 (usa pg directamente en vez de PrismaClient).
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function detectSchemas() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const { rows } = await pool.query(`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name
    `);

    const schemas = rows.map((row) => row.schema_name);
    console.log('📊 Schemas detectados:', schemas);

    const schemaPath = path.join(__dirname, 'schema.prisma');
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');

    const schemaLine = `  schemas  = ${JSON.stringify(schemas)}`;
    const updatedContent = schemaContent.replace(
      /schemas\s*=\s*\[[^\]]*\]/,
      schemaLine,
    );

    fs.writeFileSync(schemaPath, updatedContent);
    console.log('✅ Schema.prisma actualizado con:', schemas);
  } catch (error) {
    console.warn('⚠️  No se pudo conectar a la BD para detectar schemas, se conservan los actuales.');
    console.warn('   Detalle:', error.message);
  } finally {
    await pool.end().catch(() => {});
  }
}

detectSchemas();
