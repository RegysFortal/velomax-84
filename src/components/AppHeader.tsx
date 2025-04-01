
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOutIcon, MenuIcon, User, XIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { MainNav } from './MainNav';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export function AppHeader() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 sm:px-6">
        {isMobile && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2 md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link
                  to="/dashboard"
                  className="flex items-center"
                  onClick={() => setOpen(false)}
                >
                  <img
                    src="/lovable-uploads/04beabb0-1159-4258-bd64-dcf2b0133018.png"
                    alt="Velomax Brasil Logo"
                    className="h-8 mr-2"
                  />
                  <span className="text-lg font-bold">
                    Gerenciamento de cargas
                  </span>
                </Link>
              </div>
              <div className="mt-8 px-2">
                <MainNav className="flex flex-col space-y-3" isMobile />
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            {!isMobile && (
              <Link to="/dashboard" className="flex items-center">
                <img 
                  src="/lovable-uploads/04beabb0-1159-4258-bd64-dcf2b0133018.png" 
                  alt="Velomax Brasil Logo" 
                  className="h-8 mr-2" 
                />
                <span className="text-lg font-bold">Gerenciamento de cargas</span>
              </Link>
            )}
            
            {!isMobile && (
              <nav className="ml-8">
                <MainNav className="flex space-x-4 lg:space-x-6" />
              </nav>
            )}
          </div>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={cn(
                      "bg-velomax-blue text-white",
                      user.role === 'admin' && "bg-velomax-red"
                    )}>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {user.role === 'admin' 
                        ? 'Administrador' 
                        : user.role === 'manager' 
                          ? 'Gerente' 
                          : 'Usuário'}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => logout()}
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
