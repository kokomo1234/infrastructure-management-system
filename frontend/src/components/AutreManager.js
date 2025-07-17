import React from 'react';
import DataManager from './DataManager';

const AutreManager = () => {
  const fields = [
    { 
      name: 'type', 
      label: 'Type', 
      type: 'select', 
      required: true, 
      colSize: 6,
      options: [
        { value: 'Entrée Électrique HQ', label: 'HQ Electrical Entry' },
        { value: 'Urgence', label: 'Emergency' },
        { value: 'RPP', label: 'RPP' }
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
      title="Other Equipment Management"
      endpoint="autre"
      fields={fields}
      displayFields={displayFields}
      createTitle="Add New Equipment"
      editTitle="Edit Equipment"
    />
  );
};

export default AutreManager;
