import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types/category';
import { Indicator } from '../../types/indicator';

const Transactions: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'receita' | 'despesa'>('all');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');

  useEffect(() => {
    // Definir mês anterior e ano atual como padrão
    const currentDate = new Date();
    const previousMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
    setSelectedMonth(previousMonth);
    setSelectedYear(currentDate.getFullYear());

    loadAvailableYears();
    loadCategories();
    loadIndicators();
  }, []);

  const loadAvailableYears = async () => {
    try {
      const { data, error } = await supabase
        .from('lancamentos')
        .select('ano')
        .order('ano', { ascending: false });

      if (error) throw error;

      const years = [...new Set(data?.map(item => item.ano))];
      setAvailableYears(years.length > 0 ? years : [new Date().getFullYear()]);
    } catch (error) {
      console.error('Erro ao carregar anos:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadIndicators = async () => {
    try {
      const { data, error } = await supabase
        .from('indicadores')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setIndicators(data || []);
    } catch (error) {
      console.error('Erro ao carregar indicadores:', error);
    }
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const SelectButton: React.FC<{
    value: any;
    onChange: (value: any) => void;
    options: { value: any; label: string }[];
    placeholder: string;
    className?: string;
  }> = ({ value, onChange, options, placeholder, className = '' }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 pr-10 ${className}`}
      >
        <option value="all">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Lançamentos</h2>
          <p className="text-gray-400">Gerencie os lançamentos financeiros e acompanhe o fluxo de caixa.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <Plus size={20} />
            Novo Lançamento
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <Upload size={20} />
            Upload
          </button>
        </div>
      </div>
      
      <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Buscar lançamentos..."
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <SelectButton
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(value === 'all' ? 'all' : Number(value))}
            options={months.map((month, index) => ({ value: index, label: month }))}
            placeholder="Todos os Meses"
            className="px-4 py-2"
          />

          <SelectButton
            value={selectedYear}
            onChange={(value) => setSelectedYear(value === 'all' ? 'all' : Number(value))}
            options={availableYears.map(year => ({ value: year, label: year.toString() }))}
            placeholder="Todos os Anos"
            className="px-4 py-2"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedType('receita')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'receita'
                  ? 'bg-green-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setSelectedType('despesa')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'despesa'
                  ? 'bg-red-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              Despesas
            </button>
          </div>

          <SelectButton
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories.map(category => ({ value: category.id, label: category.nome }))}
            placeholder="Todas as Categorias"
            className="px-4 py-2 min-w-[200px]"
          />

          <SelectButton
            value={selectedIndicator}
            onChange={setSelectedIndicator}
            options={indicators.map(indicator => ({ value: indicator.id, label: indicator.nome }))}
            placeholder="Todos os Indicadores"
            className="px-4 py-2 min-w-[200px]"
          />
        </div>
      </div>

      <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6">
        <p className="text-gray-400">Lista de lançamentos será implementada aqui.</p>
      </div>
    </div>
  );
};

export default Transactions;