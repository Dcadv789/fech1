import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  pagina: string;
}

type TipoVisualizacao = 'card' | 'lista' | 'grafico';
type TipoGrafico = 'bar' | 'line' | 'pie' | 'tree' | 'scatter' | 'radar' | 'heatmap' | 'funnel';
type TabelaOrigem = 'registro_vendas' | 'indicadores' | 'categorias' | 'clientes';

interface OrigemItem {
  id: string;
  nome?: string;
  razao_social?: string;
  [key: string]: any;
}

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose, onSave, pagina }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoVisualizacao, setTipoVisualizacao] = useState<TipoVisualizacao>('card');
  const [tipoGrafico, setTipoGrafico] = useState<TipoGrafico>('bar');
  const [tabelaOrigem, setTabelaOrigem] = useState<TabelaOrigem>('registro_vendas');
  const [itensOrigem, setItensOrigem] = useState<OrigemItem[]>([]);
  const [camposDisponiveis, setCamposDisponiveis] = useState<string[]>([]);
  const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);
  const [campoSelecionado, setCampoSelecionado] = useState<string>('');
  const [todosClientes, setTodosClientes] = useState(false);

  useEffect(() => {
    if (isOpen) {
      carregarItensPorOrigem();
    }
  }, [isOpen, tabelaOrigem]);

  useEffect(() => {
    if (tabelaOrigem === 'registro_vendas') {
      setCamposDisponiveis([
        'valor',
        'data_venda',
        'origem',
        'vendedor',
        'cliente',
        'servico'
      ]);
    }
  }, [tabelaOrigem]);

  const carregarItensPorOrigem = async () => {
    try {
      let { data, error } = { data: null, error: null };

      switch (tabelaOrigem) {
        case 'indicadores':
          ({ data, error } = await supabase
            .from('indicadores')
            .select('id, nome')
            .eq('ativo', true)
            .order('nome'));
          break;
        case 'categorias':
          ({ data, error } = await supabase
            .from('categorias')
            .select('id, nome')
            .eq('ativo', true)
            .order('nome'));
          break;
        case 'clientes':
          ({ data, error } = await supabase
            .from('clientes')
            .select('id, razao_social')
            .eq('ativo', true)
            .order('razao_social'));
          break;
      }

      if (error) throw error;
      setItensOrigem(data || []);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      setError('Erro ao carregar itens. Tente novamente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Buscar a maior ordem existente para a página
      const { data: existingConfigs } = await supabase
        .from('config_visualizacoes')
        .select('ordem')
        .eq('pagina', pagina)
        .order('ordem', { ascending: false })
        .limit(1);

      const nextOrder = existingConfigs && existingConfigs.length > 0 
        ? existingConfigs[0].ordem + 1 
        : 1;

      const configData: any = {
        pagina,
        nome_exibicao: formData.get('nome_exibicao'),
        tipo_visualizacao: tipoVisualizacao,
        tipo_grafico: tipoVisualizacao === 'grafico' ? tipoGrafico : null,
        tabela_origem: tabelaOrigem,
        ordem: nextOrder,
        ativo: true
      };

      // Adicionar campos específicos baseado na origem
      if (tabelaOrigem === 'registro_vendas') {
        configData.campo_exibicao = campoSelecionado;
      } else {
        if (tabelaOrigem === 'clientes' && todosClientes) {
          configData.cliente_id = null;
          configData.campo_exibicao = 'todos';
        } else {
          const campo = tabelaOrigem === 'indicadores' ? 'indicador_id' :
                       tabelaOrigem === 'categorias' ? 'categoria_id' :
                       'cliente_id';
          configData[campo] = itensSelecionados[0];
          configData.campo_exibicao = 'principal';
        }
      }

      const { error } = await supabase
        .from('config_visualizacoes')
        .insert(configData);

      if (error) throw error;
      onSave();
    } catch (error) {
      console.error('Erro ao salvar widget:', error);
      setError('Erro ao salvar widget. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-800 rounded-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white">Novo Widget</h2>
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
              Nome do Widget *
            </label>
            <input
              type="text"
              name="nome_exibicao"
              required
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo de Visualização *
            </label>
            <select
              value={tipoVisualizacao}
              onChange={(e) => setTipoVisualizacao(e.target.value as TipoVisualizacao)}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="card">Card</option>
              <option value="lista">Lista</option>
              <option value="grafico">Gráfico</option>
            </select>
          </div>

          {tipoVisualizacao === 'grafico' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tipo de Gráfico *
              </label>
              <select
                value={tipoGrafico}
                onChange={(e) => setTipoGrafico(e.target.value as TipoGrafico)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="bar">Barras</option>
                <option value="line">Linhas</option>
                <option value="pie">Pizza</option>
                <option value="tree">Árvore</option>
                <option value="scatter">Dispersão</option>
                <option value="radar">Radar</option>
                <option value="heatmap">Mapa de Calor</option>
                <option value="funnel">Funil</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Fonte de Dados *
            </label>
            <select
              value={tabelaOrigem}
              onChange={(e) => {
                setTabelaOrigem(e.target.value as TabelaOrigem);
                setItensSelecionados([]);
                setCampoSelecionado('');
                setTodosClientes(false);
              }}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="registro_vendas">Registro de Vendas</option>
              <option value="indicadores">Indicadores</option>
              <option value="categorias">Categorias</option>
              <option value="clientes">Clientes</option>
            </select>
          </div>

          {tabelaOrigem === 'registro_vendas' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Campo para Exibição *
              </label>
              <select
                value={campoSelecionado}
                onChange={(e) => setCampoSelecionado(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Selecione um campo</option>
                {camposDisponiveis.map(campo => (
                  <option key={campo} value={campo}>
                    {campo.charAt(0).toUpperCase() + campo.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Selecionar Item {tipoVisualizacao === 'grafico' ? '(até 3)' : ''}
              </label>
              {tabelaOrigem === 'clientes' && (
                <div className="mb-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={todosClientes}
                      onChange={(e) => {
                        setTodosClientes(e.target.checked);
                        if (e.target.checked) setItensSelecionados([]);
                      }}
                      className="form-checkbox h-4 w-4 text-primary-600"
                    />
                    <span className="text-sm text-gray-300">Selecionar todos os clientes</span>
                  </label>
                </div>
              )}
              {!todosClientes && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {itensOrigem.map((item) => (
                    <label key={item.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={itensSelecionados.includes(item.id)}
                        onChange={() => {
                          const maxItems = tipoVisualizacao === 'grafico' ? 3 : 1;
                          setItensSelecionados(prev => {
                            if (prev.includes(item.id)) {
                              return prev.filter(id => id !== item.id);
                            }
                            if (prev.length >= maxItems) {
                              return [...prev.slice(1), item.id];
                            }
                            return [...prev, item.id];
                          });
                        }}
                        className="form-checkbox h-4 w-4 text-primary-600"
                      />
                      <span className="text-sm text-gray-300">
                        {item.nome || item.razao_social}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

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
              disabled={isSubmitting || 
                (tabelaOrigem === 'registro_vendas' && !campoSelecionado) ||
                (!todosClientes && itensSelecionados.length === 0)}
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

export default AddWidgetModal;