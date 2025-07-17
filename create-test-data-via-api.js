const axios = require('axios');

// Your deployed Railway API URL
const API_BASE_URL = 'https://infrastructure-management-system-production.up.railway.app/api';

async function createTestDataViaAPI() {
  try {
    console.log('🌐 Creating test data via API...');
    console.log(`📡 API Base URL: ${API_BASE_URL}`);
    
    // First, create suppliers (Fournisseurs)
    console.log('\n📦 Creating test suppliers...');
    
    const supplier1 = {
      num: 1001,
      nom: 'TechSupply France',
      Contact: 'Jean Dupont',
      courriel: 'contact@techsupply.fr'
    };
    
    const supplier2 = {
      num: 1002,
      nom: 'ElectroDistrib',
      Contact: 'Marie Martin',
      courriel: 'info@electrodistrib.fr'
    };
    
    try {
      const supplier1Response = await axios.post(`${API_BASE_URL}/fournisseurs`, supplier1);
      console.log(`✅ Created supplier: ${supplier1.nom} (ID: ${supplier1Response.data.id})`);
    } catch (error) {
      if (error.response?.status === 500 && error.response?.data?.error?.includes('Duplicate')) {
        console.log(`ℹ️  Supplier ${supplier1.nom} already exists`);
      } else {
        console.log(`⚠️  Error creating supplier ${supplier1.nom}:`, error.response?.data?.error || error.message);
      }
    }
    
    try {
      const supplier2Response = await axios.post(`${API_BASE_URL}/fournisseurs`, supplier2);
      console.log(`✅ Created supplier: ${supplier2.nom} (ID: ${supplier2Response.data.id})`);
    } catch (error) {
      if (error.response?.status === 500 && error.response?.data?.error?.includes('Duplicate')) {
        console.log(`ℹ️  Supplier ${supplier2.nom} already exists`);
      } else {
        console.log(`⚠️  Error creating supplier ${supplier2.nom}:`, error.response?.data?.error || error.message);
      }
    }
    
    // Create manufacturers (Fabricant)
    console.log('\n🏭 Creating test manufacturers...');
    
    const manufacturer1 = {
      num: 2001,
      nom: 'Schneider Electric',
      Contact: 'Support Technique',
      courriel: 'support@schneider-electric.fr'
    };
    
    const manufacturer2 = {
      num: 2002,
      nom: 'APC by Schneider',
      Contact: 'Service Client',
      courriel: 'service@apc.fr'
    };
    
    try {
      const mfg1Response = await axios.post(`${API_BASE_URL}/fabricant`, manufacturer1);
      console.log(`✅ Created manufacturer: ${manufacturer1.nom} (ID: ${mfg1Response.data.id})`);
    } catch (error) {
      if (error.response?.status === 500 && error.response?.data?.error?.includes('Duplicate')) {
        console.log(`ℹ️  Manufacturer ${manufacturer1.nom} already exists`);
      } else {
        console.log(`⚠️  Error creating manufacturer ${manufacturer1.nom}:`, error.response?.data?.error || error.message);
      }
    }
    
    try {
      const mfg2Response = await axios.post(`${API_BASE_URL}/fabricant`, manufacturer2);
      console.log(`✅ Created manufacturer: ${manufacturer2.nom} (ID: ${mfg2Response.data.id})`);
    } catch (error) {
      if (error.response?.status === 500 && error.response?.data?.error?.includes('Duplicate')) {
        console.log(`ℹ️  Manufacturer ${manufacturer2.nom} already exists`);
      } else {
        console.log(`⚠️  Error creating manufacturer ${manufacturer2.nom}:`, error.response?.data?.error || error.message);
      }
    }
    
    // Create AC Equipment
    console.log('\n⚡ Creating AC equipment...');
    
    const acEquipment1 = {
      nom: 'UPS-DATACENTER-01',
      type: 'UPS',
      output_ac: 5000,
      TDL_id: 1,
      TSF_id: 1,
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
      modèle: 1001,
      no_série: 2024001,
      fournisseur_id: 1001,
      fabricant_id: 2001,
      ip: '192.168.1.100',
      username: 'admin',
      password: 'secure123',
      OOD: false,
      SLA: 99
    };
    
    const acEquipment2 = {
      nom: 'OND-BACKUP-02',
      type: 'OND',
      output_ac: 3000,
      TDL_id: 2,
      TSF_id: 2,
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
      modèle: 1002,
      no_série: 2024002,
      fournisseur_id: 1002,
      fabricant_id: 2002,
      ip: '192.168.2.100',
      username: 'admin',
      password: 'secure456',
      OOD: false,
      SLA: 95
    };
    
    try {
      const ac1Response = await axios.post(`${API_BASE_URL}/ac`, acEquipment1);
      console.log(`✅ Created AC equipment: ${acEquipment1.nom} (ID: ${ac1Response.data.id})`);
    } catch (error) {
      console.log(`❌ Error creating AC equipment ${acEquipment1.nom}:`, error.response?.data?.error || error.message);
      if (error.response?.data) {
        console.log('Response data:', error.response.data);
      }
    }
    
    try {
      const ac2Response = await axios.post(`${API_BASE_URL}/ac`, acEquipment2);
      console.log(`✅ Created AC equipment: ${acEquipment2.nom} (ID: ${ac2Response.data.id})`);
    } catch (error) {
      console.log(`❌ Error creating AC equipment ${acEquipment2.nom}:`, error.response?.data?.error || error.message);
      if (error.response?.data) {
        console.log('Response data:', error.response.data);
      }
    }
    
    // Create Besoin (Requirement)
    console.log('\n📝 Creating Besoin (requirement)...');
    
    const besoinAC = {
      type: 'UPS',
      TDL_id: 3,
      TSF_id: 2,
      besoin_ac: 8000,
      besoin_dc: 0,
      besoin_gen: 0,
      besoin_clim: 2000,
      année_req: 2027,
      date_demande: 20250117,
      commentaire: 20270001,
      RU: 42
    };
    
    try {
      const besoinResponse = await axios.post(`${API_BASE_URL}/besoin`, besoinAC);
      console.log(`✅ Created Besoin: UPS requirement for 2027 (ID: ${besoinResponse.data.id})`);
    } catch (error) {
      console.log(`❌ Error creating Besoin:`, error.response?.data?.error || error.message);
      if (error.response?.data) {
        console.log('Response data:', error.response.data);
      }
    }
    
    console.log('\n🎉 Test data creation completed!');
    console.log('\n📊 Summary:');
    console.log('  • 2 Fournisseurs (Suppliers): TechSupply France, ElectroDistrib');
    console.log('  • 2 Fabricants (Manufacturers): Schneider Electric, APC by Schneider');
    console.log('  • 2 AC Equipment: UPS-DATACENTER-01, OND-BACKUP-02');
    console.log('  • 1 Besoin (Requirement): UPS for 2027');
    console.log('\n🌐 You can now view this data in your French interface!');
    console.log(`🔗 Frontend URL: Check your Netlify deployment`);
    console.log(`🔗 API URL: ${API_BASE_URL}`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the script
createTestDataViaAPI();
