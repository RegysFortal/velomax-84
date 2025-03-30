
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="mb-8 text-center">
        <img 
          src="/lovable-uploads/04beabb0-1159-4258-bd64-dcf2b0133018.png" 
          alt="Velomax Brasil Logo" 
          className="h-16 mx-auto mb-3" 
        />
        <h1 className="text-3xl font-bold tracking-tight">Freight Keeper Pro</h1>
        <p className="text-muted-foreground mt-1">Sistema de Gerenciamento de Fretes</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Para demonstração, use:</p>
        <p className="mt-1">Usuário: <strong>admin</strong> / Senha: <strong>admin123</strong></p>
        <p>Usuário: <strong>manager</strong> / Senha: <strong>manager123</strong></p>
        <p>Usuário: <strong>user</strong> / Senha: <strong>user123</strong></p>
      </div>
    </div>
  );
};

export default Login;
