import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

const ClientsPage: React.FC = () => {
  return (
    <div className="p-6 bg-dark-800 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white mb-2 md:mb-0">Clientes</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white w-full sm:w-64"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className="flex items-center justify-center px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white hover:bg-dark-600 transition-colors">
            <Filter size={18} className="mr-2" />
            Filtros
            <ChevronDown size={16} className="ml-2" />
          </button>
        </div>
      </div>
      <div className="bg-dark-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-600">
            <thead className="bg-dark-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Telefone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-dark-800 divide-y divide-dark-700">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="hover:bg-dark-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Cliente {item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">cliente{item}@exemplo.com</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">(11) 9999-8888</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                    <button className="text-primary-400 hover:text-primary-300">Detalhes</button>
                    <button className="text-primary-400 hover:text-primary-300">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-dark-800 px-4 py-3 flex items-center justify-between border-t border-dark-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-dark-600 text-sm font-medium rounded-md text-white bg-dark-700 hover:bg-dark-600">
              Anterior
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-dark-600 text-sm font-medium rounded-md text-white bg-dark-700 hover:bg-dark-600">
              Próximo
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Mostrando <span className="font-medium">1</span> até <span className="font-medium">5</span> de <span className="font-medium">20</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-dark-600 bg-dark-700 text-sm font-medium text-gray-300 hover:bg-dark-600">
                  Anterior
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-dark-600 bg-dark-700 text-sm font-medium text-white hover:bg-dark-600">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-dark-600 bg-primary-600 text-sm font-medium text-white">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-dark-600 bg-dark-700 text-sm font-medium text-white hover:bg-dark-600">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-dark-600 bg-dark-700 text-sm font-medium text-gray-300 hover:bg-dark-600">
                  Próximo
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;