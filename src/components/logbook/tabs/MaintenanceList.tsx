
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const MaintenanceList: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manutenções</CardTitle>
        <CardDescription>
          Registros de manutenções realizadas nos veículos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Implementação das manutenções em andamento.</p>
      </CardContent>
    </Card>
  );
};
