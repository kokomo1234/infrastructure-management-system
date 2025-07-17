const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Railway MySQL connection - replace with your actual values
const connection = mysql.createConnection({
  host: 'REPLACE_WITH_RAILWAY_PRIVATE_DOMAIN', // Get this from Railway
  user: 'root',
  password: 'PzdjOYlzgydxDdTHZcMGsqKcLWYLbhQA',
  database: 'railway',
  port: 3306
});

async function setupRailwayDatabase() {
  try {
    console.log('Connecting to Railway MySQL...');
    
    // Read the SQL file and split by semicolons
    const sqlFile = path.join(__dirname, 'drawSQL-mysql-export-2025-07-16.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL commands and filter out empty ones
    const sqlCommands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`Executing ${sqlCommands.length} SQL commands...`);
    
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      if (command.trim()) {
        try {
          await connection.promise().execute(command);
          console.log(`✓ Command ${i + 1}/${sqlCommands.length} executed`);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.log(`⚠ Warning on command ${i + 1}: ${error.message}`);
          }
        }
      }
    }
    
    // Create TSF table manually (since it had issues before)
    try {
      await connection.promise().execute(`
        CREATE TABLE IF NOT EXISTS TSF (
          id CHAR(2) NOT NULL,
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
          PRIMARY KEY(id),
          KEY(salle_id)
        )
      `);
      console.log('✓ TSF table created');
    } catch (error) {
      console.log('⚠ TSF table warning:', error.message);
    }
    
    // Add sample data
    console.log('Adding sample data...');
    
    // TDL sample data
    const tdlData = [
      ['T1', 'Montreal', true, 150.5, 12, 5000, 2000, 8000, 3000, 123, 456, 789],
      ['T2', 'Quebec City', false, 200.0, 18, 7500, 3000, 12000, 4500, 321, 654, 987],
      ['T3', 'Sherbrooke', true, 120.0, 8, 4000, 1500, 6000, 2500, 555, 777, 111]
    ];

    for (const tdl of tdlData) {
      try {
        await connection.promise().execute(`
          INSERT IGNORE INTO TDL (id, region, SDS, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse, ville, code_postal)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, tdl);
        console.log(`✓ Added TDL: ${tdl[0]}`);
      } catch (error) {
        console.log(`⚠ TDL warning: ${error.message}`);
      }
    }

    // TSF sample data
    const tsfData = [
      ['S1', 'Montreal', true, 80.0, 6, 3000, 1200, 4500, 1800, 100],
      ['S2', 'Quebec City', false, 100.0, 10, 4500, 1800, 6500, 2200, 200]
    ];

    for (const tsf of tsfData) {
      try {
        await connection.promise().execute(`
          INSERT IGNORE INTO TSF (id, region, salle, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, tsf);
        console.log(`✓ Added TSF: ${tsf[0]}`);
      } catch (error) {
        console.log(`⚠ TSF warning: ${error.message}`);
      }
    }

    // Test the connection by listing tables
    const [tables] = await connection.promise().execute('SHOW TABLES');
    console.log('\nTables in Railway database:');
    tables.forEach(table => {
      console.log(`- ${Object.values(table)[0]}`);
    });
    
    console.log('\n✅ Railway database setup completed successfully!');
    console.log('Your backend should now be able to connect to the database.');
    
  } catch (error) {
    console.error('❌ Error setting up Railway database:', error.message);
  } finally {
    connection.end();
  }
}

setupRailwayDatabase();
