import React, { useState, useEffect } from 'react';
import { Search, Plus, Upload } from 'lucide-react';
import { salesService } from '../../../services/salesService';
import { Sale } from '../../../types/sale';
import SaleList from './SaleList';
import SaleModal from './SaleModal';
import CompanySelect from '../CompanySelect';

const Sales: React.FC = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedCompanyId) {
      loadSales();
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    filterSales();
  }, [sales, searchTerm]);

  const loadSales = async () => {
    try {
      setIsLoading(true);
      const data = await salesService.getSales();
      setSales(data.filter(sale => sale.empresa_id === selectedCompanyId));
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSales = () => {
    let filtered = sales;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sale =>
        sale.registro_venda.toLowerCase().includes(term) ||
        (sale as any).cliente?.razao_social?.toLowerCase().includes(term) ||
        sale.nome_cliente?.toLowerCase().includes(term) ||
        (sale as any).vendedor?.nome?.toLowerCase().includes(term) ||
        (sale as any).sdr?.nome?.toLowerCase().includes(term) ||
        (sale as any).servico?.nome?.toLowerCase().includes(term)
      );
    }

    setFilteredSales(filtered);
  };

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta venda?')) return;

    try {
      await salesService.deleteSale(id);
      await loadSales();
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
    }
  };

  const handleSave = async () => {
    await loadSales();
    setIsModalOpen(false);
    setSelectedSale(null);
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Registro de Vendas</h2>
          <p className="text-gray-400">Gerencie os registros de vendas realizadas.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedCompanyId}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Plus size={20} />
            Nova Venda
          </button>
          <button 
            disabled={!selectedCompanyId}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Upload size={20} />
            Upload
          </button>
        </div>
      </div>

      <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar vendas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <CompanySelect
            value={selectedCompanyId}
            onChange={setSelectedCompanyId}
          />
        </div>
      </div>

      <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Carregando vendas...</p>
          </div>
        ) : (
          <SaleList
            sales={filteredSales}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <SaleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSale(null);
        }}
        onSave={handleSave}
        selectedCompanyId={selectedCompanyId}
        sale={selectedSale}
      />
    </div>
  );
};

export default Sales;