import React from 'react';
import DataManager from './DataManager';

const DCManager = () => {
  const fields = [
    { 
      name: 'type', 
      label: 'Type', 
      type: 'select', 
      required: true, 
      colSize: 6,
      options: [
        { value: 'Batteries', label: 'Batteries' },
        { value: 'CBDB', label: 'CBDB' },
        { value: 'Système DC', label: 'DC System' }
      ]
    },
    { name: 'output_dc', label: 'DC Output (W)', type: 'number', required: true, colSize: 6 },
    { name: 'TDL_id', label: 'TDL ID', type: 'text', required: true, colSize: 6 },
    { name: 'TSF_id', label: 'TSF ID', type: 'text', required: true, colSize: 6 }
  ];

  const displayFields = [
    { key: 'id', label: 'ID' },
    { key: 'type', label: 'Type' },
    { key: 'output_dc', label: 'DC Output (W)' },
    { key: 'TDL_id', label: 'TDL ID' },
    { key: 'TSF_id', label: 'TSF ID' }
  ];

  return (
    <DataManager
      title="DC Equipment Management"
      endpoint="dc"
      fields={fields}
      displayFields={displayFields}
      createTitle="Add New DC Equipment"
      editTitle="Edit DC Equipment"
    />
  );
};

export default DCManager;
