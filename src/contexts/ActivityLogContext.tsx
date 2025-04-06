
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ActivityLog, ActivityAction, EntityType } from "@/types/activity";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface ActivityLogContextType {
  logs: ActivityLog[];
  addLog: (params: {
    action: ActivityAction;
    entityType: EntityType;
    entityId?: string;
    entityName?: string;
    details?: string;
  }) => void;
  getLogsByUser: (userId: string) => ActivityLog[];
  getLogsByAction: (action: ActivityAction) => ActivityLog[];
  getLogsByEntityType: (entityType: EntityType) => ActivityLog[];
  getLogsByDateRange: (startDate: string, endDate: string) => ActivityLog[];
  clearAllLogs: () => void;
}

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadLogs = () => {
      try {
        const storedLogs = localStorage.getItem("velomax_activity_logs");
        if (storedLogs) {
          setLogs(JSON.parse(storedLogs));
        }
      } catch (error) {
        console.error("Error loading activity logs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadLogs();
  }, []);
  
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("velomax_activity_logs", JSON.stringify(logs));
    }
  }, [logs, loading]);
  
  const addLog = ({
    action,
    entityType,
    entityId,
    entityName,
    details
  }: {
    action: ActivityAction;
    entityType: EntityType;
    entityId?: string;
    entityName?: string;
    details?: string;
  }) => {
    if (!user) {
      console.warn("Cannot log activity without a logged in user");
      return;
    }
    
    const newLog: ActivityLog = {
      id: uuidv4(),
      userId: user.id,
      userName: user.name,
      action,
      entityType,
      entityId,
      entityName,
      timestamp: new Date().toISOString(),
      details,
      ipAddress: "local" // In a real app, you would get the IP from the server
    };
    
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };
  
  const getLogsByUser = (userId: string) => {
    return logs.filter(log => log.userId === userId);
  };
  
  const getLogsByAction = (action: ActivityAction) => {
    return logs.filter(log => log.action === action);
  };
  
  const getLogsByEntityType = (entityType: EntityType) => {
    return logs.filter(log => log.entityType === entityType);
  };
  
  const getLogsByDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= start && logDate <= end;
    });
  };
  
  const clearAllLogs = () => {
    if (window.confirm("Tem certeza que deseja limpar todos os logs de atividades? Esta ação não pode ser desfeita.")) {
      setLogs([]);
      toast.success("Todos os logs de atividades foram limpos");
    }
  };
  
  return (
    <ActivityLogContext.Provider
      value={{
        logs,
        addLog,
        getLogsByUser,
        getLogsByAction,
        getLogsByEntityType,
        getLogsByDateRange,
        clearAllLogs
      }}
    >
      {children}
    </ActivityLogContext.Provider>
  );
}

export const useActivityLog = () => {
  const context = useContext(ActivityLogContext);
  
  if (context === undefined) {
    throw new Error("useActivityLog must be used within a ActivityLogProvider");
  }
  
  return context;
};
