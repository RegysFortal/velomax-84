
import * as React from "react"
import { useActivityLog } from "@/contexts";

const MOBILE_BREAKPOINT = 768

type MobileViewState = {
  isMobile: boolean;
  forcedMode: boolean | null;
}

// Verificar se está no navegador ou no servidor
const isBrowser = typeof window !== 'undefined';

// Nome da chave para armazenar a preferência no localStorage
const MOBILE_VIEW_STORAGE_KEY = 'velomax-mobile-view-preference';

export function useIsMobile() {
  // Inicializa o estado baseado no tamanho da tela atual ou preferência salva
  const [state, setState] = React.useState<MobileViewState>(() => {
    // Verifica se há uma preferência salva no localStorage
    if (isBrowser) {
      const savedPreference = localStorage.getItem(MOBILE_VIEW_STORAGE_KEY);
      if (savedPreference !== null) {
        const parsed = JSON.parse(savedPreference);
        return {
          isMobile: parsed.isMobile,
          forcedMode: parsed.forcedMode
        };
      }
    }
    
    // Caso contrário, detecta com base no tamanho da tela
    const initialIsMobile = isBrowser ? window.innerWidth < MOBILE_BREAKPOINT : false;
    return {
      isMobile: initialIsMobile,
      forcedMode: null
    };
  });

  // Safely get the addLog function if ActivityLogProvider is available
  let addLog;
  try {
    const { addLog: logFunction } = useActivityLog();
    addLog = logFunction;
  } catch (error) {
    // If ActivityLogProvider is not available, create a no-op function
    addLog = () => {};
    console.warn("ActivityLogProvider not found, logging is disabled");
  }

  // Efeito para detectar alterações de tamanho da tela
  React.useEffect(() => {
    if (!isBrowser) return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const onChange = () => {
      if (state.forcedMode === null) {
        setState(prev => ({
          ...prev,
          isMobile: window.innerWidth < MOBILE_BREAKPOINT
        }));
      }
    };
    
    // Configuração inicial
    onChange();
    
    // Adiciona event listeners
    mql.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);
    
    // Limpeza
    return () => {
      mql.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [state.forcedMode]);

  // Função para alternar a visualização
  const toggleView = React.useCallback(() => {
    setState(prev => {
      const newState = {
        isMobile: !prev.isMobile,
        forcedMode: prev.forcedMode === null ? !prev.isMobile : !prev.forcedMode
      };
      
      // Salva a preferência no localStorage
      if (isBrowser) {
        localStorage.setItem(MOBILE_VIEW_STORAGE_KEY, JSON.stringify(newState));
      }
      
      // Log the view toggle activity if logging is available
      if (addLog) {
        try {
          addLog({
            action: 'view_toggle',
            entityType: 'system',
            entityId: 'app_view',
            entityName: `View changed to ${newState.isMobile ? 'Mobile' : 'Desktop'}`,
            details: `User toggled view to ${newState.isMobile ? 'Mobile' : 'Desktop'} mode`
          });
        } catch (error) {
          console.error('Error logging view toggle:', error);
        }
      }
      
      return newState;
    });
  }, [addLog]);

  return {
    isMobile: state.isMobile,
    toggleView,
    isForced: state.forcedMode !== null
  };
}

// Exportação alternativa para compatibilidade
export const useMobile = useIsMobile;
