
import React from 'react';
import { UserButton } from './user/UserButton';
import { MainNav } from '@/components/MainNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ViewSizeToggle } from './ViewSizeToggle';
import { GlobalSearch } from './GlobalSearch';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppHeader() {
  const { isMobile } = useIsMobile();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={`container flex ${isMobile ? "flex-col" : "h-14"} items-center`}>
        <MainNav />
        <div className={`flex ${isMobile ? "w-full mt-2 pb-2" : "flex-1"} items-center justify-end space-x-2`}>
          <GlobalSearch />
          <ViewSizeToggle />
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
