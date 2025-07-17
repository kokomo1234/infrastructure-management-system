const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1308',
  database: 'infrastructure_db'
});

async function fixTSFTable() {
  try {
    console.log('Creating TSF table...');
    
    // Create TSF table
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
    
    console.log('✓ TSF table created successfully');
    
    // Now add sample data for both TDL and TSF
    console.log('Adding sample TSF data...');
    
    const tsfData = [
      {
        id: 'S1',
        region: 'Montreal',
        salle: true,
        esp_plan: 80.0,
        nb_cab: 6,
        charge_ac: 3000,
        charge_dc: 1200,
        charge_gen: 4500,
        charge_clim: 1800,
        adresse: 100
      },
      {
        id: 'S2',
        region: 'Quebec City',
        salle: false,
        esp_plan: 100.0,
        nb_cab: 10,
        charge_ac: 4500,
        charge_dc: 1800,
        charge_gen: 6500,
        charge_clim: 2200,
        adresse: 200
      }
    ];

    for (const tsf of tsfData) {
      await connection.promise().execute(`
        INSERT INTO TSF (id, region, salle, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [tsf.id, tsf.region, tsf.salle, tsf.esp_plan, tsf.nb_cab, tsf.charge_ac, tsf.charge_dc, tsf.charge_gen, tsf.charge_clim, tsf.adresse]);
      
      console.log(`✓ Added TSF facility: ${tsf.id} - ${tsf.region}`);
    }

    // Add manufacturers
    console.log('Adding manufacturers...');
    const fabricantData = [
      { num: 1001, nom: 'Schneider Electric', Contact: 'John Smith', courriel: 'john.smith@schneider.com' },
      { num: 1002, nom: 'ABB Group', Contact: 'Marie Dubois', courriel: 'marie.dubois@abb.com' },
      { num: 1003, nom: 'Siemens', Contact: 'Hans Mueller', courriel: 'hans.mueller@siemens.com' }
    ];

    for (const fabricant of fabricantData) {
      try {
        await connection.promise().execute(`
          INSERT INTO Fabricant (num, nom, Contact, courriel)
          VALUES (?, ?, ?, ?)
        `, [fabricant.num, fabricant.nom, fabricant.Contact, fabricant.courriel]);
        
        console.log(`✓ Added manufacturer: ${fabricant.nom}`);
      } catch (error) {
        if (!error.message.includes('Duplicate entry')) {
          console.log(`⚠ Warning: ${error.message}`);
        }
      }
    }

    // Add suppliers
    console.log('Adding suppliers...');
    const fournisseurData = [
      { num: 2001, nom: 'TechSupply Inc', Contact: 'Sarah Johnson', courriel: 'sarah@techsupply.com' },
      { num: 2002, nom: 'PowerSolutions Ltd', Contact: 'Mike Wilson', courriel: 'mike@powersolutions.com' }
    ];

    for (const fournisseur of fournisseurData) {
      try {
        await connection.promise().execute(`
          INSERT INTO Fournisseurs (num, nom, Contact, courriel)
          VALUES (?, ?, ?, ?)
        `, [fournisseur.num, fournisseur.nom, fournisseur.Contact, fournisseur.courriel]);
        
        console.log(`✓ Added supplier: ${fournisseur.nom}`);
      } catch (error) {
        if (!error.message.includes('Duplicate entry')) {
          console.log(`⚠ Warning: ${error.message}`);
        }
      }
    }

    console.log('\n✅ All sample data added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.end();
  }
}

fixTSFTable();
