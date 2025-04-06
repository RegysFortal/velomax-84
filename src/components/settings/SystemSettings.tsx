
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { HardDrive, Database, Globe, Clock } from 'lucide-react';

export function SystemSettings() {
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [dataRetention, setDataRetention] = useState('90');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [enableAuditLog, setEnableAuditLog] = useState(true);
  const [apiKey, setApiKey] = useState('****************************************');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    // Here you would save the settings to the database
    const settings = {
      backupFrequency,
      dataRetention,
      timezone,
      enableAuditLog,
    };
    
    localStorage.setItem('system_settings', JSON.stringify(settings));
    
    toast({
      title: "Configurações salvas",
      description: "As configurações do sistema foram atualizadas com sucesso.",
    });
  };

  const generateNewApiKey = () => {
    if (confirm('Tem certeza que deseja gerar uma nova chave API? A chave atual será invalidada.')) {
      // In a real application, you would call an API to generate a new key
      const newKey = 'new-' + Math.random().toString(36).substring(2, 15);
      setApiKey(newKey);
      setShowApiKey(true);
      
      toast({
        title: "Nova chave API gerada",
        description: "Uma nova chave API foi gerada. Guarde-a em um local seguro.",
      });
    }
  };

  return (
    <div className="space-y-6">
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
              <Select value={backupFrequency} onValueChange={setBackupFrequency}>
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
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
              <Select value={timezone} onValueChange={setTimezone}>
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
          <Button variant="outline" onClick={generateNewApiKey}>
            Gerar Nova Chave API
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Salvar Configurações</Button>
      </div>
    </div>
  );
}
