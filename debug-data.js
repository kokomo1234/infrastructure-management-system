const axios = require('axios');

const API_BASE_URL = 'https://infrastructure-management-system-production.up.railway.app/api';

async function checkData() {
  try {
    console.log('🔍 Checking TDL data...');
    const tdlResponse = await axios.get(`${API_BASE_URL}/tdl`);
    console.log('TDL sites:', tdlResponse.data.map(t => ({ 
      id: t.id, 
      id_type: typeof t.id,
      region: t.region 
    })));
    
    console.log('\n🔍 Checking AC equipment data...');
    const acResponse = await axios.get(`${API_BASE_URL}/ac`);
    console.log('AC equipment:', acResponse.data.map(ac => ({ 
      id: ac.id, 
      nom: ac.nom, 
      TDL_id: ac.TDL_id, 
      TDL_id_type: typeof ac.TDL_id,
      output_ac: ac.output_ac 
    })));
    
    console.log('\n🔍 Matching analysis:');
    tdlResponse.data.forEach(tdl => {
      const matchingAC = acResponse.data.filter(ac => ac.TDL_id == tdl.id);
      console.log(`TDL ${tdl.id} (${tdl.region}): ${matchingAC.length} AC equipment`);
      matchingAC.forEach(ac => console.log(`  - ${ac.nom} (${ac.output_ac}W)`));
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkData();
