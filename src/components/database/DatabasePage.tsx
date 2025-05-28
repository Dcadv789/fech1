import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import Categories from './Categories';
import Indicators from './Indicators';
import Transactions from './Transactions';
import CustomerTransactions from './CustomerTransactions';
import Sales from './sales/Sales';
import CompanySelect from './CompanySelect';

const DatabasePage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Banco de Dados</h1>
        <CompanySelect />
      </div>

      <Tabs defaultValue="categorias" className="w-full">
        <TabsList className="w-full justify-start border border-dark-700/50 mb-6">
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
          <TabsTrigger value="lancamentos-clientes">Lanç. Clientes</TabsTrigger>
          <TabsTrigger value="vendas">Registro de Vendas</TabsTrigger>
        </TabsList>

        <TabsContent value="categorias">
          <Categories />
        </TabsContent>
        <TabsContent value="indicadores">
          <Indicators />
        </TabsContent>
        <TabsContent value="lancamentos">
          <Transactions />
        </TabsContent>
        <TabsContent value="lancamentos-clientes">
          <CustomerTransactions />
        </TabsContent>
        <TabsContent value="vendas">
          <Sales />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabasePage;