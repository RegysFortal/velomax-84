
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ActivityLog } from '@/types';
import { useAuth } from './auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ActivityLogContextProps {
  activityLog: ActivityLog[];
  addActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  addLog: (activity: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'ipAddress'>) => void;
  logs: ActivityLog[];
}

const ActivityLogContext = createContext<ActivityLogContextProps | undefined>(undefined);

// Helper function to convert database record to ActivityLog format
const mapDatabaseRecordToActivityLog = (record: any): ActivityLog => {
  return {
    id: record.id,
    userId: record.user_id,
    userName: record.user_name,
    action: record.action,
    entityType: record.entity_type,
    entityId: record.entity_id || '',
    entityName: record.entity_name || '',
    timestamp: record.timestamp,
    details: record.details || '',
    ipAddress: record.ip_address || '',
  };
};

export const ActivityLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const { user } = useAuth();

  // Fetch logs from Supabase or local storage when component mounts
  React.useEffect(() => {
    const fetchLogs = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('activity_logs')
            .select('*')
            .order('timestamp', { ascending: false });
            
          if (error) {
            console.error('Error fetching activity logs:', error);
          } else if (data) {
            // Map the data from database format to our ActivityLog format
            const mappedLogs = data.map(mapDatabaseRecordToActivityLog);
            setActivityLog(mappedLogs);
          }
        } catch (error) {
          console.error('Error fetching activity logs:', error);
        }
      }
    };
    
    fetchLogs();
  }, [user]);

  const addActivity = useCallback((activityData: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newActivity: ActivityLog = {
      id: crypto.randomUUID(),
      ...activityData,
      timestamp: new Date().toISOString(),
    };
    setActivityLog(prevLog => [newActivity, ...prevLog]);
    
    // Optionally save to Supabase if connected
    try {
      supabase.from('activity_logs').insert({
        user_id: activityData.userId,
        user_name: activityData.userName,
        action: activityData.action,
        entity_type: activityData.entityType,
        entity_id: activityData.entityId,
        entity_name: activityData.entityName,
        details: activityData.details,
        ip_address: activityData.ipAddress
      });
    } catch (error) {
      console.error('Error saving activity log to database:', error);
    }
  }, []);

  // Simplified addLog function that automatically adds user information
  const addLog = useCallback((activityData: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'ipAddress'>) => {
    if (!user) {
      console.warn('Cannot log activity: No user logged in');
      return;
    }
    
    // Get IP address (in a real app, this would be done server-side)
    const ipAddress = '127.0.0.1'; // Placeholder
    
    const newActivity: ActivityLog = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.email || user.id, // Use email as display name or fallback to ID
      ipAddress,
      ...activityData,
      timestamp: new Date().toISOString(),
    };
    
    setActivityLog(prevLog => [newActivity, ...prevLog]);
    
    // Save to Supabase if connected
    try {
      supabase.from('activity_logs').insert({
        user_id: newActivity.userId,
        user_name: newActivity.userName,
        action: newActivity.action,
        entity_type: newActivity.entityType,
        entity_id: newActivity.entityId,
        entity_name: newActivity.entityName,
        details: newActivity.details,
        ip_address: newActivity.ipAddress
      });
    } catch (error) {
      console.error('Error saving activity log to database:', error);
    }
  }, [user]);

  const value: ActivityLogContextProps = {
    activityLog,
    addActivity,
    addLog,
    logs: activityLog, // Add the logs property which points to activityLog
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
