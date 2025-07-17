import React from 'react';
import DataManager from './DataManager';

const TDLManager = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'text', required: true, colSize: 6 },
    { name: 'region', label: 'Région', type: 'text', required: true, colSize: 6 },
    { name: 'SDS', label: 'SDS', type: 'checkbox', colSize: 6 },
    { name: 'esp_plan', label: 'Surface au Sol (m²)', type: 'number', step: '0.01', required: true, colSize: 6 },
    { name: 'nb_cab', label: 'Nombre d\'Armoires', type: 'number', required: true, colSize: 6 },
    { name: 'charge_ac', label: 'Charge AC (W)', type: 'number', required: true, colSize: 6 },
    { name: 'charge_dc', label: 'Charge DC (W)', type: 'number', required: true, colSize: 6 },
    { name: 'charge_gen', label: 'Charge Générateur (W)', type: 'number', required: true, colSize: 6 },
    { name: 'charge_clim', label: 'Charge HVAC (W)', type: 'number', required: true, colSize: 6 },
    { name: 'adresse', label: 'Adresse', type: 'number', required: true, colSize: 4 },
    { name: 'ville', label: 'Ville', type: 'number', required: true, colSize: 4 },
    { name: 'code_postal', label: 'Code Postal', type: 'number', required: true, colSize: 4 }
  ];

  const displayFields = [
    { key: 'id', label: 'ID' },
    { key: 'region', label: 'Région' },
    { key: 'SDS', label: 'SDS', render: (value) => value ? 'Oui' : 'Non' },
    { key: 'esp_plan', label: 'Surface au Sol (m²)' },
    { key: 'nb_cab', label: 'Armoires' },
    { key: 'charge_ac', label: 'Charge AC (W)' },
    { key: 'charge_dc', label: 'Charge DC (W)' }
  ];

  return (
    <DataManager
      title="Gestion des Sites TDL"
      endpoint="tdl"
      fields={fields}
      displayFields={displayFields}
      idField="id"
      createTitle="Ajouter un Nouveau Site TDL"
      editTitle="Modifier le Site TDL"
    />
  );
};

export default TDLManager;
