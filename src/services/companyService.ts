import { supabase } from '../lib/supabase';
import { Company, CreateCompanyDTO } from '../types/company';

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    try {
      console.log('Iniciando busca de empresas...');
      
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('razao_social');

      if (error) {
        console.error('Erro ao buscar empresas:', error.message);
        throw error;
      }

      if (!data) {
        console.log('Nenhuma empresa encontrada');
        return [];
      }

      console.log('Empresas encontradas:', data.length);
      return data;
    } catch (error) {
      console.error('Erro inesperado ao buscar empresas:', error);
      throw error;
    }
  },

  async createCompany(company: CreateCompanyDTO): Promise<Company> {
    const { data, error } = await supabase
      .from('empresas')
      .insert(company)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCompany(id: string, company: Partial<CreateCompanyDTO>): Promise<Company> {
    const { data, error } = await supabase
      .from('empresas')
      .update(company)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCompany(id: string): Promise<void> {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};