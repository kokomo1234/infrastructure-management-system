const axios = require('axios');

const API_BASE_URL = 'https://infrastructure-management-system-production.up.railway.app/api';

async function updateAcTdlIds() {
  try {
    console.log('🔧 Updating AC equipment TDL_id values via API...');
    
    // Get current AC equipment
    const acResponse = await axios.get(`${API_BASE_URL}/ac`);
    const acEquipment = acResponse.data;
    
    console.log('\n📊 Current AC equipment:');
    acEquipment.forEach(ac => {
      console.log(`  ${ac.nom}: TDL_id = ${ac.TDL_id} (${typeof ac.TDL_id})`);
    });
    
    // Update each AC equipment
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
      
      // Create update payload with only the TDL_id change
      const updateData = {
        TDL_id: newTDLId
      };
      
      try {
        // Use PATCH instead of PUT to update only specific fields
        const response = await axios.patch(`${API_BASE_URL}/ac/${ac.id}`, updateData);
        console.log(`✅ Updated ${ac.nom}: TDL_id ${ac.TDL_id} → ${newTDLId}`);
      } catch (error) {
        // If PATCH doesn't work, try PUT with full data
        try {
          const fullUpdateData = {
            nom: ac.nom,
            type: ac.type,
            output_ac: ac.output_ac,
            TDL_id: newTDLId,
            TSF_id: ac.TSF_id || 1,
            Paire_id: ac.Paire_id || 1,
            port_sw: ac.port_sw || 'GE0/1',
            gateway: ac.gateway || '192.168.1.1',
            netmask: ac.netmask || '255.255.255.0',
            date_inst: ac.date_inst || 2024,
            voltage: ac.voltage || 230,
            phase: ac.phase || 1,
            puissance_tot: ac.puissance_tot || ac.output_ac,
            Bypass: ac.Bypass || 'Automatique',
            commentaire: ac.commentaire || 'Updated via API',
            ING: ac.ING || 1,
            modèle: ac.modèle || 1001,
            no_série: ac.no_série || 2024001,
            fournisseur_id: ac.fournisseur_id || 1001,
            fabricant_id: ac.fabricant_id || 2001,
            ip: ac.ip || '192.168.1.100',
            username: ac.username || 'user',
            password: ac.password || 'secure123',
            OOD: ac.OOD || false,
            SLA: ac.SLA || 99
          };
          
          await axios.put(`${API_BASE_URL}/ac/${ac.id}`, fullUpdateData);
          console.log(`✅ Updated ${ac.nom} with PUT: TDL_id ${ac.TDL_id} → ${newTDLId}`);
        } catch (putError) {
          console.log(`❌ Failed to update ${ac.nom}:`, putError.response?.data?.error || putError.message);
        }
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
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateAcTdlIds();
