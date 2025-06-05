
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-500 dark:text-gray-500 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Ir para o Dashboard
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Button variant="secondary" onClick={handleRefresh} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recarregar Página
          </Button>
        </div>
        
        <div className="mt-8 text-xs text-gray-400">
          <p>Caminho tentado: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">{location.pathname}</code></p>
          <p className="mt-2">Se o problema persistir, tente limpar o cache do navegador.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
