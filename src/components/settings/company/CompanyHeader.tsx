
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function CompanyHeader() {
  return (
    <CardHeader>
      <CardTitle>Dados da Empresa</CardTitle>
      <CardDescription>
        Configure as informações da sua empresa que serão exibidas em relatórios e documentos.
      </CardDescription>
    </CardHeader>
  );
}
