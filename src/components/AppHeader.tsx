
import React from 'react';
import { UserButton } from './user/UserButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ViewSizeToggle } from './ViewSizeToggle';
import { GlobalSearch } from './GlobalSearch';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavMenu } from './NavMenu';
import { Button } from '@/components/ui/button';
import { Home, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

export function AppHeader() {
  const { isMobile } = useIsMobile();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 pt-10 w-[85%] overflow-y-auto">
              <NavMenu />
            </SheetContent>
          </Sheet>
        ) : (
          <div className="mr-4 flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link to="/dashboard">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
            <NavMenu />
          </div>
        )}

        <div className="flex flex-1 items-center justify-end space-x-2">
          <GlobalSearch />
          <ViewSizeToggle />
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
