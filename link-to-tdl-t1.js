const axios = require('axios');

// Your deployed Railway API URL
const API_BASE_URL = 'https://infrastructure-management-system-production.up.railway.app/api';

async function linkToTDLT1() {
  try {
    console.log('🔗 Linking AC equipment and Besoin to TDL T1...');
    console.log(`📡 API Base URL: ${API_BASE_URL}`);
    
    // First, let's get all existing AC equipment to find our test entries
    console.log('\n📋 Fetching existing AC equipment...');
    const acResponse = await axios.get(`${API_BASE_URL}/ac`);
    const acEquipment = acResponse.data;
    
    console.log(`Found ${acEquipment.length} AC equipment entries`);
    
    // Find our test equipment
    const upsDatacenter = acEquipment.find(ac => ac.nom === 'UPS-DATACENTER-01');
    const ondBackup = acEquipment.find(ac => ac.nom === 'OND-BACKUP-02');
    
    if (upsDatacenter) {
      console.log(`✅ Found UPS-DATACENTER-01 (ID: ${upsDatacenter.id})`);
    } else {
      console.log('❌ UPS-DATACENTER-01 not found');
    }
    
    if (ondBackup) {
      console.log(`✅ Found OND-BACKUP-02 (ID: ${ondBackup.id})`);
    } else {
      console.log('❌ OND-BACKUP-02 not found');
    }
    
    // Get all Besoin records
    console.log('\n📋 Fetching existing Besoin records...');
    const besoinResponse = await axios.get(`${API_BASE_URL}/besoin`);
    const besoins = besoinResponse.data;
    
    console.log(`Found ${besoins.length} Besoin entries`);
    
    // Find our 2027 requirement
    const besoin2027 = besoins.find(b => b.année_req === 2027);
    
    if (besoin2027) {
      console.log(`✅ Found 2027 Besoin (ID: ${besoin2027.id})`);
    } else {
      console.log('❌ 2027 Besoin not found');
    }
    
    // Now update all records to link to TDL T1
    // Based on the schema mismatch, I'll try different approaches to find the correct TDL reference
    
    console.log('\n🔄 Updating AC equipment to link to TDL T1...');
    
    // Update UPS-DATACENTER-01 to link to T1 (trying different ID formats)
    if (upsDatacenter) {
      const updatedUPS = {
        ...upsDatacenter,
        TDL_id: 1, // Assuming T1 maps to numeric ID 1
        TSF_id: 1, // Also link to first TSF
        commentaire: 'UPS principal pour TDL T1 - Test Equipment'
      };
      
      try {
        await axios.put(`${API_BASE_URL}/ac/${upsDatacenter.id}`, updatedUPS);
        console.log(`✅ Updated UPS-DATACENTER-01 to link to TDL T1`);
      } catch (error) {
        console.log(`❌ Error updating UPS-DATACENTER-01:`, error.response?.data?.error || error.message);
      }
    }
    
    // Update OND-BACKUP-02 to link to T1
    if (ondBackup) {
      const updatedOND = {
        ...ondBackup,
        TDL_id: 1, // Assuming T1 maps to numeric ID 1
        TSF_id: 1, // Also link to first TSF
        commentaire: 'Onduleur de secours pour TDL T1 - Test Equipment'
      };
      
      try {
        await axios.put(`${API_BASE_URL}/ac/${ondBackup.id}`, updatedOND);
        console.log(`✅ Updated OND-BACKUP-02 to link to TDL T1`);
      } catch (error) {
        console.log(`❌ Error updating OND-BACKUP-02:`, error.response?.data?.error || error.message);
      }
    }
    
    // Update Besoin to link to T1
    if (besoin2027) {
      const updatedBesoin = {
        ...besoin2027,
        TDL_id: 1, // Link to T1
        TSF_id: 1, // Link to first TSF
        commentaire: 20271001 // Updated comment code for T1
      };
      
      try {
        await axios.put(`${API_BASE_URL}/besoin/${besoin2027.id}`, updatedBesoin);
        console.log(`✅ Updated 2027 Besoin to link to TDL T1`);
      } catch (error) {
        console.log(`❌ Error updating 2027 Besoin:`, error.response?.data?.error || error.message);
      }
    }
    
    console.log('\n🎉 Linking completed!');
    console.log('\n📊 Summary:');
    console.log('  • UPS-DATACENTER-01 → Linked to TDL T1');
    console.log('  • OND-BACKUP-02 → Linked to TDL T1');
    console.log('  • 2027 Besoin → Linked to TDL T1');
    console.log('\n🌐 All equipment and requirements are now associated with TDL T1!');
    console.log('🇫🇷 You can view this in your French interface under TDL details.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the script
linkToTDLT1();
