
import React from 'react';
import { PermissionLevel, User } from '@/types';
import { PermissionRow } from './PermissionRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PermissionsSectionProps {
  permissions: Record<string, PermissionLevel>;
  onChange: (name: string, level: keyof PermissionLevel, value: boolean) => void;
  isAdmin: boolean;
}

export const PermissionsSection = ({ 
  permissions, 
  onChange,
  isAdmin
}: PermissionsSectionProps) => {
  const permissionGroups = [
    {
      title: 'Sistema e Acesso',
      permissions: [
        { name: 'dashboard', label: 'Dashboard Inicial' },
        { name: 'system', label: 'Sistema' },
        { name: 'company', label: 'Empresa' },
        { name: 'users', label: 'Usuários' },
        { name: 'backup', label: 'Backup' }
      ]
    },
    {
      title: 'Operacional',
      permissions: [
        { name: 'deliveries', label: 'Entregas' },
        { name: 'shipments', label: 'Embarques' },
        { name: 'shipmentReports', label: 'Relatório de Embarques' },
        { name: 'cities', label: 'Cidades' },
        { name: 'priceTables', label: 'Tabela de Preços' }
      ]
    },
    {
      title: 'Financeiro',
      permissions: [
        { name: 'financialDashboard', label: 'Dashboard Financeiro' },
        { name: 'reportsToClose', label: 'Relatórios a Fechar' },
        { name: 'closing', label: 'Fechamento' },
        { name: 'receivableAccounts', label: 'Contas a Receber' },
        { name: 'payableAccounts', label: 'Contas a Pagar' },
        { name: 'financialReports', label: 'Relatórios Financeiros' }
      ]
    },
    {
      title: 'Frota',
      permissions: [
        { name: 'vehicles', label: 'Veículos' },
        { name: 'logbook', label: 'Diário de Bordo' },
        { name: 'maintenance', label: 'Manutenções' }
      ]
    },
    {
      title: 'Estoque',
      permissions: [
        { name: 'products', label: 'Produtos' },
        { name: 'inventoryEntries', label: 'Entradas' },
        { name: 'inventoryExits', label: 'Saídas' },
        { name: 'inventoryDashboard', label: 'Dashboard Estoque' }
      ]
    }
  ];

  // Define permissão padrão se não existir
  const getPermission = (name: string) => {
    return permissions[name] || { view: false, create: false, edit: false, delete: false };
  };

  return (
    <div className="space-y-6">
      {permissionGroups.map((group) => (
        <Card key={group.title} className="border-gray-200">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base">{group.title}</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="grid grid-cols-5 gap-2 pb-1 font-semibold text-xs">
              <div className="col-span-1">Recurso</div>
              <div className="col-span-1 text-center">Visualizar</div>
              <div className="col-span-1 text-center">Incluir</div>
              <div className="col-span-1 text-center">Editar</div>
              <div className="col-span-1 text-center">Excluir</div>
            </div>
            {group.permissions.map((perm) => (
              <PermissionRow
                key={perm.name}
                name={perm.name}
                label={perm.label}
                permission={getPermission(perm.name)}
                onChange={onChange}
                isAdmin={isAdmin}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
