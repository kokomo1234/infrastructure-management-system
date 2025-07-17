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
    { name: 'TDL_id', label: 'TDL ID', type: 'text', required: true, colSize: 6 },
    { name: 'TSF_id', label: 'TSF ID', type: 'text', required: true, colSize: 6 },
    { name: 'besoin_ac', label: 'AC Requirement (W)', type: 'number', required: true, colSize: 6 },
    { name: 'besoin_dc', label: 'DC Requirement (W)', type: 'number', required: true, colSize: 6 },
    { name: 'besoin_gen', label: 'Generator Requirement (W)', type: 'number', required: true, colSize: 6 },
    { name: 'besoin_clim', label: 'HVAC Requirement (W)', type: 'number', required: true, colSize: 6 },
    { name: 'année_req', label: 'Required Year', type: 'number', required: true, colSize: 6 },
    { name: 'date_demande', label: 'Request Date', type: 'number', required: true, colSize: 6 },
    { name: 'commentaire', label: 'Comments', type: 'number', colSize: 6 },
    { name: 'RU', label: 'RU', type: 'number', required: true, colSize: 6 }
  ];

  const displayFields = [
    { key: 'id', label: 'ID' },
    { key: 'type', label: 'Type' },
    { key: 'TDL_id', label: 'TDL ID' },
    { key: 'TSF_id', label: 'TSF ID' },
    { key: 'besoin_ac', label: 'AC Req. (W)' },
    { key: 'besoin_dc', label: 'DC Req. (W)' },
    { key: 'année_req', label: 'Required Year' }
  ];

  return (
    <DataManager
      title="Requirements Management"
      endpoint="besoin"
      fields={fields}
      displayFields={displayFields}
      createTitle="Add New Requirement"
      editTitle="Edit Requirement"
    />
  );
};

export default BesoinManager;
