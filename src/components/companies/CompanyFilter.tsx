import React from 'react';
import { Search } from 'lucide-react';

interface CompanyFilterProps {
  onSearch: (term: string) => void;
}

const CompanyFilter: React.FC<CompanyFilterProps> = ({ onSearch }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar empresas..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default CompanyFilter;