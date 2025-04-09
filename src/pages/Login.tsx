
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Logo } from '@/components/ui/logo';

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
          src="/lovable-uploads/e65f8895-c8f1-4e81-a9d0-4e008d4fed5a.png" 
          alt="Velomax Brasil Logo" 
          className="h-24 mx-auto mb-4" 
        />
        <h1 className="text-3xl font-bold tracking-tight text-navy-blue">Velomax Brasil</h1>
        <p className="text-muted-foreground mt-1">Sistema de Gerenciamento de Fretes</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-8">
        <Logo className="h-12 w-auto text-primary" />
      </div>
    </div>
  );
}

export default Login;
