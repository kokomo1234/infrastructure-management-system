import React from 'react';
import DataManager from './DataManager';

const ACManager = () => {
  const fields = [
    { name: 'nom', label: 'Name', type: 'text', required: true, colSize: 6 },
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
    { name: 'output_ac', label: 'AC Output (W)', type: 'number', required: true, colSize: 6 },
    { name: 'TDL_id', label: 'TDL ID', type: 'text', required: true, colSize: 6 },
    { name: 'TSF_id', label: 'TSF ID', type: 'text', required: true, colSize: 6 },
    { name: 'Paire_id', label: 'Pair ID', type: 'number', required: true, colSize: 6 },
    { name: 'port_sw', label: 'Switch Port', type: 'text', required: true, colSize: 6 },
    { name: 'gateway', label: 'Gateway', type: 'text', required: true, colSize: 6 },
    { name: 'netmask', label: 'Netmask', type: 'text', required: true, colSize: 6 },
    { name: 'date_inst', label: 'Installation Date', type: 'number', required: true, colSize: 6 },
    { name: 'voltage', label: 'Voltage (V)', type: 'number', required: true, colSize: 6 },
    { name: 'phase', label: 'Phase', type: 'number', required: true, colSize: 6 },
    { name: 'puissance_tot', label: 'Total Power (W)', type: 'number', required: true, colSize: 6 },
    { name: 'Bypass', label: 'Bypass', type: 'text', required: true, colSize: 6 },
    { name: 'commentaire', label: 'Comments', type: 'text', colSize: 12 },
    { name: 'ING', label: 'ING', type: 'number', required: true, colSize: 6 },
    { name: 'modèle', label: 'Model', type: 'number', required: true, colSize: 6 },
    { name: 'no_série', label: 'Serial Number', type: 'number', required: true, colSize: 6 },
    { name: 'fournisseur_id', label: 'Supplier ID', type: 'number', required: true, colSize: 6 },
    { name: 'fabricant_id', label: 'Manufacturer ID', type: 'number', required: true, colSize: 6 },
    { name: 'ip', label: 'IP Address', type: 'text', required: true, colSize: 6 },
    { name: 'username', label: 'Username', type: 'text', required: true, colSize: 6 },
    { name: 'password', label: 'Password', type: 'password', required: true, colSize: 6 },
    { name: 'OOD', label: 'Out of Date', type: 'checkbox', colSize: 6 },
    { name: 'SLA', label: 'SLA', type: 'number', required: true, colSize: 6 }
  ];

  const displayFields = [
    { key: 'nom', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'output_ac', label: 'AC Output (W)' },
    { key: 'TDL_id', label: 'TDL ID' },
    { key: 'TSF_id', label: 'TSF ID' },
    { key: 'voltage', label: 'Voltage (V)' },
    { key: 'fabricant_nom', label: 'Manufacturer' },
    { key: 'fournisseur_nom', label: 'Supplier' }
  ];

  return (
    <DataManager
      title="AC Equipment Management"
      endpoint="ac"
      fields={fields}
      displayFields={displayFields}
      createTitle="Add New AC Equipment"
      editTitle="Edit AC Equipment"
    />
  );
};

export default ACManager;
