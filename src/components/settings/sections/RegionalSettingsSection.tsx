
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Globe, Clock } from 'lucide-react';

interface RegionalSettingsSectionProps {
  timezone: string;
  setTimezone: (value: string) => void;
  enableAuditLog: boolean;
  setEnableAuditLog: (value: boolean) => void;
  isEditable: boolean;
}

export function RegionalSettingsSection({
  timezone,
  setTimezone,
  enableAuditLog,
  setEnableAuditLog,
  isEditable
}: RegionalSettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Regionais</CardTitle>
        <CardDescription>
          Defina o fuso horário e as configurações regionais do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-4">
          <Globe className="h-5 w-5 text-green-500 mt-1" />
          <div className="space-y-1 flex-1">
            <Label htmlFor="timezone">Fuso Horário</Label>
            <Select value={timezone} onValueChange={setTimezone} disabled={!isEditable}>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Selecione o fuso horário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                <SelectItem value="America/Belem">Belém (GMT-3)</SelectItem>
                <SelectItem value="America/Bahia">Salvador (GMT-3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <Clock className="h-5 w-5 text-purple-500 mt-1" />
          <div className="space-y-1 flex-1">
            <div className="flex items-center space-x-2">
              <Switch
                id="audit-log"
                checked={enableAuditLog}
                onCheckedChange={setEnableAuditLog}
                disabled={!isEditable}
              />
              <Label htmlFor="audit-log">Habilitar Log de Auditoria</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Registra todas as ações dos usuários para fins de auditoria e segurança.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
