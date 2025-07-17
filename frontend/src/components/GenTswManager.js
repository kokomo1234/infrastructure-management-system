import React from 'react';
import DataManager from './DataManager';

const GenTswManager = () => {
  const fields = [
    { 
      name: 'type', 
      label: 'Type', 
      type: 'select', 
      required: true, 
      colSize: 6,
      options: [
        { value: 'Génératrice', label: 'Generator' },
        { value: 'TSW', label: 'TSW' }
      ]
    },
    { name: 'output', label: 'Output (W)', type: 'number', required: true, colSize: 6 },
    { name: 'TDL_id', label: 'TDL ID', type: 'text', required: true, colSize: 6 },
    { name: 'TSF_id', label: 'TSF ID', type: 'text', required: true, colSize: 6 }
  ];

  const displayFields = [
    { key: 'id', label: 'ID' },
    { key: 'type', label: 'Type' },
    { key: 'output', label: 'Output (W)' },
    { key: 'TDL_id', label: 'TDL ID' },
    { key: 'TSF_id', label: 'TSF ID' }
  ];

  return (
    <DataManager
      title="Generators & TSW Management"
      endpoint="gen-tsw"
      fields={fields}
      displayFields={displayFields}
      createTitle="Add New Generator/TSW"
      editTitle="Edit Generator/TSW"
    />
  );
};

export default GenTswManager;
