
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { HardDrive, Database } from 'lucide-react';

interface BackupRetentionSectionProps {
  backupFrequency: string;
  setBackupFrequency: (value: string) => void;
  dataRetention: string;
  setDataRetention: (value: string) => void;
  isEditable: boolean;
}

export function BackupRetentionSection({
  backupFrequency,
  setBackupFrequency,
  dataRetention,
  setDataRetention,
  isEditable
}: BackupRetentionSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup e Retenção de Dados</CardTitle>
        <CardDescription>
          Configure as políticas de backup e retenção de dados do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-4">
          <HardDrive className="h-5 w-5 text-blue-500 mt-1" />
          <div className="space-y-1 flex-1">
            <Label htmlFor="backup-frequency">Frequência de Backup</Label>
            <Select value={backupFrequency} onValueChange={setBackupFrequency} disabled={!isEditable}>
              <SelectTrigger id="backup-frequency">
                <SelectValue placeholder="Selecione a frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">A cada hora</SelectItem>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <Database className="h-5 w-5 text-indigo-500 mt-1" />
          <div className="space-y-1 flex-1">
            <Label htmlFor="data-retention">Retenção de Dados (dias)</Label>
            <Input
              id="data-retention"
              type="number"
              value={dataRetention}
              onChange={(e) => setDataRetention(e.target.value)}
              min="1"
              disabled={!isEditable}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
