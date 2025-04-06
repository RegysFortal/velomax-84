import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export const PasswordUpdateForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, updateUserPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('A nova senha e a confirmação não coincidem');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUserPassword(currentPassword, newPassword);
      toast.success('Senha atualizada com sucesso');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro ao atualizar a senha');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atualizar Senha</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Digite sua senha atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Digite a nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirme a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Atualizando..." : "Atualizar Senha"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
