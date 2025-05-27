import React, { useState } from 'react';
import { X } from 'lucide-react';
import { indicatorService } from '../../services/indicatorService';
import { CreateIndicatorDTO, Indicator } from '../../types/indicator';

interface IndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  indicator?: Indicator | null;
}

const IndicatorModal: React.FC<IndicatorModalProps> = ({ isOpen, onClose, onSave, indicator }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const indicatorData: CreateIndicatorDTO = {
        codigo: formData.get('codigo') as string,
        nome: formData.get('nome') as string,
        descricao: formData.get('descricao') as string || undefined,
        tipo_estrutura: formData.get('tipo_estrutura') as 'Composto' | 'Único',
        tipo_dado: formData.get('tipo_dado') as 'Moeda' | 'Número' | 'Percentual',
        ativo: true
      };

      if (indicator) {
        await indicatorService.updateIndicator(indicator.id, indicatorData);
      } else {
        await indicatorService.createIndicator(indicatorData);
      }

      onSave();
    } catch (error) {
      console.error('Erro ao salvar indicador:', error);
      setError('Erro ao salvar indicador. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-800 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white">
            {indicator ? 'Editar Indicador' : 'Novo Indicador'}
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
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Código *
            </label>
            <input
              type="text"
              name="codigo"
              defaultValue={indicator?.codigo}
              required
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nome *
            </label>
            <input
              type="text"
              name="nome"
              defaultValue={indicator?.nome}
              required
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo de Estrutura *
            </label>
            <select
              name="tipo_estrutura"
              defaultValue={indicator?.tipo_estrutura || 'Único'}
              required
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="Único">Único</option>
              <option value="Composto">Composto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo de Dado *
            </label>
            <select
              name="tipo_dado"
              defaultValue={indicator?.tipo_dado || 'Número'}
              required
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="Número">Número</option>
              <option value="Moeda">Moeda</option>
              <option value="Percentual">Percentual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              name="descricao"
              defaultValue={indicator?.descricao || ''}
              rows={3}
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

export default IndicatorModal;