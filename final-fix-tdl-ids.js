const axios = require('axios');

const API_BASE_URL = 'https://infrastructure-management-system-production.up.railway.app/api';

async function finalFixTdlIds() {
  try {
    console.log('🔧 Final fix: Updating AC equipment TDL_id values...');
    
    // Get current AC equipment with full details
    const acResponse = await axios.get(`${API_BASE_URL}/ac`);
    const acEquipment = acResponse.data;
    
    console.log('\n📊 Current AC equipment:');
    acEquipment.forEach(ac => {
      console.log(`  ${ac.nom}: TDL_id = ${ac.TDL_id} (${typeof ac.TDL_id})`);
    });
    
    // Update each AC equipment with complete data
    for (const ac of acEquipment) {
      let newTDLId;
      
      // Map numeric TDL_id to string TDL_id
      if (ac.TDL_id === 1) {
        newTDLId = 'T1';
      } else if (ac.TDL_id === 2) {
        newTDLId = 'T2';
      } else if (ac.TDL_id === 3) {
        newTDLId = 'T3';
      } else {
        console.log(`⚠️  Unknown TDL_id: ${ac.TDL_id} for ${ac.nom}`);
        continue;
      }
      
      // Create complete update payload with all required fields
      const updateData = {
        nom: ac.nom,
        type: ac.type,
        output_ac: ac.output_ac,
        TDL_id: newTDLId,  // This is the key change
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
      
      console.log(`\n🔄 Updating ${ac.nom}...`);
      console.log(`  Current TDL_id: ${ac.TDL_id} (${typeof ac.TDL_id})`);
      console.log(`  New TDL_id: ${newTDLId} (${typeof newTDLId})`);
      
      try {
        const response = await axios.put(`${API_BASE_URL}/ac/${ac.id}`, updateData);
        console.log(`✅ Successfully updated ${ac.nom}`);
      } catch (error) {
        console.log(`❌ Failed to update ${ac.nom}:`);
        console.log(`   Error: ${error.response?.data?.error || error.message}`);
        if (error.response?.data) {
          console.log(`   Response:`, error.response.data);
        }
        
        // Log the payload for debugging
        console.log(`   Payload keys:`, Object.keys(updateData));
        console.log(`   Sample payload:`, {
          nom: updateData.nom,
          type: updateData.type,
          TDL_id: updateData.TDL_id,
          output_ac: updateData.output_ac
        });
      }
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const updatedResponse = await axios.get(`${API_BASE_URL}/ac`);
    
    console.log('\n📊 Updated AC equipment:');
    updatedResponse.data.forEach(ac => {
      console.log(`  ${ac.nom}: TDL_id = ${ac.TDL_id} (${typeof ac.TDL_id})`);
    });
    
    // Test matching
    console.log('\n🔗 Testing TDL-AC matching:');
    const tdlResponse = await axios.get(`${API_BASE_URL}/tdl`);
    tdlResponse.data.forEach(tdl => {
      const matches = updatedResponse.data.filter(ac => ac.TDL_id === tdl.id);
      console.log(`  TDL ${tdl.id}: ${matches.length} AC equipment`);
      matches.forEach(ac => console.log(`    - ${ac.nom} (${ac.output_ac}W)`));
    });
    
    if (updatedResponse.data.some(ac => typeof ac.TDL_id === 'string')) {
      console.log('\n🎉 SUCCESS: TDL_id values are now strings!');
      console.log('✅ AC equipment should now appear in TDL detail pages');
    } else {
      console.log('\n❌ FAILED: TDL_id values are still numeric');
      console.log('⚠️  Manual database intervention may be required');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

finalFixTdlIds();
