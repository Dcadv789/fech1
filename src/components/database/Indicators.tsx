import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

const Indicators: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'composto' | 'unico'>('all');

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Indicadores</h2>
          <p className="text-gray-400">Configure os indicadores para análise e acompanhamento do desempenho.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Novo Indicador
        </button>
      </div>
      
      <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative md:w-1/2">
            <input
              type="text"
              placeholder="Buscar indicadores..."
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedFilter('composto')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFilter === 'composto'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              Compostos
            </button>
            <button
              onClick={() => setSelectedFilter('unico')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFilter === 'unico'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              Únicos
            </button>
          </div>
        </div>
      </div>

      <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6">
        <p className="text-gray-400">Lista de indicadores será implementada aqui.</p>
      </div>
    </div>
  );
};

export default Indicators