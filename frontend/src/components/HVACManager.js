import React from 'react';
import DataManager from './DataManager';

const HVACManager = () => {
  const fields = [
    { 
      name: 'type', 
      label: 'Type', 
      type: 'select', 
      required: true, 
      colSize: 6,
      options: [
        { value: 'RTU', label: 'RTU' },
        { value: 'Chiller', label: 'Chiller' },
        { value: 'Air Handler', label: 'Air Handler' },
        { value: 'Split System', label: 'Split System' }
      ]
    },
    { name: 'tonnage', label: 'Tonnage', type: 'number', required: true, colSize: 6 },
    { name: 'TDL_id', label: 'TDL ID', type: 'text', required: true, colSize: 6 },
    { name: 'TSF_id', label: 'TSF ID', type: 'text', required: true, colSize: 6 }
  ];

  const displayFields = [
    { key: 'id', label: 'ID' },
    { key: 'type', label: 'Type' },
    { key: 'tonnage', label: 'Tonnage' },
    { key: 'TDL_id', label: 'TDL ID' },
    { key: 'TSF_id', label: 'TSF ID' }
  ];

  return (
    <DataManager
      title="HVAC Systems Management"
      endpoint="hvac"
      fields={fields}
      displayFields={displayFields}
      createTitle="Add New HVAC System"
      editTitle="Edit HVAC System"
    />
  );
};

export default HVACManager;
