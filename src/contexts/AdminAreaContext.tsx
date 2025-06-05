
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAreaContextType {
  isAdminArea: boolean;
  enterAdminArea: (password: string) => boolean;
  exitAdminArea: () => void;
}

const AdminAreaContext = createContext<AdminAreaContextType | undefined>(undefined);

export const AdminAreaProvider = ({ children }: { children: ReactNode }) => {
  const [isAdminArea, setIsAdminArea] = useState<boolean>(() => {
    const stored = localStorage.getItem('velomax_admin_area');
    return stored === 'true';
  });

  const ADMIN_PASSWORD = 'M7x2r4a8@';

  const enterAdminArea = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminArea(true);
      localStorage.setItem('velomax_admin_area', 'true');
      return true;
    }
    return false;
  };

  const exitAdminArea = () => {
    setIsAdminArea(false);
    localStorage.removeItem('velomax_admin_area');
  };

  useEffect(() => {
    localStorage.setItem('velomax_admin_area', isAdminArea.toString());
  }, [isAdminArea]);

  return (
    <AdminAreaContext.Provider value={{ isAdminArea, enterAdminArea, exitAdminArea }}>
      {children}
    </AdminAreaContext.Provider>
  );
};

export const useAdminArea = () => {
  const context = useContext(AdminAreaContext);
  if (!context) {
    throw new Error('useAdminArea must be used within an AdminAreaProvider');
  }
  return context;
};
