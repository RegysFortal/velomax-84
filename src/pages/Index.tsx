
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">VeloMax</h1>
        <p className="text-muted-foreground">Sistema de Gestão de Entregas</p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Button asChild className="w-full">
          <Link to="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Entrar
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
