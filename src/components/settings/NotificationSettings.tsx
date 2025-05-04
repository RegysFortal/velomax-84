
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Bell, MessageSquare, AlertTriangle, TruckIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  key: string; // database key
}

export function NotificationSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'new-deliveries',
      key: 'new_deliveries',
      title: 'Novas Entregas',
      description: 'Receba notificações quando novas entregas forem registradas.',
      enabled: true,
      icon: <TruckIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 'delivery-status',
      key: 'delivery_status',
      title: 'Status de Entregas',
      description: 'Receba notificações quando o status das entregas mudar.',
      enabled: true,
      icon: <Bell className="h-5 w-5 text-green-500" />,
    },
    {
      id: 'client-messages',
      key: 'client_messages',
      title: 'Mensagens de Clientes',
      description: 'Receba notificações quando clientes enviarem mensagens.',
      enabled: false,
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
    },
    {
      id: 'email-summary',
      key: 'email_summary',
      title: 'Resumo por Email',
      description: 'Receba um resumo diário das atividades por email.',
      enabled: true,
      icon: <Mail className="h-5 w-5 text-indigo-500" />,
    },
    {
      id: 'system-alerts',
      key: 'system_alerts',
      title: 'Alertas do Sistema',
      description: 'Receba notificações sobre problemas e alertas do sistema.',
      enabled: true,
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    },
  ]);

  // Load user's notification settings
  useEffect(() => {
    const loadNotificationSettings = async () => {
      if (!user) return;
      
      try {
        // First try to load from Supabase
        const { data, error } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
          console.error("Error loading notification settings:", error);
        } else if (data) {
          // Update settings from database
          setSettings(prevSettings => prevSettings.map(setting => ({
            ...setting,
            enabled: data[setting.key] !== undefined ? data[setting.key] : setting.enabled
          })));
          return; // Early return if we loaded from Supabase
        }
        
        // Fallback to localStorage
        const storedSettings = localStorage.getItem('notification_settings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error("Error loading notification preferences:", error);
      }
    };

    loadNotificationSettings();
  }, [user]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const saveSettings = async () => {
    try {
      // Save to localStorage for backward compatibility
      localStorage.setItem('notification_settings', JSON.stringify(settings));
      
      // Save to Supabase if we're connected
      if (user) {
        const settingsObject = settings.reduce((obj, setting) => {
          obj[setting.key] = setting.enabled;
          return obj;
        }, {} as Record<string, boolean>);
        
        // Check if the user already has notification settings
        const { data: existingSettings, error: fetchError } = await supabase
          .from('notification_settings')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (fetchError) {
          console.error("Error fetching notification settings:", fetchError);
        }
        
        if (existingSettings) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('notification_settings')
            .update({
              ...settingsObject,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingSettings.id);
          
          if (updateError) {
            console.error("Error updating notification settings:", updateError);
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('notification_settings')
            .insert([{
              user_id: user.id,
              ...settingsObject
            }]);
          
          if (insertError) {
            console.error("Error inserting notification settings:", insertError);
          }
        }
      }
      
      toast.success("Configurações salvas", {
        description: "Suas preferências de notificação foram atualizadas.",
      });
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast.error("Erro ao salvar", {
        description: "Não foi possível salvar suas preferências de notificação.",
      });
    }
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
