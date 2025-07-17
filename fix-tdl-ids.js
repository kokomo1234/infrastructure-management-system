const axios = require('axios');

const API_BASE_URL = 'https://infrastructure-management-system-production.up.railway.app/api';

async function fixTDLIds() {
  try {
    console.log('🔧 Fixing TDL_id mismatch in AC equipment...');
    
    // Get current AC equipment
    const acResponse = await axios.get(`${API_BASE_URL}/ac`);
    const acEquipment = acResponse.data;
    
    console.log('Current AC equipment:', acEquipment.map(ac => ({
      id: ac.id,
      nom: ac.nom,
      current_TDL_id: ac.TDL_id,
      type: typeof ac.TDL_id
    })));
    
    // Update each AC equipment to use correct string TDL_id
    for (const ac of acEquipment) {
      let newTDLId;
      
      // Map numeric TDL_id to string TDL_id
      if (ac.TDL_id === 1) {
        newTDLId = 'T1';  // Both our test equipment should link to T1
      } else if (ac.TDL_id === 2) {
        newTDLId = 'T2';
      } else if (ac.TDL_id === 3) {
        newTDLId = 'T3';
      } else {
        console.log(`⚠️  Unknown TDL_id: ${ac.TDL_id} for ${ac.nom}`);
        continue;
      }
      
      // Prepare complete update payload with all required fields
      const updatedAC = {
        nom: ac.nom,
        type: ac.type,
        output_ac: ac.output_ac,
        TDL_id: newTDLId,  // Change to string ID
        TSF_id: ac.TSF_id,
        Paire_id: ac.Paire_id,
        port_sw: ac.port_sw,
        gateway: ac.gateway,
        netmask: ac.netmask,
        date_inst: ac.date_inst,
        voltage: ac.voltage,
        phase: ac.phase,
        puissance_tot: ac.puissance_tot,
        Bypass: ac.Bypass,
        commentaire: ac.commentaire,
        ING: ac.ING,
        modèle: ac.modèle,
        no_série: ac.no_série,
        fournisseur_id: ac.fournisseur_id,
        fabricant_id: ac.fabricant_id,
        ip: ac.ip,
        username: ac.username,
        password: ac.password,
        OOD: ac.OOD,
        SLA: ac.SLA
      };
      
      try {
        await axios.put(`${API_BASE_URL}/ac/${ac.id}`, updatedAC);
        console.log(`✅ Updated ${ac.nom}: TDL_id ${ac.TDL_id} → ${newTDLId}`);
      } catch (error) {
        console.log(`❌ Failed to update ${ac.nom}:`, error.response?.data?.error || error.message);
        if (error.response?.data) {
          console.log('Response data:', error.response.data);
        }
      }
    }
    
    console.log('\n🔍 Verifying updates...');
    const updatedResponse = await axios.get(`${API_BASE_URL}/ac`);
    console.log('Updated AC equipment:', updatedResponse.data.map(ac => ({
      id: ac.id,
      nom: ac.nom,
      TDL_id: ac.TDL_id,
      type: typeof ac.TDL_id
    })));
    
    // Test the matching after update
    console.log('\n🔍 Testing TDL matching after update...');
    const tdlResponse = await axios.get(`${API_BASE_URL}/tdl`);
    tdlResponse.data.forEach(tdl => {
      const matchingAC = updatedResponse.data.filter(ac => ac.TDL_id === tdl.id);
      console.log(`TDL ${tdl.id} (${tdl.region}): ${matchingAC.length} AC equipment`);
      matchingAC.forEach(ac => console.log(`  - ${ac.nom} (${ac.output_ac}W)`));
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixTDLIds();
