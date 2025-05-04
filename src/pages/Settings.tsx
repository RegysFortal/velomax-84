
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsAlert } from '@/components/settings/SettingsAlert';
import { SettingsTabs } from '@/components/settings/SettingsTabs';
import { useSettingsPermissions } from '@/components/settings/useSettingsPermissions';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('system');
  const { user } = useAuth();
  const { permissions, loading, error, setError, setPermissions } = useSettingsPermissions(user);

  useEffect(() => {
    // If current tab is not accessible, switch to the first accessible tab
    if (!loading && !permissions[activeTab as keyof typeof permissions]) {
      const firstAccessibleTab = Object.keys(permissions).find(tab => permissions[tab as keyof typeof permissions]);
      if (firstAccessibleTab) {
        setActiveTab(firstAccessibleTab);
      }
    }
  }, [permissions, loading, activeTab]);

  const handleTabChange = (value: string) => {
    try {
      if (permissions[value as keyof typeof permissions]) {
        setActiveTab(value);
      } else {
        toast.error("Você não tem permissão para acessar esta seção");
      }
    } catch (error) {
      console.error("Error changing tab:", error);
      toast.error("Ocorreu um erro ao mudar de aba. Por favor, tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <SettingsHeader 
          title="Configurações" 
          description="Carregando configurações..." 
        />
        <div className="w-full h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Always show at least notifications if nothing else is accessible
  if (!Object.values(permissions).some(Boolean)) {
    setPermissions(prev => ({ ...prev, notifications: true }));
  }

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader 
        title="Configurações" 
        description="Gerencie as configurações do sistema." 
      />

      <SettingsAlert error={error} />

      <SettingsTabs 
        activeTab={activeTab} 
        handleTabChange={handleTabChange}
        permissions={permissions}
      />
    </div>
  );
};

export default SettingsPage;
