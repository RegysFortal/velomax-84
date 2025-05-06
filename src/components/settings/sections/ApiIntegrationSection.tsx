
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ApiIntegrationSectionProps {
  apiKey: string;
  showApiKey: boolean;
  setShowApiKey: (show: boolean) => void;
  generateNewApiKey: () => void;
  isEditable: boolean;
}

export function ApiIntegrationSection({
  apiKey,
  showApiKey,
  setShowApiKey,
  generateNewApiKey,
  isEditable
}: ApiIntegrationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API e Integração</CardTitle>
        <CardDescription>
          Gerencie chaves de API e configurações de integração.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">Chave de API</Label>
          <div className="flex">
            <Input
              id="api-key"
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              readOnly
              className="flex-1 font-mono"
            />
            <Button
              type="button"
              variant="outline"
              className="ml-2"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? "Ocultar" : "Mostrar"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Esta chave é usada para acessar a API do sistema. Mantenha-a segura.
          </p>
        </div>
        <Button variant="outline" onClick={generateNewApiKey} disabled={!isEditable}>
          Gerar Nova Chave API
        </Button>
      </CardContent>
    </Card>
  );
}
