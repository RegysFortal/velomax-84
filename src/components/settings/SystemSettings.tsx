
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { HardDrive, Database, Globe, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SystemSettings() {
  const { user } = useAuth();
  const [isEditable, setIsEditable] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [dataRetention, setDataRetention] = useState('90');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [enableAuditLog, setEnableAuditLog] = useState(true);
  const [apiKey, setApiKey] = useState('****************************************');
  const [showApiKey, setShowApiKey] = useState(false);

  // Check if current user has permissions to edit system settings
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (user) {
          const { data: hasAccess, error } = await supabase.rpc('user_has_system_settings_access');
          
          if (error) {
            console.error("Error checking permissions:", error);
            // Fallback to client-side role check
            setIsEditable(user.role === 'admin');
          } else {
            setIsEditable(!!hasAccess);
          }
        } else {
          setIsEditable(false);
        }
      } catch (error) {
        console.error("Error checking system permissions:", error);
        // Fallback to client-side role check if there's an error
        setIsEditable(user?.role === 'admin');
      }
    };
    
    checkPermissions();
  }, [user]);

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('system_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setBackupFrequency(settings.backupFrequency || 'daily');
        setDataRetention(settings.dataRetention || '90');
        setTimezone(settings.timezone || 'America/Sao_Paulo');
        setEnableAuditLog(settings.enableAuditLog !== undefined ? settings.enableAuditLog : true);
      } catch (error) {
        console.error("Error parsing saved settings:", error);
      }
    }
  }, []);

  const handleSave = async () => {
    if (!isEditable) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para salvar configurações do sistema.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Save to localStorage for backward compatibility
      const settings = {
        backupFrequency,
        dataRetention,
        timezone,
        enableAuditLog,
      };
      
      localStorage.setItem('system_settings', JSON.stringify(settings));
      
      // Try to save to Supabase if we're connected
      if (user) {
        // For each setting, upsert to the system_settings table
        const settingsArray = [
          { key: 'backup_frequency', value: JSON.stringify(backupFrequency) },
          { key: 'data_retention', value: JSON.stringify(parseInt(dataRetention)) },
          { key: 'timezone', value: JSON.stringify(timezone) },
          { key: 'enable_audit_log', value: JSON.stringify(enableAuditLog) },
        ];
        
        for (const setting of settingsArray) {
          const { data: existingSetting, error: fetchError } = await supabase
            .from('system_settings')
            .select('*')
            .eq('key', setting.key)
            .single();
          
          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error(`Error fetching ${setting.key}:`, fetchError);
            continue;
          }
          
          if (existingSetting) {
            const { error: updateError } = await supabase
              .from('system_settings')
              .update({ 
                value: setting.value,
                updated_at: new Date().toISOString(),
                user_id: user.id
              })
              .eq('id', existingSetting.id);
            
            if (updateError) {
              console.error(`Error updating ${setting.key}:`, updateError);
            }
          } else {
            const { error: insertError } = await supabase
              .from('system_settings')
              .insert([{
                key: setting.key,
                value: setting.value,
                user_id: user.id
              }]);
            
            if (insertError) {
              console.error(`Error inserting ${setting.key}:`, insertError);
            }
          }
        }
      }
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive"
      });
    }
  };

  const generateNewApiKey = () => {
    if (!isEditable) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para gerar uma nova chave API.",
        variant: "destructive"
      });
      return;
    }
    
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

  if (!isEditable) {
    return (
      <div className="space-y-6">
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você está visualizando as configurações do sistema em modo somente leitura. Você não tem permissão para modificá-las.
          </AlertDescription>
        </Alert>
        {/* Show read-only version of settings */}
        <Card>
          <CardHeader>
            <CardTitle>Backup e Retenção de Dados</CardTitle>
            <CardDescription>
              Configurações de backup e retenção de dados do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2">
              <div className="font-medium">Frequência de Backup:</div>
              <div>{
                backupFrequency === 'hourly' ? 'A cada hora' :
                backupFrequency === 'daily' ? 'Diário' :
                backupFrequency === 'weekly' ? 'Semanal' : 'Mensal'
              }</div>
              
              <div className="font-medium">Retenção de Dados (dias):</div>
              <div>{dataRetention}</div>
              
              <div className="font-medium">Fuso Horário:</div>
              <div>{timezone === 'America/Sao_Paulo' ? 'Brasília (GMT-3)' : timezone}</div>
              
              <div className="font-medium">Log de Auditoria:</div>
              <div>{enableAuditLog ? 'Ativado' : 'Desativado'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
