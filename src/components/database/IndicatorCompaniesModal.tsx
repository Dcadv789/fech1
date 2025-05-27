import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Indicator } from '../../types/indicator';
import { indicatorService } from '../../services/indicatorService';
import { supabase } from '../../lib/supabase';

interface IndicatorCompaniesModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicator: Indicator;
}

interface Company {
  id: string;
  razao_social: string;
}

const IndicatorCompaniesModal: React.FC<IndicatorCompaniesModalProps> = ({ isOpen, onClose, indicator }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [linkedCompanies, setLinkedCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, indicator.id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [companiesData, linkedData] = await Promise.all([
        loadCompanies(),
        loadLinkedCompanies()
      ]);
      setCompanies(companiesData);
      setLinkedCompanies(linkedData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanies = async () => {
    const { data, error } = await supabase
      .from('empresas')
      .select('id, razao_social')
      .order('razao_social');

    if (error) throw error;
    return data || [];
  };

  const loadLinkedCompanies = async () => {
    return indicatorService.getIndicatorCompanies(indicator.id);
  };

  const handleLink = async () => {
    if (!selectedCompanyId) return;

    try {
      await indicatorService.linkIndicatorToCompany(indicator.id, selectedCompanyId);
      await loadData();
      setSelectedCompanyId('');
    } catch (error) {
      console.error('Erro ao vincular empresa:', error);
    }
  };

  const handleUnlink = async (empresaId: string) => {
    try {
      await indicatorService.unlinkIndicatorFromCompany(indicator.id, empresaId);
      await loadData();
    } catch (error) {
      console.error('Erro ao desvincular empresa:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-800 rounded-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div>
            <h2 className="text-xl font-bold text-white">Empresas Vinculadas</h2>
            <p className="text-sm text-gray-400 mt-1">{indicator.nome}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Selecione uma empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.razao_social}
                </option>
              ))}
            </select>
            <button
              onClick={handleLink}
              disabled={!selectedCompanyId}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Vincular
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Carregando...</p>
            </div>
          ) : linkedCompanies.length === 0 ? (
            <div className="text-center py-8 bg-dark-700/50 rounded-lg">
              <p className="text-gray-400">Nenhuma empresa vinculada</p>
            </div>
          ) : (
            <div className="space-y-2">
              {linkedCompanies.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
                >
                  <span className="text-white">{link.empresa.razao_social}</span>
                  <button
                    onClick={() => handleUnlink(link.empresa_id)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-dark-600 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndicatorCompaniesModal;