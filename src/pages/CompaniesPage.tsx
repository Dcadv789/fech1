import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Company {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  url_logo: string;
  email: string;
  telefone: string;
  data_inicio_contrato: string;
}

interface Partner {
  id: string;
  empresa_id: string;
  nome: string;
  cpf: string;
  percentual: number;
  email?: string;
  telefone?: string;
}

const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('razao_social');

    if (error) {
      console.error('Erro ao buscar empresas:', error);
      return;
    }

    setCompanies(data || []);
  };

  const handleEdit = async (company: Company) => {
    setCurrentCompany(company);
    const { data: partnersData } = await supabase
      .from('socios')
      .select('*')
      .eq('empresa_id', company.id);
    
    setPartners(partnersData || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;

    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir empresa:', error);
      return;
    }

    fetchCompanies();
  };

  return (
    <div className="p-6 bg-dark-900/95 backdrop-blur-sm rounded-xl shadow-md border border-dark-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Empresas</h1>
        <button
          onClick={() => {
            setCurrentCompany(null);
            setPartners([]);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nova Empresa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-dark-800 rounded-lg p-6 shadow-lg border border-dark-700">
            <div className="flex items-center justify-between mb-4">
              {company.url_logo ? (
                <img
                  src={company.url_logo}
                  alt={company.nome_fantasia}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Building2 size={24} className="text-white" />
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(company)}
                  className="p-2 text-primary-400 hover:text-primary-300 transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              {company.nome_fantasia || company.razao_social}
            </h3>
            <p className="text-sm text-gray-400 mb-1">CNPJ: {company.cnpj}</p>
            <p className="text-sm text-gray-400 mb-1">Email: {company.email}</p>
            <p className="text-sm text-gray-400">Telefone: {company.telefone}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-dark-700">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const companyData = {
                razao_social: formData.get('razao_social') as string,
                nome_fantasia: formData.get('nome_fantasia') as string,
                cnpj: formData.get('cnpj') as string,
                url_logo: formData.get('url_logo') as string,
                email: formData.get('email') as string,
                telefone: formData.get('telefone') as string,
                data_inicio_contrato: formData.get('data_inicio_contrato') as string,
              };

              if (currentCompany) {
                const { error } = await supabase
                  .from('empresas')
                  .update(companyData)
                  .eq('id', currentCompany.id);

                if (error) {
                  console.error('Erro ao atualizar empresa:', error);
                  return;
                }
              } else {
                const { data: newCompany, error } = await supabase
                  .from('empresas')
                  .insert(companyData)
                  .select()
                  .single();

                if (error || !newCompany) {
                  console.error('Erro ao criar empresa:', error);
                  return;
                }

                // Criar sócios
                const partnersData = Array.from(document.querySelectorAll('[data-partner]')).map((partner) => {
                  const partnerElement = partner as HTMLElement;
                  return {
                    empresa_id: newCompany.id,
                    nome: (partnerElement.querySelector('[name^="partner_nome"]') as HTMLInputElement).value,
                    cpf: (partnerElement.querySelector('[name^="partner_cpf"]') as HTMLInputElement).value,
                    percentual: Number((partnerElement.querySelector('[name^="partner_percentual"]') as HTMLInputElement).value),
                    email: (partnerElement.querySelector('[name^="partner_email"]') as HTMLInputElement).value,
                    telefone: (partnerElement.querySelector('[name^="partner_telefone"]') as HTMLInputElement).value,
                  };
                });

                if (partnersData.length > 0) {
                  const { error: partnersError } = await supabase
                    .from('socios')
                    .insert(partnersData);

                  if (partnersError) {
                    console.error('Erro ao criar sócios:', partnersError);
                    return;
                  }
                }
              }

              setIsModalOpen(false);
              fetchCompanies();
            }} className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {currentCompany ? 'Editar Empresa' : 'Nova Empresa'}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Razão Social *
                    </label>
                    <input
                      type="text"
                      name="razao_social"
                      defaultValue={currentCompany?.razao_social}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Nome Fantasia
                    </label>
                    <input
                      type="text"
                      name="nome_fantasia"
                      defaultValue={currentCompany?.nome_fantasia}
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
                      defaultValue={currentCompany?.cnpj}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      URL da Logo
                    </label>
                    <input
                      type="url"
                      name="url_logo"
                      defaultValue={currentCompany?.url_logo}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={currentCompany?.email}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      defaultValue={currentCompany?.telefone}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Data de Início do Contrato *
                  </label>
                  <input
                    type="date"
                    name="data_inicio_contrato"
                    defaultValue={currentCompany?.data_inicio_contrato}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Sócios</h3>
                  <div className="space-y-6">
                    {[...Array(partners.length || 1)].map((_, index) => (
                      <div key={index} data-partner className="p-4 bg-dark-700 rounded-lg border border-dark-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Nome do Sócio *
                            </label>
                            <input
                              type="text"
                              name={`partner_nome_${index}`}
                              defaultValue={partners[index]?.nome}
                              className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              CPF *
                            </label>
                            <input
                              type="text"
                              name={`partner_cpf_${index}`}
                              defaultValue={partners[index]?.cpf}
                              className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Percentual *
                            </label>
                            <input
                              type="number"
                              name={`partner_percentual_${index}`}
                              defaultValue={partners[index]?.percentual}
                              min="0"
                              max="100"
                              step="0.01"
                              className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              name={`partner_email_${index}`}
                              defaultValue={partners[index]?.email}
                              className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Telefone
                            </label>
                            <input
                              type="tel"
                              name={`partner_telefone_${index}`}
                              defaultValue={partners[index]?.telefone}
                              className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;