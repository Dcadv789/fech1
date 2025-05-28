import { supabase } from '../lib/supabase';
import { Sale, CreateSaleDTO } from '../types/sale';

export const salesService = {
  async getSales(): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('registro_de_vendas')
      .select(`
        *,
        empresa:empresas(razao_social),
        cliente:clientes(razao_social),
        vendedor:pessoas(nome),
        sdr:pessoas(nome),
        servico:servicos(nome)
      `)
      .order('data_venda', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createSale(sale: CreateSaleDTO): Promise<Sale> {
    const { data, error } = await supabase
      .from('registro_de_vendas')
      .insert(sale)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSale(id: string, sale: Partial<CreateSaleDTO>): Promise<Sale> {
    const { data, error } = await supabase
      .from('registro_de_vendas')
      .update(sale)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSale(id: string): Promise<void> {
    const { error } = await supabase
      .from('registro_de_vendas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};