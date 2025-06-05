
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useAdminArea } from '@/contexts/AdminAreaContext';
import { useToast } from '@/components/ui/use-toast';

export function AdminAreaDialog() {
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { isAdminArea, enterAdminArea, exitAdminArea } = useAdminArea();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (enterAdminArea(password)) {
      toast({
        title: "Área administrativa ativada",
        description: "Você agora tem acesso a todos os recursos administrativos.",
      });
      setIsOpen(false);
      setPassword('');
    } else {
      toast({
        title: "Senha incorreta",
        description: "Por favor, verifique a senha e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleExitAdminArea = () => {
    exitAdminArea();
    toast({
      title: "Área administrativa desativada",
      description: "Você retornou à área normal do sistema.",
    });
  };

  if (isAdminArea) {
    return (
      <Button variant="outline" onClick={handleExitAdminArea} className="w-full justify-start">
        <Settings className="mr-2 h-4 w-4" />
        Sair da Área Administrativa
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Área Administrativa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Acesso à Área Administrativa</DialogTitle>
          <DialogDescription>
            Digite a senha para acessar a área administrativa e visualizar todos os menus do sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Senha</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha administrativa"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Entrar
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
