import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LockIcon, UserIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome de usuário e senha.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // Toast is already shown in the login function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotUsername || !newPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome de usuário e a nova senha.",
        variant: "destructive"
      });
      return;
    }

    setIsResetting(true);
    
    try {
      // For now, show a message about contacting admin
      toast({
        title: "Recurso temporariamente indisponível",
        description: "Por favor, entre em contato com o administrador do sistema para redefinir sua senha.",
        variant: "default"
      });
      
      // Close dialog and clear fields
      setIsDialogOpen(false);
      setForgotUsername('');
      setNewPassword('');
    } catch (error) {
      console.error('Password reset failed:', error);
      toast({
        title: "Erro ao redefinir senha",
        description: "Ocorreu um erro ao tentar redefinir sua senha.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Acesso ao Sistema</CardTitle>
        <CardDescription className="text-center">
          Entre com seu usuário e senha para acessar o sistema
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                placeholder="Digite seu nome de usuário"
                className="pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full bg-velomax-blue hover:bg-blue-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Autenticando..." : "Entrar"}
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                Esqueci minha senha
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Recuperação de Senha</DialogTitle>
                <DialogDescription>
                  Preencha seu nome de usuário e uma nova senha
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleResetPassword} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-username">Nome de Usuário</Label>
                  <Input
                    id="forgot-username"
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    disabled={isResetting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isResetting}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isResetting}>
                    {isResetting ? "Redefinindo..." : "Redefinir Senha"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </form>
    </Card>
  );
};
