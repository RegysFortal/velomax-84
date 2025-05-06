
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@/types';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { usePermissions } from './usePermissions';

const userFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  username: z.string().min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().optional(),
  role: z.enum(['admin', 'manager', 'user'], {
    required_error: 'Selecione uma função',
  }),
  department: z.string().optional(),
  position: z.string().optional(),
  phone: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const useUserForm = (user: User | null, isCreating: boolean, onClose: () => void) => {
  const { createUser, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Initialize form with default values
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      role: (user?.role as 'user' | 'admin' | 'manager') || 'user',
      department: user?.department || '',
      position: user?.position || '',
      phone: user?.phone || '',
    },
    mode: 'onChange',
  });

  const currentRole = form.watch('role');
  const isAdmin = currentRole === 'admin';

  const {
    permissions,
    isLoadingPermissions,
    permissionsInitialized,
    handlePermissionChange,
  } = usePermissions(user, isCreating, currentRole);

  // Use stable callback for tab changes
  const handleTabChange = useCallback((value: string) => {
    console.log("Mudando para tab:", value);
    setActiveTab(value);
  }, []);

  const onSubmit = async (data: UserFormValues) => {
    console.log("Formulário enviado com dados:", data);
    setIsSubmitting(true);
    
    try {
      if (isCreating) {
        if (!data.password) {
          toast.error("Senha obrigatória", {
            description: "Você deve fornecer uma senha para o novo usuário.",
          });
          setIsSubmitting(false);
          return;
        }

        console.log("Criando novo usuário com permissões:", permissions);
        const newUser = await createUser({
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role,
          department: data.department || undefined,
          position: data.position || undefined,
          phone: data.phone || undefined,
          permissions: permissions,
          updatedAt: new Date().toISOString(),
        });

        toast.success("Usuário criado", {
          description: `O usuário ${newUser.name} foi criado com sucesso.`,
        });
      } else if (user) {
        const updatedUser: Partial<User> = {
          name: data.name,
          username: data.username,
          email: data.email,
          role: data.role,
          department: data.department || undefined,
          position: data.position || undefined,
          phone: data.phone || undefined,
          permissions: permissions,
          updatedAt: new Date().toISOString(),
        };

        console.log("Atualizando usuário com ID:", user.id, "e dados:", updatedUser);
        
        if (data.password) {
          updatedUser.password = data.password;
        }

        await updateUser(user.id, updatedUser);
        toast.success("Usuário atualizado", {
          description: `As informações do usuário ${user.name} foram atualizadas com sucesso.`,
        });
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error("Erro ao salvar usuário", {
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar as informações do usuário.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    activeTab,
    handleTabChange,
    isSubmitting,
    onSubmit,
    isAdmin,
    permissions,
    isLoadingPermissions,
    permissionsInitialized,
    handlePermissionChange
  };
};
