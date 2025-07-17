const mysql = require('mysql2');
require('dotenv').config();

// Database connection configuration - same as backend
let connectionConfig;

if (process.env.DATABASE_URL) {
  try {
    // Parse DATABASE_URL (format: mysql://user:password@host:port/database)
    const url = new URL(process.env.DATABASE_URL);
    connectionConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading '/'
      multipleStatements: true
    };
    
    console.log('Using DATABASE_URL connection to:', url.hostname);
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    throw error;
  }
} else {
  // Fallback to individual environment variables
  connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'infrastructure_db',
    port: parseInt(process.env.DB_PORT) || 3306,
    multipleStatements: true
  };
  
  console.log('Using individual env vars connection to:', connectionConfig.host);
}

const connection = mysql.createConnection(connectionConfig);

async function addTestData() {
  try {
    console.log('🔌 Connecting to database...');
    
    // First, let's add some basic suppliers and manufacturers if they don't exist
    console.log('📦 Adding test suppliers and manufacturers...');
    
    await connection.promise().execute(`
      INSERT IGNORE INTO Fournisseurs (num, nom, Contact, courriel) VALUES 
      (1001, 'TechSupply France', 'Jean Dupont', 'contact@techsupply.fr'),
      (1002, 'ElectroDistrib', 'Marie Martin', 'info@electrodistrib.fr')
    `);
    
    await connection.promise().execute(`
      INSERT IGNORE INTO Fabricant (num, nom, Contact, courriel) VALUES 
      (2001, 'Schneider Electric', 'Support Technique', 'support@schneider-electric.fr'),
      (2002, 'APC by Schneider', 'Service Client', 'service@apc.fr')
    `);
    
    console.log('⚡ Adding 2 test AC equipment entries...');
    
    // Add 2 AC Equipment entries
    const acEquipment1 = {
      nom: 'UPS-DATACENTER-01',
      type: 'UPS',
      output_ac: 5000,
      TDL_id: 1,  // Reference to existing TDL
      TSF_id: 1,  // Reference to existing TSF
      Paire_id: 1,
      port_sw: 'GE0/1',
      gateway: '192.168.1.1',
      netmask: '255.255.255.0',
      date_inst: 2024,
      voltage: 230,
      phase: 3,
      puissance_tot: 5000,
      Bypass: 'Automatique',
      commentaire: 'UPS principal pour datacenter Paris - Test Equipment',
      ING: 1,
      modèle: 1001,  // Model as integer
      no_série: 2024001,  // Serial as integer
      fournisseur_id: 1001,
      fabricant_id: 2001,
      ip: '192.168.1.100',
      username: 'admin',
      password: 'secure123',
      OOD: 0,
      SLA: 99
    };
    
    const acEquipment2 = {
      nom: 'OND-BACKUP-02',
      type: 'OND',
      output_ac: 3000,
      TDL_id: 2,  // Reference to existing TDL
      TSF_id: 2,  // Reference to existing TSF
      Paire_id: 2,
      port_sw: 'GE0/2',
      gateway: '192.168.2.1',
      netmask: '255.255.255.0',
      date_inst: 2024,
      voltage: 230,
      phase: 1,
      puissance_tot: 3000,
      Bypass: 'Manuel',
      commentaire: 'Onduleur de secours Lyon - Test Equipment',
      ING: 2,
      modèle: 1002,  // Model as integer
      no_série: 2024002,  // Serial as integer
      fournisseur_id: 1002,
      fabricant_id: 2002,
      ip: '192.168.2.100',
      username: 'admin',
      password: 'secure456',
      OOD: 0,
      SLA: 95
    };
    
    await connection.promise().execute(`
      INSERT INTO AC (
        nom, type, output_ac, TDL_id, TSF_id, Paire_id, port_sw, gateway, netmask,
        date_inst, voltage, phase, puissance_tot, Bypass, commentaire, ING, modèle,
        no_série, fournisseur_id, fabricant_id, ip, username, password, OOD, SLA
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      acEquipment1.nom, acEquipment1.type, acEquipment1.output_ac, acEquipment1.TDL_id, 
      acEquipment1.TSF_id, acEquipment1.Paire_id, acEquipment1.port_sw, acEquipment1.gateway, 
      acEquipment1.netmask, acEquipment1.date_inst, acEquipment1.voltage, acEquipment1.phase, 
      acEquipment1.puissance_tot, acEquipment1.Bypass, acEquipment1.commentaire, acEquipment1.ING, 
      acEquipment1.modèle, acEquipment1.no_série, acEquipment1.fournisseur_id, acEquipment1.fabricant_id, 
      acEquipment1.ip, acEquipment1.username, acEquipment1.password, acEquipment1.OOD, acEquipment1.SLA
    ]);
    
    await connection.promise().execute(`
      INSERT INTO AC (
        nom, type, output_ac, TDL_id, TSF_id, Paire_id, port_sw, gateway, netmask,
        date_inst, voltage, phase, puissance_tot, Bypass, commentaire, ING, modèle,
        no_série, fournisseur_id, fabricant_id, ip, username, password, OOD, SLA
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      acEquipment2.nom, acEquipment2.type, acEquipment2.output_ac, acEquipment2.TDL_id, 
      acEquipment2.TSF_id, acEquipment2.Paire_id, acEquipment2.port_sw, acEquipment2.gateway, 
      acEquipment2.netmask, acEquipment2.date_inst, acEquipment2.voltage, acEquipment2.phase, 
      acEquipment2.puissance_tot, acEquipment2.Bypass, acEquipment2.commentaire, acEquipment2.ING, 
      acEquipment2.modèle, acEquipment2.no_série, acEquipment2.fournisseur_id, acEquipment2.fabricant_id, 
      acEquipment2.ip, acEquipment2.username, acEquipment2.password, acEquipment2.OOD, acEquipment2.SLA
    ]);
    
    console.log('📝 Adding 1 test Besoin (AC requirement for 2027)...');
    
    // Add 1 Besoin (requirement) for AC equipment set for 2027
    const besoinAC = {
      type: 'UPS',
      TDL_id: 3,  // Integer reference
      TSF_id: 2,  // Integer reference
      besoin_ac: 8000,  // 8kW AC requirement
      besoin_dc: 0,     // No DC requirement for this AC-only need
      besoin_gen: 0,    // No generator requirement
      besoin_clim: 2000, // 2kW HVAC requirement
      année_req: 2027,  // Required for 2027
      date_demande: 20250117, // Today's date as request date
      commentaire: 20270001,  // Numeric comment code (schema expects BIGINT)
      RU: 42  // Rack units
    };
    
    await connection.promise().execute(`
      INSERT INTO Besoin (
        type, TDL_id, TSF_id, besoin_ac, besoin_dc, besoin_gen, besoin_clim, 
        année_req, date_demande, commentaire, RU
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      besoinAC.type, besoinAC.TDL_id, besoinAC.TSF_id, besoinAC.besoin_ac, 
      besoinAC.besoin_dc, besoinAC.besoin_gen, besoinAC.besoin_clim, 
      besoinAC.année_req, besoinAC.date_demande, besoinAC.commentaire, besoinAC.RU
    ]);
    
    console.log('✅ Test data added successfully!');
    console.log('');
    console.log('📊 Summary of added test data:');
    console.log('  • 2 Fournisseurs (Suppliers): TechSupply France, ElectroDistrib');
    console.log('  • 2 Fabricants (Manufacturers): Schneider Electric, APC by Schneider');
    console.log('  • 2 AC Equipment:');
    console.log('    - UPS-DATACENTER-01 (UPS, 5kW, Paris)');
    console.log('    - OND-BACKUP-02 (OND, 3kW, Lyon)');
    console.log('  • 1 Besoin (Requirement):');
    console.log('    - UPS requirement for Marseille (8kW AC, 2027)');
    console.log('');
    console.log('🌐 You can now view this data in your French interface!');
    
  } catch (error) {
    console.error('❌ Error adding test data:', error);
  } finally {
    connection.end();
  }
}

// Run the script
addTestData();
