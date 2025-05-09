
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractorTable } from '@/components/contractor/ContractorTable';
import { toast } from 'sonner';

export function ContractorsManagement() {
  const handleEditContractor = (id: string) => {
    toast.info("Edição de terceiro", {
      description: `Para editar detalhes completos, acesse a página de Terceiros.`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Terceiros</CardTitle>
          <CardDescription>
            Visualize e gerencie os terceiros da empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContractorTable onEditClick={handleEditContractor} />
        </CardContent>
      </Card>
    </div>
  );
}
