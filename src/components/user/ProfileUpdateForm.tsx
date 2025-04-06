
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export const ProfileUpdateForm = () => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, updateUserProfile } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (!name.trim()) {
      toast.error('O nome é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUserProfile({ name });
      toast.success('Perfil atualizado com sucesso');
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar o perfil');
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">O email não pode ser alterado</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Input
              id="role"
              value={user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Gerente' : 'Usuário'}
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Atualizando..." : "Atualizar Perfil"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
