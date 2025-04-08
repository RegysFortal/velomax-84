
import React from 'react';
import { UserButton } from '@/components/user/UserButton';
import { MainNav } from '@/components/MainNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ViewSizeToggle } from './ViewSizeToggle';
import { GlobalSearch } from './GlobalSearch';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav />
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
