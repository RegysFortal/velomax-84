
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/contexts/auth/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Coluna esquerda - Imagem e texto */}
        <div className="flex-1 text-center md:text-left">
          <img 
            src="/lovable-uploads/e65f8895-c8f1-4e81-a9d0-4e008d4fed5a.png" 
            alt="Velomax Brasil Logo" 
            className="h-32 mx-auto md:mx-0 mb-6" 
          />
          <h1 className="text-4xl font-bold tracking-tight text-navy-blue dark:text-white mb-4">
            Bem-vindo à Velomax Brasil
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Sistema integrado de gerenciamento de fretes e logística
          </p>
        </div>

        {/* Coluna direita - Formulário de login */}
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
