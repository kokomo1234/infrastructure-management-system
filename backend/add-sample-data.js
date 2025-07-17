const mysql = require('mysql2');

// Database connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1308',
  database: 'infrastructure_db'
});

async function addSampleData() {
  try {
    console.log('Adding sample data to the database...');
    
    // Add sample TDL sites
    const tdlData = [
      {
        id: 'T1',
        region: 'Montreal',
        SDS: true,
        esp_plan: 150.5,
        nb_cab: 12,
        charge_ac: 5000,
        charge_dc: 2000,
        charge_gen: 8000,
        charge_clim: 3000,
        adresse: 123,
        ville: 456,
        code_postal: 789
      },
      {
        id: 'T2',
        region: 'Quebec City',
        SDS: false,
        esp_plan: 200.0,
        nb_cab: 18,
        charge_ac: 7500,
        charge_dc: 3000,
        charge_gen: 12000,
        charge_clim: 4500,
        adresse: 321,
        ville: 654,
        code_postal: 987
      },
      {
        id: 'T3',
        region: 'Sherbrooke',
        SDS: true,
        esp_plan: 120.0,
        nb_cab: 8,
        charge_ac: 4000,
        charge_dc: 1500,
        charge_gen: 6000,
        charge_clim: 2500,
        adresse: 555,
        ville: 777,
        code_postal: 111
      }
    ];

    for (const tdl of tdlData) {
      await connection.promise().execute(`
        INSERT INTO TDL (id, region, SDS, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse, ville, code_postal)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [tdl.id, tdl.region, tdl.SDS, tdl.esp_plan, tdl.nb_cab, tdl.charge_ac, tdl.charge_dc, tdl.charge_gen, tdl.charge_clim, tdl.adresse, tdl.ville, tdl.code_postal]);
      
      console.log(`✓ Added TDL site: ${tdl.id} - ${tdl.region}`);
    }

    // Add sample TSF facilities
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

    // Add sample manufacturers
    const fabricantData = [
      { num: 1001, nom: 'Schneider Electric', Contact: 'John Smith', courriel: 'john.smith@schneider.com' },
      { num: 1002, nom: 'ABB Group', Contact: 'Marie Dubois', courriel: 'marie.dubois@abb.com' },
      { num: 1003, nom: 'Siemens', Contact: 'Hans Mueller', courriel: 'hans.mueller@siemens.com' }
    ];

    for (const fabricant of fabricantData) {
      await connection.promise().execute(`
        INSERT INTO Fabricant (num, nom, Contact, courriel)
        VALUES (?, ?, ?, ?)
      `, [fabricant.num, fabricant.nom, fabricant.Contact, fabricant.courriel]);
      
      console.log(`✓ Added manufacturer: ${fabricant.nom}`);
    }

    // Add sample suppliers
    const fournisseurData = [
      { num: 2001, nom: 'TechSupply Inc', Contact: 'Sarah Johnson', courriel: 'sarah@techsupply.com' },
      { num: 2002, nom: 'PowerSolutions Ltd', Contact: 'Mike Wilson', courriel: 'mike@powersolutions.com' }
    ];

    for (const fournisseur of fournisseurData) {
      await connection.promise().execute(`
        INSERT INTO Fournisseurs (num, nom, Contact, courriel)
        VALUES (?, ?, ?, ?)
      `, [fournisseur.num, fournisseur.nom, fournisseur.Contact, fournisseur.courriel]);
      
      console.log(`✓ Added supplier: ${fournisseur.nom}`);
    }

    console.log('\n✅ Sample data added successfully!');
    console.log('You can now see the data in your web application.');
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error.message);
  } finally {
    connection.end();
  }
}

addSampleData();
