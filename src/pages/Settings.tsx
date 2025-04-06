
// Import the necessary files
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AppLayout } from '@/components/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound, MailIcon, ShieldCheck, AtSign, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileUpdateForm } from '@/components/user/ProfileUpdateForm';
import { PasswordUpdateForm } from '@/components/user/PasswordUpdateForm';

// Password form schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: 'A senha atual é obrigatória.',
    }),
    newPassword: z.string().min(8, {
      message: 'A nova senha deve ter pelo menos 8 caracteres.',
    }),
    confirmPassword: z.string().min(8, {
      message: 'A confirmação da senha deve ter pelo menos 8 caracteres.',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordFormSchema>;

const Settings = () => {
  const { user, updateUserProfile, updateUserPassword } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleUpdatePassword = async (data: PasswordFormData) => {
    try {
      await updateUserPassword(data.currentPassword, data.newPassword);
      toast('Senha atualizada com sucesso!', {
        description: 'Sua senha foi atualizada com segurança.',
      });
      passwordForm.reset();
    } catch (error) {
      toast('Erro ao atualizar senha', {
        description: 'Verifique a senha atual.',
        variant: 'destructive'
      });
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e informações de perfil.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e preferências de contato.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileUpdateForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Senha e Segurança</CardTitle>
                <CardDescription>
                  Altere sua senha e gerencie as configurações de segurança da sua conta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordUpdateForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência do sistema conforme sua preferência.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Tema</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Selecione um tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Escolha entre tema claro, escuro ou siga as preferências do seu sistema.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
