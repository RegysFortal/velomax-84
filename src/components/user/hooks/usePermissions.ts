
import { useState, useCallback, useEffect } from 'react';
import { PermissionLevel, User } from '@/types';
import { toast } from 'sonner';

export type PermissionsState = {
  permissions: Record<string, PermissionLevel>;
  isLoadingPermissions: boolean;
  permissionsInitialized: boolean;
}

export const usePermissions = (user: User | null, isCreating: boolean, currentRole?: string) => {
  const [permissions, setPermissions] = useState<Record<string, PermissionLevel>>({});
  const [permissionsInitialized, setPermissionsInitialized] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false); // Changed to false by default
  
  const defaultPermission: PermissionLevel = {
    view: false,
    create: false,
    edit: false, 
    delete: false
  };

  // Memoize the initializePermissions function to avoid unnecessary re-renders
  const initializePermissions = useCallback((userPermissions?: Record<string, any>) => {
    const defaultPermissions: Record<string, PermissionLevel> = {
      dashboard: { ...defaultPermission, view: true }, // Dashboard é sempre visível por padrão
      deliveries: { ...defaultPermission },
      shipments: { ...defaultPermission },
      shipmentReports: { ...defaultPermission },
      financialDashboard: { ...defaultPermission },
      reportsToClose: { ...defaultPermission },
      closing: { ...defaultPermission },
      cities: { ...defaultPermission },
      priceTables: { ...defaultPermission },
      receivableAccounts: { ...defaultPermission },
      payableAccounts: { ...defaultPermission },
      financialReports: { ...defaultPermission },
      vehicles: { ...defaultPermission },
      logbook: { ...defaultPermission },
      maintenance: { ...defaultPermission },
      products: { ...defaultPermission },
      inventoryEntries: { ...defaultPermission },
      inventoryExits: { ...defaultPermission },
      inventoryDashboard: { ...defaultPermission },
      system: { ...defaultPermission },
      company: { ...defaultPermission },
      users: { ...defaultPermission },
      backup: { ...defaultPermission },
      budgets: { ...defaultPermission },
    };

    // Se o usuário já tiver permissões, converter do formato antigo para o novo
    if (userPermissions) {
      Object.entries(userPermissions).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          // Formato antigo (boolean)
          if (defaultPermissions[key]) {
            defaultPermissions[key] = {
              view: value,
              create: value,
              edit: value,
              delete: value
            };
          }
        } else if (typeof value === 'object') {
          // Já está no novo formato
          defaultPermissions[key] = value as PermissionLevel;
        }
      });
    }

    return defaultPermissions;
  }, [defaultPermission]);

  // Function to safely initialize permissions with delay
  const initializePermissionsWithDelay = useCallback((userPermissions?: Record<string, any>, delay: number = 100) => {
    console.log("Inicializando permissões com delay:", delay, "ms");
    setIsLoadingPermissions(true);
    setPermissionsInitialized(false);
    
    // Use setTimeout instead of requestAnimationFrame for more reliable behavior
    setTimeout(() => {
      try {
        const initializedPermissions = initializePermissions(userPermissions);
        console.log("Permissões inicializadas:", Object.keys(initializedPermissions).length);
        setPermissions(initializedPermissions);
        setPermissionsInitialized(true);
      } catch (err) {
        console.error("Erro ao inicializar permissões:", err);
        toast.error("Erro ao carregar permissões", { 
          description: "Tente novamente ou contate o suporte."
        });
      } finally {
        setIsLoadingPermissions(false);
      }
    }, delay);
  }, [initializePermissions]);

  // Manipulador para alterar permissões individuais
  const handlePermissionChange = useCallback((name: string, level: keyof PermissionLevel, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [level]: value
      }
    }));
  }, []);

  // Atualiza permissões quando o papel é alterado
  useEffect(() => {
    // Only update permissions if permissions are initialized, and we're not still loading
    if (!permissionsInitialized || isLoadingPermissions || !currentRole) return;
    
    console.log("Atualizando permissões baseado no papel:", currentRole);
    
    // Use setTimeout to avoid UI freezing when updating permissions
    setTimeout(() => {
      try {
        if (currentRole === 'admin') {
          // Administradores têm acesso total a tudo
          const adminPermissions: Record<string, PermissionLevel> = {};
          Object.keys(permissions).forEach(key => {
            adminPermissions[key] = {
              view: true,
              create: true,
              edit: true,
              delete: true
            };
          });
          setPermissions(adminPermissions);
        } else if (currentRole === 'manager' && isCreating) {
          // Gerentes têm acesso a mais recursos, mas não todos
          const managerPermissions = initializePermissions();
          
          // Definir permissões padrão para gerentes
          ['dashboard', 'deliveries', 'shipments', 'shipmentReports', 'cities',
           'vehicles', 'logbook', 'maintenance', 'financialDashboard',
           'reportsToClose', 'closing', 'receivableAccounts', 'payableAccounts',
           'priceTables', 'financialReports', 'backup'].forEach(key => {
            if (managerPermissions[key]) {
              managerPermissions[key].view = true;
              managerPermissions[key].create = true;
              managerPermissions[key].edit = true;
              managerPermissions[key].delete = key !== 'backup'; // Gerentes não podem excluir backups
            }
          });

          setPermissions(managerPermissions);
        } else if (currentRole === 'user' && isCreating) {
          // Usuários comuns têm acesso limitado
          const userPermissions = initializePermissions();
          
          // Definir permissões padrão para usuários
          ['dashboard', 'deliveries', 'shipments'].forEach(key => {
            if (userPermissions[key]) {
              userPermissions[key].view = true;
              userPermissions[key].create = false;
              userPermissions[key].edit = false;
              userPermissions[key].delete = false;
            }
          });
          
          setPermissions(userPermissions);
        }
      } catch (err) {
        console.error("Erro ao atualizar permissões baseado no papel:", err);
      }
    }, 100);
  }, [currentRole, isCreating, permissions, initializePermissions, permissionsInitialized, isLoadingPermissions]);

  // Initial permission initialization
  useEffect(() => {
    // Initialize permissions immediately when component mounts
    if (!permissionsInitialized && !isLoadingPermissions) {
      initializePermissionsWithDelay(user?.permissions, 10);
    }
  }, []);

  return {
    permissions,
    isLoadingPermissions,
    permissionsInitialized,
    initializePermissionsWithDelay,
    handlePermissionChange,
    setPermissions,
  };
};
