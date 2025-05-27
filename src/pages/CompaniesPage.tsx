import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CompanyFilter from '../components/companies/CompanyFilter';
import CompanyModal from '../components/companies/CompanyModal';
import CompanyList from '../components/companies/CompanyList';
import { Company } from '../types/company';
import { companyService } from '../services/companyService';

const CompaniesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyService.getCompanies();
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    const filtered = companies.filter(company => 
      company.razao_social.toLowerCase().includes(term.toLowerCase()) ||
      (company.nome_fantasia && company.nome_fantasia.toLowerCase().includes(term.toLowerCase())) ||
      company.cnpj.includes(term)
    );
    setFilteredCompanies(filtered);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;

    try {
      await companyService.deleteCompany(id);
      await loadCompanies();
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const handleSave = async () => {
    await loadCompanies();
    handleCloseModal();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Empresas</h1>
        <p className="text-gray-300">
          Gerencie as empresas cadastradas no sistema e suas informações.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-96">
          <CompanyFilter onSearch={handleSearch} />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nova Empresa
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800">
          <div className="text-gray-400">Carregando...</div>
        </div>
      ) : (
        <CompanyList
          companies={filteredCompanies}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CompanyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        company={selectedCompany}
      />
    </div>
  );
};

export default CompaniesPage;