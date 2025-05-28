import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { salesService } from '../../../services/salesService';
import { CreateSaleDTO } from '../../../types/sale';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  selectedCompanyId?: string;
  sale?: any;
}

const SaleModal: React.FC<SaleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedCompanyId,
  sale
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [sdrs, setSDRs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [showManualClient, setShowManualClient] = useState(false);

  useEffect(() => {
    if (isOpen && selectedCompanyId) {
      loadData();
    }
  }, [isOpen, selectedCompanyId]);

  const loadData = async () => {
    try {
      const [clientsData, peopleData, servicesData] = await Promise.all([
        supabase
          .from('clientes')
          .select('id, razao_social')
          .eq('empresa_id', selectedCompanyId)
          .eq('ativo', true)
          .order('razao_social'),
        supabase
          .from('pessoas')
          .select('id, nome, cargo')
          .eq('empresa_id', selectedCompanyId)
          .order('nome'),
        supabase
          .from('servicos')
          .select('id, nome')
          .eq('empresa_id', selectedCompanyId)
          .eq('ativo', true)
          .order('nome')
      ]);

      if (clientsData.error) throw clientsData.error;
      if (peopleData.error) throw peopleData.error;
      if (servicesData.error) throw servicesData.error;

      setClients(clientsData.data || []);
      setSellers(peopleData.data?.filter(p => p.cargo === 'Vendedor' || p.cargo === 'Ambos') || []);
      setSDRs(peopleData.data?.filter(p => p.cargo === 'SDR' || p.cargo === 'Ambos') || []);
      setServices(servicesData.data || []);

      if (sale) {
        setSelectedClientId(sale.cliente_id || '');
        setShowManualClient(!sale.cliente_id);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Tente novamente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCompanyId) {
      setError('Selecione uma empresa');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const valor = Number(formData.get('valor'));
      const clienteId = formData.get('cliente_id') as string;
      const nomeCliente = formData.get('nome_cliente') as string;

      if (!valor || valor <= 0) {
        throw new Error('Valor inválido');
      }

      if (!clienteId && !nomeCliente) {
        throw new Error('Informe o cliente');
      }

      const saleData: CreateSaleDTO = {
        empresa_id: selectedCompanyId,
        cliente_id: clienteId || undefined,
        nome_cliente: nomeCliente || undefined,
        vendedor_id: formData.get('vendedor_id') as string || undefined,
        sdr_id: formData.get('sdr_id') as string || undefined,
        servico_id: formData.get('servico_id') as string,
        valor,
        origem: formData.get('origem') as 'Brasil' | 'Exterior',
        registro_venda: formData.get('registro_venda') as string,
        data_venda: formData.get('data_venda') as string
      };

      if (sale) {
        await salesService.updateSale(sale.id, saleData);
      } else {
        await salesService.createSale(saleData);
      }

      onSave();
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar venda');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-800 rounded-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white">
            {sale ? 'Editar Venda' : 'Nova Venda'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Data da Venda *
              </label>
              <input
                type="date"
                name="data_venda"
                defaultValue={sale?.data_venda?.split('T')[0]}
                required
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Registro da Venda *
              </label>
              <input
                type="text"
                name="registro_venda"
                defaultValue={sale?.registro_venda}
                required
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-300">
                Cliente *
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowManualClient(!showManualClient);
                  setSelectedClientId('');
                }}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                {showManualClient ? 'Selecionar Cliente' : 'Cliente Manual'}
              </button>
            </div>

            {showManualClient ? (
              <input
                type="text"
                name="nome_cliente"
                defaultValue={sale?.nome_cliente}
                placeholder="Nome do cliente"
                required={!selectedClientId}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            ) : (
              <select
                name="cliente_id"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                required={!showManualClient}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.razao_social}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Vendedor
              </label>
              <select
                name="vendedor_id"
                defaultValue={sale?.vendedor_id}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Selecione um vendedor</option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                SDR
              </label>
              <select
                name="sdr_id"
                defaultValue={sale?.sdr_id}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Selecione um SDR</option>
                {sdrs.map((sdr) => (
                  <option key={sdr.id} value={sdr.id}>
                    {sdr.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Serviço *
              </label>
              <select
                name="servico_id"
                defaultValue={sale?.servico_id}
                required
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Selecione um serviço</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Origem *
              </label>
              <select
                name="origem"
                defaultValue={sale?.origem || 'Brasil'}
                required
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="Brasil">Brasil</option>
                <option value="Exterior">Exterior</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Valor *
            </label>
            <input
              type="number"
              name="valor"
              defaultValue={sale?.valor}
              min="0.01"
              step="0.01"
              required
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
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

export default SaleModal;