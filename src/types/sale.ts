export interface Sale {
  id: string;
  empresa_id: string;
  cliente_id?: string;
  vendedor_id?: string;
  sdr_id?: string;
  servico_id: string;
  valor: number;
  origem: 'Brasil' | 'Exterior';
  nome_cliente?: string;
  registro_venda: string;
  data_venda: string;
  criado_em: string;
  modificado_em: string;
}

export interface CreateSaleDTO {
  empresa_id: string;
  cliente_id?: string;
  vendedor_id?: string;
  sdr_id?: string;
  servico_id: string;
  valor: number;
  origem: 'Brasil' | 'Exterior';
  nome_cliente?: string;
  registro_venda: string;
  data_venda: string;
}