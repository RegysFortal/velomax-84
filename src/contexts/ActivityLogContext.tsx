import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ActivityLog } from '@/types';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ActivityLogContextProps {
  logs: ActivityLog[];
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'userName'>) => Promise<void>;
  clearLogs: () => Promise<void>;
  loading: boolean;
}

const ActivityLogContext = createContext<ActivityLogContextProps | undefined>(undefined);

export const ActivityLogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        
        if (user) {
          const { data, error } = await supabase
            .from('activity_logs')
            .select('*')
            .order('timestamp', { ascending: false });
          
          if (error) {
            throw error;
          }
          
          const mappedLogs = data.map((log: any): ActivityLog => ({
            id: log.id,
            userId: log.user_id,
            userName: log.user_name,
            action: log.action,
            entityType: log.entity_type,
            entityId: log.entity_id || '',
            entityName: log.entity_name || '',
            timestamp: log.timestamp,
            details: log.details || '',
            ipAddress: log.ip_address || '',
          }));
          
          setLogs(mappedLogs);
        }
      } catch (error) {
        console.error('Error fetching activity logs:', error);
        
        const storedLogs = localStorage.getItem('velomax_activity_logs');
        if (storedLogs) {
          try {
            setLogs(JSON.parse(storedLogs));
          } catch (err) {
            console.error('Failed to parse stored logs', err);
            setLogs([]);
          }
        } else {
          setLogs([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [user]);
  
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_activity_logs', JSON.stringify(logs));
    }
  }, [logs, loading]);

  const addLog = async (logData: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'userName'>) => {
    if (!user) return;
    
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .catch(() => ({ ip: '' }));
      
      const ipAddress = ipResponse.ip || '';
      
      const newLog = {
        user_id: user.id,
        user_name: user.name || user.email || 'Unknown User',
        action: logData.action,
        entity_type: logData.entityType,
        entity_id: logData.entityId || '',
        entity_name: logData.entityName || '',
        details: logData.details || '',
        ip_address: ipAddress,
      };
      
      const { data, error } = await supabase
        .from('activity_logs')
        .insert(newLog)
        .select();
      
      if (error) {
        throw error;
      }
      
      const insertedData = data[0];
      
      const mappedLog: ActivityLog = {
        id: insertedData.id,
        userId: insertedData.user_id,
        userName: insertedData.user_name,
        action: insertedData.action,
        entityType: insertedData.entity_type,
        entityId: insertedData.entity_id || '',
        entityName: insertedData.entity_name || '',
        timestamp: insertedData.timestamp,
        details: insertedData.details || '',
        ipAddress: insertedData.ip_address || '',
      };
      
      setLogs(prev => [mappedLog, ...prev]);
    } catch (error) {
      console.error('Error adding activity log:', error);
      
      const timestamp = new Date().toISOString();
      const fallbackLog: ActivityLog = {
        id: `log-${Date.now()}`,
        userId: user.id,
        userName: user.name || user.email || 'Unknown User',
        timestamp,
        ...logData,
        ipAddress: '',
      };
      
      setLogs(prev => [fallbackLog, ...prev]);
    }
  };

  const clearLogs = async () => {
    try {
      if (user) {
        const { error } = await supabase
          .from('activity_logs')
          .delete()
          .eq('user_id', user.id);
        
        if (error) {
          throw error;
        }
      }
      
      setLogs([]);
      localStorage.removeItem('velomax_activity_logs');
    } catch (error) {
      console.error('Error clearing activity logs:', error);
    }
  };

  return (
    <ActivityLogContext.Provider value={{ logs, addLog, clearLogs, loading }}>
      {children}
    </ActivityLogContext.Provider>
  );
};

export const useActivityLog = () => {
  const context = useContext(ActivityLogContext);
  if (!context) {
    throw new Error('useActivityLog must be used within an ActivityLogProvider');
  }
  return context;
};
