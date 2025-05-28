import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

const DashboardConfigPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Configuração de Dashboards</h1>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="w-full justify-start border border-dark-700/50 mb-6">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="analise">Análise</TabsTrigger>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          <TabsTrigger value="tabelas">Tabelas</TabsTrigger>
        </TabsList>

        {['home', 'vendas', 'analise', 'graficos', 'tabelas'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Dashboard {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </h2>
                  <p className="text-gray-400">
                    Configure os elementos visuais que serão exibidos na página {tab}.
                  </p>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                  <Plus size={20} />
                  Novo Widget
                </button>
              </div>

              <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative md:w-1/2">
                    <input
                      type="text"
                      placeholder="Buscar widgets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6">
                <div className="text-center py-8 text-gray-400">
                  Nenhum widget configurado para esta página.
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default DashboardConfigPage;