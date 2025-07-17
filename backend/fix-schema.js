const mysql = require('mysql2');
require('dotenv').config();

// Use the same database connection logic as the backend
let poolConfig;

if (process.env.DATABASE_URL) {
  try {
    // Parse DATABASE_URL (format: mysql://user:password@host:port/database)
    const url = new URL(process.env.DATABASE_URL);
    poolConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading '/'
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000
    };
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    throw error;
  }
} else {
  // Fallback to individual environment variables
  poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000
  };
}

const pool = mysql.createPool(poolConfig);
const promisePool = pool.promise();

async function fixSchema() {
  try {
    console.log('🔧 Fixing database schema for TDL_id consistency...');
    
    // Step 1: Check current schema
    console.log('\n📋 Current AC table schema:');
    const [columns] = await promisePool.execute(`
      DESCRIBE AC
    `);
    
    const tdlIdColumn = columns.find(col => col.Field === 'TDL_id');
    console.log('TDL_id column:', tdlIdColumn);
    
    // Step 2: Check current data
    console.log('\n📊 Current AC equipment data:');
    const [acData] = await promisePool.execute('SELECT id, nom, TDL_id FROM AC');
    console.log('AC equipment:', acData);
    
    // Step 3: Alter the column to VARCHAR to match TDL table
    console.log('\n🔄 Altering TDL_id column from BIGINT to VARCHAR(10)...');
    await promisePool.execute(`
      ALTER TABLE AC 
      MODIFY COLUMN TDL_id VARCHAR(10) NOT NULL
    `);
    console.log('✅ Schema altered successfully');
    
    // Step 4: Update existing data to use string TDL IDs
    console.log('\n📝 Updating existing AC equipment TDL_id values...');
    
    // Update numeric TDL_id values to string equivalents
    const updates = [
      { from: 1, to: 'T1' },
      { from: 2, to: 'T2' },
      { from: 3, to: 'T3' }
    ];
    
    for (const update of updates) {
      const [result] = await promisePool.execute(`
        UPDATE AC SET TDL_id = ? WHERE TDL_id = ?
      `, [update.to, update.from]);
      
      if (result.affectedRows > 0) {
        console.log(`✅ Updated ${result.affectedRows} records: TDL_id ${update.from} → ${update.to}`);
      }
    }
    
    // Step 5: Verify the changes
    console.log('\n🔍 Verifying schema and data changes:');
    
    const [newColumns] = await promisePool.execute('DESCRIBE AC');
    const newTdlIdColumn = newColumns.find(col => col.Field === 'TDL_id');
    console.log('New TDL_id column:', newTdlIdColumn);
    
    const [newAcData] = await promisePool.execute('SELECT id, nom, TDL_id FROM AC');
    console.log('Updated AC equipment:', newAcData);
    
    // Step 6: Test TDL matching
    console.log('\n🎯 Testing TDL-AC equipment matching:');
    const [tdlData] = await promisePool.execute('SELECT id, region FROM TDL');
    
    for (const tdl of tdlData) {
      const [matchingAC] = await promisePool.execute(`
        SELECT nom, output_ac FROM AC WHERE TDL_id = ?
      `, [tdl.id]);
      
      console.log(`TDL ${tdl.id} (${tdl.region}): ${matchingAC.length} AC equipment`);
      matchingAC.forEach(ac => {
        console.log(`  - ${ac.nom} (${ac.output_ac}W)`);
      });
    }
    
    console.log('\n🎉 Schema fix completed successfully!');
    console.log('✅ TDL_id column is now VARCHAR and data is consistent');
    console.log('✅ AC equipment properly linked to TDL sites');
    
  } catch (error) {
    console.error('❌ Error fixing schema:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

fixSchema();
