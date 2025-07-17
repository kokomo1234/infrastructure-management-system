import React from 'react';
import DataManager from './DataManager';

const TSFManager = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'text', required: true, colSize: 6 },
    { name: 'region', label: 'Region', type: 'text', required: true, colSize: 6 },
    { name: 'salle', label: 'Has Room', type: 'checkbox', colSize: 6 },
    { name: 'esp_plan', label: 'Floor Space (m²)', type: 'number', step: '0.01', required: true, colSize: 6 },
    { name: 'nb_cab', label: 'Number of Cabinets', type: 'number', required: true, colSize: 6 },
    { name: 'charge_ac', label: 'AC Load (W)', type: 'number', required: true, colSize: 6 },
    { name: 'charge_dc', label: 'DC Load (W)', type: 'number', required: true, colSize: 6 },
    { name: 'charge_gen', label: 'Generator Load (W)', type: 'number', required: true, colSize: 6 },
    { name: 'charge_clim', label: 'HVAC Load (W)', type: 'number', required: true, colSize: 6 },
    { name: 'adresse', label: 'Address', type: 'number', required: true, colSize: 6 }
  ];

  const displayFields = [
    { key: 'id', label: 'ID' },
    { key: 'region', label: 'Region' },
    { key: 'salle', label: 'Has Room', render: (value) => value ? 'Yes' : 'No' },
    { key: 'esp_plan', label: 'Floor Space (m²)' },
    { key: 'nb_cab', label: 'Cabinets' },
    { key: 'charge_ac', label: 'AC Load (W)' },
    { key: 'charge_dc', label: 'DC Load (W)' }
  ];

  return (
    <DataManager
      title="TSF Facilities Management"
      endpoint="tsf"
      fields={fields}
      displayFields={displayFields}
      idField="id"
      createTitle="Add New TSF Facility"
      editTitle="Edit TSF Facility"
    />
  );
};

export default TSFManager;
