import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Company, CreateCompanyDTO } from '../../types/company';
import { Partner } from '../../types/partner';
import { companyService } from '../../services/companyService';
import { partnerService } from '../../services/partnerService';
import PartnerList from './PartnerList';
import PartnerForm from './PartnerForm';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  company?: Company | null;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, onSave, company }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [showPartners, setShowPartners] = useState(false);

  useEffect(() => {
    if (company) {
      loadPartners();
    }
  }, [company]);

  const loadPartners = async () => {
    if (company) {
      try {
        const data = await partnerService.getPartnersByCompany(company.id);
        setPartners(data);
      } catch (error) {
        console.error('Erro ao carregar sócios:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const companyData: CreateCompanyDTO = {
        razao_social: formData.get('razao_social') as string,
        nome_fantasia: formData.get('nome_fantasia') as string || undefined,
        cnpj: formData.get('cnpj') as string,
        email: formData.get('email') as string,
        telefone: formData.get('telefone') as string,
        data_inicio_contrato: formData.get('data_inicio_contrato') as string,
      };

      if (company) {
        await companyService.updateCompany(company.id, companyData);
      } else {
        await companyService.createCompany(companyData);
      }

      onSave();
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPartner = async (partnerData: any) => {
    try {
      await partnerService.createPartner(partnerData);
      await loadPartners();
      setShowPartnerForm(false);
    } catch (error) {
      console.error('Erro ao adicionar sócio:', error);
      throw error; // Propaga o erro para o formulário tratar
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este sócio?')) return;

    try {
      await partnerService.deletePartner(id);
      await loadPartners();
    } catch (error) {
      console.error('Erro ao excluir sócio:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white">
            {company ? 'Editar Empresa' : 'Nova Empresa'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Razão Social *
              </label>
              <input
                type="text"
                name="razao_social"
                defaultValue={company?.razao_social}
                required
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nome Fantasia
              </label>
              <input
                type="text"
                name="nome_fantasia"
                defaultValue={company?.nome_fantasia || ''}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                CNPJ *
              </label>
              <input
                type="text"
                name="cnpj"
                defaultValue={company?.cnpj}
                required
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                defaultValue={company?.email}
                required
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                name="telefone"
                defaultValue={company?.telefone}
                required
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Data de Início do Contrato *
              </label>
              <input
                type="date"
                name="data_inicio_contrato"
                defaultValue={company?.data_inicio_contrato?.split('T')[0]}
                required
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          {company && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowPartners(!showPartners)}
                className="flex items-center justify-between w-full px-4 py-2 bg-dark-700 rounded-lg text-white hover:bg-dark-600 transition-colors"
              >
                <span className="flex items-center">
                  <span className="font-medium">Sócios</span>
                  <span className="ml-2 text-sm text-gray-400">({partners.length})</span>
                </span>
                {showPartners ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {showPartners && (
                <div className="mt-4 p-4 bg-dark-700 rounded-lg">
                  {!showPartnerForm ? (
                    <div className="space-y-4">
                      <PartnerList
                        partners={partners}
                        onDelete={handleDeletePartner}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPartnerForm(true)}
                        className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Plus size={18} className="mr-2" />
                        Adicionar Sócio
                      </button>
                    </div>
                  ) : (
                    <PartnerForm
                      companyId={company.id}
                      onSubmit={handleAddPartner}
                      onCancel={() => setShowPartnerForm(false)}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-dark-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal