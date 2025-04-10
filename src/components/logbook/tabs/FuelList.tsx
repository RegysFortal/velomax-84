
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const FuelList: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Abastecimentos</CardTitle>
        <CardDescription>
          Registros de abastecimentos de combustível dos veículos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Implementação dos abastecimentos em andamento.</p>
      </CardContent>
    </Card>
  );
};
