import React, { useState } from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Company {
  id: string;
  razao_social: string;
}

const CompanyFilter: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, razao_social')
        .order('razao_social');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Building2 size={20} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Empresa</span>
      </div>
      <div className="relative">
        <select 
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="w-full appearance-none bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
          disabled={isLoading}
        >
          <option value="">Todas as empresas</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.razao_social}
            </option>
          ))}
        </select>
        <ChevronDown 
          size={16} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
        />
      </div>
    </div>
  );
};

export default CompanyFilter;