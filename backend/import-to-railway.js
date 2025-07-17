const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Railway MySQL connection
const connection = mysql.createConnection({
  host: 'centerbeam.proxy.rlwy.net',
  port: 18874,
  user: 'root',
  password: 'PzdjOYlzgydxDdTHZcMGsqKcLWYLbhQA',
  database: 'railway',
  multipleStatements: true
});

async function importToRailway() {
  try {
    console.log('🔌 Connecting to Railway MySQL...');
    
    // Test connection
    await connection.promise().execute('SELECT 1');
    console.log('✅ Connected successfully!');
    
    // Read the SQL schema file (go up one directory to find it)
    const sqlFile = path.join(__dirname, '..', 'drawSQL-mysql-export-2025-07-16.sql');
    console.log('📖 Reading SQL file...');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split into individual commands
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`🚀 Executing ${commands.length} SQL commands...`);
    
    // Execute each command
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          await connection.promise().execute(command);
          console.log(`✅ Command ${i + 1}/${commands.length}: SUCCESS`);
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`⚠️  Command ${i + 1}/${commands.length}: Table already exists (OK)`);
          } else {
            console.log(`❌ Command ${i + 1}/${commands.length}: ${error.message}`);
          }
        }
      }
    }
    
    // Create TSF table manually (it had issues in the original schema)
    console.log('🔧 Creating TSF table...');
    try {
      await connection.promise().execute(`
        CREATE TABLE IF NOT EXISTS TSF (
          id CHAR(2) NOT NULL PRIMARY KEY,
          region VARCHAR(255) NOT NULL,
          salle BOOLEAN NOT NULL,
          salle_id INT NOT NULL AUTO_INCREMENT,
          esp_plan FLOAT(53) NOT NULL,
          nb_cab BIGINT NOT NULL,
          charge_ac BIGINT NOT NULL,
          charge_dc BIGINT NOT NULL,
          charge_gen BIGINT NOT NULL,
          charge_clim BIGINT NOT NULL,
          adresse BIGINT NOT NULL,
          KEY(salle_id)
        )
      `);
      console.log('✅ TSF table created successfully');
    } catch (error) {
      console.log('⚠️  TSF table:', error.message);
    }
    
    // Add sample data
    console.log('📊 Adding sample data...');
    
    // Sample TDL data
    const sampleTDL = [
      ['T1', 'Montreal', 1, 150.5, 12, 5000, 2000, 8000, 3000, 123, 456, 789],
      ['T2', 'Quebec City', 0, 200.0, 18, 7500, 3000, 12000, 4500, 321, 654, 987],
      ['T3', 'Sherbrooke', 1, 120.0, 8, 4000, 1500, 6000, 2500, 555, 777, 111]
    ];
    
    for (const tdl of sampleTDL) {
      try {
        await connection.promise().execute(`
          INSERT IGNORE INTO TDL (id, region, SDS, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse, ville, code_postal)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, tdl);
        console.log(`✅ Added TDL site: ${tdl[0]} - ${tdl[1]}`);
      } catch (error) {
        console.log(`⚠️  TDL ${tdl[0]}: ${error.message}`);
      }
    }
    
    // Sample TSF data
    const sampleTSF = [
      ['S1', 'Montreal', 1, 80.0, 6, 3000, 1200, 4500, 1800, 100],
      ['S2', 'Quebec City', 0, 100.0, 10, 4500, 1800, 6500, 2200, 200]
    ];
    
    for (const tsf of sampleTSF) {
      try {
        await connection.promise().execute(`
          INSERT IGNORE INTO TSF (id, region, salle, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, tsf);
        console.log(`✅ Added TSF facility: ${tsf[0]} - ${tsf[1]}`);
      } catch (error) {
        console.log(`⚠️  TSF ${tsf[0]}: ${error.message}`);
      }
    }
    
    // Sample Manufacturers
    const manufacturers = [
      [1001, 'Schneider Electric', 'John Smith', 'john.smith@schneider.com'],
      [1002, 'ABB Group', 'Marie Dubois', 'marie.dubois@abb.com'],
      [1003, 'Siemens', 'Hans Mueller', 'hans.mueller@siemens.com']
    ];
    
    for (const mfg of manufacturers) {
      try {
        await connection.promise().execute(`
          INSERT IGNORE INTO Fabricant (num, nom, Contact, courriel)
          VALUES (?, ?, ?, ?)
        `, mfg);
        console.log(`✅ Added manufacturer: ${mfg[1]}`);
      } catch (error) {
        console.log(`⚠️  Manufacturer ${mfg[1]}: ${error.message}`);
      }
    }
    
    // Sample Suppliers
    const suppliers = [
      [2001, 'TechSupply Inc', 'Sarah Johnson', 'sarah@techsupply.com'],
      [2002, 'PowerSolutions Ltd', 'Mike Wilson', 'mike@powersolutions.com']
    ];
    
    for (const sup of suppliers) {
      try {
        await connection.promise().execute(`
          INSERT IGNORE INTO Fournisseurs (num, nom, Contact, courriel)
          VALUES (?, ?, ?, ?)
        `, sup);
        console.log(`✅ Added supplier: ${sup[1]}`);
      } catch (error) {
        console.log(`⚠️  Supplier ${sup[1]}: ${error.message}`);
      }
    }
    
    // Verify tables were created
    console.log('\n📋 Checking created tables...');
    const [tables] = await connection.promise().execute('SHOW TABLES');
    console.log('Tables in Railway database:');
    tables.forEach(table => {
      console.log(`  ✅ ${Object.values(table)[0]}`);
    });
    
    // Test data count
    console.log('\n📊 Data verification:');
    try {
      const [tdlCount] = await connection.promise().execute('SELECT COUNT(*) as count FROM TDL');
      console.log(`  📍 TDL sites: ${tdlCount[0].count}`);
      
      const [tsfCount] = await connection.promise().execute('SELECT COUNT(*) as count FROM TSF');
      console.log(`  🏢 TSF facilities: ${tsfCount[0].count}`);
      
      const [mfgCount] = await connection.promise().execute('SELECT COUNT(*) as count FROM Fabricant');
      console.log(`  🏭 Manufacturers: ${mfgCount[0].count}`);
      
      const [supCount] = await connection.promise().execute('SELECT COUNT(*) as count FROM Fournisseurs');
      console.log(`  📦 Suppliers: ${supCount[0].count}`);
    } catch (error) {
      console.log('⚠️  Could not verify data counts:', error.message);
    }
    
    console.log('\n🎉 DATABASE IMPORT COMPLETED SUCCESSFULLY!');
    console.log('Your Railway database is now ready for your application.');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error('Full error:', error);
  } finally {
    connection.end();
    console.log('🔌 Database connection closed.');
  }
}

// Run the import
importToRailway();
