
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">VeloMax</h1>
        <p className="text-muted-foreground">Sistema de Gestão de Entregas</p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Button asChild className="w-full">
          <Link to="/login">Login</Link>
        </Button>
        
        <Button asChild variant="outline" className="w-full">
          <Link to="/dashboard">Dashboard</Link>
        </Button>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p>Versão de teste: Acesse o dashboard para visualizar as funcionalidades</p>
      </div>
    </div>
  );
};

export default Index;
