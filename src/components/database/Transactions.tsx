import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Plus, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Transactions: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    // Definir mês anterior e ano atual como padrão
    const currentDate = new Date();
    const previousMonth = currentDate.getMonth(); // 0-11
    setSelectedMonth(previousMonth);
    setSelectedYear(currentDate.getFullYear());

    loadAvailableYears();
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

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar lançamentos..."
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex gap-4">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white hover:bg-dark-700 transition-colors flex items-center gap-2">
              <Filter size={20} />
              Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6">
        <p className="text-gray-400">Lista de lançamentos será implementada aqui.</p>
      </div>
    </div>
  );
};

export default Transactions;