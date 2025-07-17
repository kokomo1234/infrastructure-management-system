import React from 'react';
import DataManager from './DataManager';

const BesoinManager = () => {
  const fields = [
    { 
      name: 'type', 
      label: 'Type', 
      type: 'select', 
      required: true, 
      colSize: 6,
      options: [
        { value: 'OND', label: 'OND' },
        { value: 'UPS', label: 'UPS' }
      ]
    },
    { name: 'TDL_id', label: 'ID TDL', type: 'text', required: true, colSize: 6 },
    { name: 'TSF_id', label: 'ID TSF', type: 'text', required: true, colSize: 6 },
    { name: 'besoin_ac', label: 'Besoin AC (W)', type: 'number', required: true, colSize: 6 },
    { name: 'besoin_dc', label: 'Besoin DC (W)', type: 'number', required: true, colSize: 6 },
    { name: 'besoin_gen', label: 'Besoin Générateur (W)', type: 'number', required: true, colSize: 6 },
    { name: 'besoin_clim', label: 'Besoin Climatisation (W)', type: 'number', required: true, colSize: 6 },
    { name: 'année_req', label: 'Année Requise', type: 'number', required: true, colSize: 6 },
    { name: 'date_demande', label: 'Date de Demande', type: 'number', required: true, colSize: 6 },
    { name: 'commentaire', label: 'Commentaires', type: 'number', colSize: 6 },
    { name: 'RU', label: 'RU', type: 'number', required: true, colSize: 6 }
  ];

  const displayFields = [
    { key: 'id', label: 'ID' },
    { key: 'type', label: 'Type' },
    { key: 'TDL_id', label: 'ID TDL' },
    { key: 'TSF_id', label: 'ID TSF' },
    { key: 'besoin_ac', label: 'Besoin AC (W)' },
    { key: 'besoin_dc', label: 'Besoin DC (W)' },
    { key: 'année_req', label: 'Année Requise' }
  ];

  return (
    <DataManager
      title="Gestion des Besoins"
      endpoint="besoin"
      fields={fields}
      displayFields={displayFields}
      createTitle="Ajouter un Nouveau Besoin"
      editTitle="Modifier le Besoin"
    />
  );
};

export default BesoinManager;
