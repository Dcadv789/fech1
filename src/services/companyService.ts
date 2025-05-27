import { supabase } from '../lib/supabase';
import { Company, CreateCompanyDTO } from '../types/company';

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('razao_social');

    if (error) throw error;
    return data;
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