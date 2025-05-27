import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';

const Categories: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Categorias</h2>
          <p className="text-gray-400">Gerencie as categorias e grupos para classificação de lançamentos financeiros.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <Plus size={20} />
            Nova Categoria
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <Plus size={20} />
            Novo Grupo
          </button>
        </div>
      </div>
      
      <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar categorias..."
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500">
            <option value="all">Todos os Grupos</option>
            <option value="receitas">Receitas</option>
            <option value="despesas">Despesas</option>
          </select>
          <button className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white hover:bg-dark-700 transition-colors flex items-center gap-2">
            <Filter size={20} />
            Filtros
          </button>
        </div>
      </div>

      <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6">
        <p className="text-gray-400">Lista de categorias será implementada aqui.</p>
      </div>
    </div>
  );
};

export default Categories