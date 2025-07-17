const axios = require('axios');

const API_BASE_URL = 'https://infrastructure-management-system-production.up.railway.app/api';

async function checkCurrentState() {
  try {
    console.log('🔍 Checking current database state...');
    
    console.log('\n📋 TDL sites:');
    const tdlResponse = await axios.get(`${API_BASE_URL}/tdl`);
    tdlResponse.data.forEach(tdl => {
      console.log(`  ${tdl.id} (${typeof tdl.id}) - ${tdl.region}`);
    });
    
    console.log('\n⚡ AC equipment:');
    const acResponse = await axios.get(`${API_BASE_URL}/ac`);
    acResponse.data.forEach(ac => {
      console.log(`  ${ac.nom}: TDL_id = ${ac.TDL_id} (${typeof ac.TDL_id})`);
    });
    
    console.log('\n🔗 Matching test:');
    tdlResponse.data.forEach(tdl => {
      const matches = acResponse.data.filter(ac => ac.TDL_id === tdl.id);
      console.log(`  TDL ${tdl.id}: ${matches.length} AC equipment`);
      matches.forEach(ac => console.log(`    - ${ac.nom}`));
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkCurrentState();
