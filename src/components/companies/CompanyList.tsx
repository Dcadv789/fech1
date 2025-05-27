import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Company } from '../../types/company';

interface CompanyListProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-dark-700">
        <thead className="bg-dark-800">
          <tr>
            <th scope="col\" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Razão Social
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Nome Fantasia
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              CNPJ
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Telefone
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-dark-800 divide-y divide-dark-700">
          {companies.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                Nenhuma empresa encontrada
              </td>
            </tr>
          ) : (
            companies.map((company) => (
              <tr key={company.id} className="hover:bg-dark-750">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {company.razao_social}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {company.nome_fantasia || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {company.cnpj}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {company.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {company.telefone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(company)}
                    className="text-primary-400 hover:text-primary-300 mr-3"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(company.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyList;