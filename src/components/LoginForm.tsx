import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
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
  const [isResetting, setIsResetting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  
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
      // Para o modo de demonstração, se o usuário for 'admin', usar o login mock
      if (username === 'admin') {
        console.log("Usando login de administrador para demo");
        const success = await login(username, password);
        
        if (success) {
          navigate('/dashboard');
        }
        return;
      }
      
      // Para outros usuários, tentar Supabase
      const email = username.includes('@') ? username : `${username}@velomax.com`;
      
      console.log(`Tentando login com email: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        console.error("Erro de login Supabase:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("Login bem-sucedido com Supabase");
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${data.user.email}!`,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Falha no login:', error);
      toast({
        title: "Erro de autenticação",
        description: "Nome de usuário ou senha incorretos",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword || !registerName) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para cadastro.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRegistering(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            name: registerName
          },
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso. Você já pode fazer login.",
      });
      
      // Reset form
      setIsRegistering(false);
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterName('');
      
      // Switch back to login tab
      setIsRegistering(false);
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao criar sua conta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
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
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Acesso ao Sistema
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Entre com suas credenciais para acessar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Usuário
          </Label>
          <div className="relative">
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
              placeholder="Digite seu usuário"
              disabled={isSubmitting}
            />
            <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="Digite sua senha"
              disabled={isSubmitting}
            />
            <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-velomax-blue hover:bg-blue-800 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Autenticando..." : "Entrar"}
        </Button>

        <div className="mt-6 flex items-center justify-between">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="link" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
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
          
          <Button
            type="button"
            variant="link"
            onClick={() => setIsRegistering(true)}
            className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Criar uma conta
          </Button>
        </div>
      </form>

      {isRegistering ? (
        // Registration form
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-name">Nome Completo</Label>
              <Input
                id="register-name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Digite seu nome completo"
                disabled={isRegistering}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Digite seu email"
                disabled={isRegistering}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Senha</Label>
              <Input
                id="register-password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Crie uma senha"
                disabled={isRegistering}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-velomax-blue hover:bg-blue-800"
              disabled={isRegistering}
            >
              {isRegistering ? "Criando conta..." : "Criar conta"}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setIsRegistering(false)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Já tem uma conta? Faça login
            </Button>
          </CardFooter>
        </form>
      ) : (
        // Login form
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-700">
                Para acessar o sistema, você precisa de uma conta válida. O usuário <strong>admin</strong> está disponível para demonstração.
              </AlertDescription>
            </Alert>

            
          </CardContent>
          
        </form>
      )}
    </div>
  );
};
