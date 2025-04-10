import React, { createContext, useContext, useState, useCallback } from 'react';
import { ActivityLog } from '@/types';

interface ActivityLogContextProps {
  activityLog: ActivityLog[];
  addActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

const ActivityLogContext = createContext<ActivityLogContextProps | undefined>(undefined);

export const ActivityLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  const addActivity = useCallback((activityData: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newActivity: ActivityLog = {
      id: crypto.randomUUID(),
      ...activityData,
      timestamp: new Date().toISOString(),
    };
    setActivityLog(prevLog => [newActivity, ...prevLog]);
  }, []);

  const value: ActivityLogContextProps = {
    activityLog,
    addActivity,
  };

  return (
    <ActivityLogContext.Provider value={value}>
      {children}
    </ActivityLogContext.Provider>
  );
};

export const useActivityLog = (): ActivityLogContextProps => {
  const context = useContext(ActivityLogContext);
  if (!context) {
    throw new Error("useActivityLog must be used within a ActivityLogProvider");
  }
  return context;
};
