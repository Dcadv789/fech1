import React from 'react';
import { Building2 } from 'lucide-react';

const CompanySelect: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Building2 size={20} className="text-gray-400" />
      <select className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500">
        <option value="">Todas as empresas</option>
        <option value="1">Empresa 1</option>
        <option value="2">Empresa 2</option>
      </select>
    </div>
  );
};

export default CompanySelect;