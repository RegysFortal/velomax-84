
import React from 'react';
import { AppLayout } from '@/components/AppLayout';

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel de controle principal
        </p>
      </div>
      
      {/* Conteúdo do dashboard principal pode ser adicionado aqui */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Entregas Recentes</h2>
          <p className="text-sm text-muted-foreground">Acesse o módulo de entregas para mais informações</p>
        </div>
        
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Financeiro</h2>
          <p className="text-sm text-muted-foreground">Resumo das informações financeiras</p>
        </div>
        
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Veículos</h2>
          <p className="text-sm text-muted-foreground">Status da frota</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
