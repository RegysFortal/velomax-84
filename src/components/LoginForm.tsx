
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

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
      // Use the username as the email, appending a domain if necessary
      const email = username.includes('@') ? username : `${username}@velomax.com`;
      
      // Login via Supabase using email and password
      console.log(`Attempting login with email: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        
        // For demo version, if the user enters admin, use the mock login
        if (username === 'admin') {
          console.log("Falling back to mock admin login for demo version");
          await login(username, password);
          return;
        }
        
        throw error;
      }
      
      if (data.user) {
        console.log("Login successful with Supabase");
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${data.user.email}!`,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Erro de autenticação",
        description: "Nome de usuário ou senha incorretos",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotUsername) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o nome de usuário.",
        variant: "destructive"
      });
      return;
    }

    setIsResetting(true);
    
    try {
      const email = forgotUsername.includes('@') ? forgotUsername : `${forgotUsername}@velomax.com`;
      
      // We use Supabase's password reset functionality
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Instruções para redefinir sua senha foram enviadas para o seu email.",
        variant: "default"
      });
      
      setIsDialogOpen(false);
      setForgotUsername('');
    } catch (error) {
      console.error('Password reset failed:', error);
      toast({
        title: "Erro ao redefinir senha",
        description: "Ocorreu um erro ao tentar redefinir sua senha. Contate o administrador.",
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
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-700">
              Para acessar o sistema, você precisa de uma conta válida. O usuário <strong>admin</strong> está disponível para demonstração.
            </AlertDescription>
          </Alert>

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
                  Informe seu nome de usuário ou email para receber instruções de redefinição.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleResetPassword} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-username">Nome de Usuário ou Email</Label>
                  <Input
                    id="forgot-username"
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    disabled={isResetting}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isResetting}>
                    {isResetting ? "Enviando..." : "Enviar Instruções"}
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
