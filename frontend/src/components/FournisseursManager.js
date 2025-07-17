import React from 'react';
import DataManager from './DataManager';

const FournisseursManager = () => {
  const fields = [
    { name: 'num', label: 'Number', type: 'number', required: true, colSize: 6 },
    { name: 'nom', label: 'Name', type: 'text', required: true, colSize: 6 },
    { name: 'Contact', label: 'Contact Person', type: 'text', required: true, colSize: 6 },
    { name: 'courriel', label: 'Email', type: 'email', required: true, colSize: 6 }
  ];

  const displayFields = [
    { key: 'id', label: 'ID' },
    { key: 'num', label: 'Number' },
    { key: 'nom', label: 'Name' },
    { key: 'Contact', label: 'Contact Person' },
    { key: 'courriel', label: 'Email' }
  ];

  return (
    <DataManager
      title="Suppliers Management"
      endpoint="fournisseurs"
      fields={fields}
      displayFields={displayFields}
      createTitle="Add New Supplier"
      editTitle="Edit Supplier"
    />
  );
};

export default FournisseursManager;
