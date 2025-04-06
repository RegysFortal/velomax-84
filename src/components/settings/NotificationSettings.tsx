
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Mail, Bell, MessageSquare, AlertTriangle, TruckIcon } from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'new-deliveries',
      title: 'Novas Entregas',
      description: 'Receba notificações quando novas entregas forem registradas.',
      enabled: true,
      icon: <TruckIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 'delivery-status',
      title: 'Status de Entregas',
      description: 'Receba notificações quando o status das entregas mudar.',
      enabled: true,
      icon: <Bell className="h-5 w-5 text-green-500" />,
    },
    {
      id: 'client-messages',
      title: 'Mensagens de Clientes',
      description: 'Receba notificações quando clientes enviarem mensagens.',
      enabled: false,
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
    },
    {
      id: 'email-summary',
      title: 'Resumo por Email',
      description: 'Receba um resumo diário das atividades por email.',
      enabled: true,
      icon: <Mail className="h-5 w-5 text-indigo-500" />,
    },
    {
      id: 'system-alerts',
      title: 'Alertas do Sistema',
      description: 'Receba notificações sobre problemas e alertas do sistema.',
      enabled: true,
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const saveSettings = () => {
    // Here you would save the settings to the database
    localStorage.setItem('notification_settings', JSON.stringify(settings));
    
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificações</CardTitle>
        <CardDescription>
          Configure como e quando deseja receber notificações do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{setting.icon}</div>
              <div>
                <Label htmlFor={setting.id} className="text-base font-medium">
                  {setting.title}
                </Label>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
            </div>
            <Switch
              id={setting.id}
              checked={setting.enabled}
              onCheckedChange={() => toggleSetting(setting.id)}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={saveSettings}>Salvar Preferências</Button>
      </CardFooter>
    </Card>
  );
}
