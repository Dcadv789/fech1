import { supabase } from '../lib/supabase';
import { Partner, CreatePartnerDTO } from '../types/partner';

export const partnerService = {
  async getPartnersByCompany(empresaId: string): Promise<Partner[]> {
    try {
      console.log('Buscando sócios para empresa:', empresaId);
      
      const { data, error } = await supabase
        .from('socios')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar sócios:', error);
        throw error;
      }

      console.log('Sócios encontrados:', data);
      return data || [];
    } catch (error) {
      console.error('Erro inesperado ao buscar sócios:', error);
      throw error;
    }
  },

  async createPartner(partner: CreatePartnerDTO): Promise<Partner> {
    try {
      console.log('Criando sócio:', partner);

      // Garantir que percentual seja um número
      const partnerData = {
        ...partner,
        percentual: Number(partner.percentual)
      };

      const { data, error } = await supabase
        .from('socios')
        .insert(partnerData)
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao criar sócio:', error);
        throw error;
      }

      console.log('Sócio criado com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro inesperado ao criar sócio:', error);
      throw error;
    }
  },

  async deletePartner(id: string): Promise<void> {
    try {
      console.log('Excluindo sócio:', id);
      
      const { error } = await supabase
        .from('socios')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir sócio:', error);
        throw error;
      }

      console.log('Sócio excluído com sucesso');
    } catch (error) {
      console.error('Erro inesperado ao excluir sócio:', error);
      throw error;
    }
  }
};