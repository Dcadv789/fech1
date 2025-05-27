import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import CategoryModal from './CategoryModal';
import CategoryGroupModal from './CategoryGroupModal';

const Categories: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'receita' | 'despesa'>('all');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const handleSaveCategory = () => {
    setIsCategoryModalOpen(false);
    // Aqui você pode adicionar a lógica para recarregar a lista de categorias
  };

  const handleSaveGroup = () => {
    setIsGroupModalOpen(false);
    // Aqui você pode adicionar a lógica para recarregar a lista de grupos
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Categorias</h2>
          <p className="text-gray-400">Gerencie as categorias e grupos para classificação de lançamentos financeiros.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Categoria
          </button>
          <button 
            onClick={() => setIsGroupModalOpen(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Grupo
          </button>
        </div>
      </div>
      
      <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative md:w-1/2">
            <input
              type="text"
              placeholder="Buscar categorias..."
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
              onClick={() => setSelectedFilter('receita')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFilter === 'receita'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setSelectedFilter('despesa')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFilter === 'despesa'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              Despesas
            </button>
          </div>
        </div>
      </div>

      <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6">
        <p className="text-gray-400">Lista de categorias será implementada aqui.</p>
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

      <CategoryGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onSave={handleSaveGroup}
      />
    </div>
  );
};

export default Categories;