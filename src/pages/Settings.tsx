
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsAlert } from '@/components/settings/SettingsAlert';
import { SettingsTabs } from '@/components/settings/SettingsTabs';
import { useSettingsPermissions } from '@/components/settings/useSettingsPermissions';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

const SettingsPage = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'system');
  const { user } = useAuth();
  const { permissions, loading, error, setError, setPermissions } = useSettingsPermissions(user);

  useEffect(() => {
    // Update the active tab when the URL parameter changes
    if (tabParam) {
      console.log("Setting active tab from URL parameter:", tabParam);
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    console.log("Settings page rendered with activeTab:", activeTab);
    console.log("Current permissions:", permissions);
    
    // If current tab is not accessible and permissions are loaded, switch to the first accessible tab
    if (!loading && !permissions[activeTab as keyof typeof permissions]) {
      console.log("Current tab not accessible, finding first accessible tab...");
      const firstAccessibleTab = Object.keys(permissions).find(
        tab => permissions[tab as keyof typeof permissions]
      );
      
      console.log("First accessible tab found:", firstAccessibleTab);
      if (firstAccessibleTab) {
        setActiveTab(firstAccessibleTab);
      }
    }
  }, [permissions, loading, activeTab]);

  const handleTabChange = (value: string) => {
    try {
      console.log("Tab change requested to:", value);
      if (permissions[value as keyof typeof permissions]) {
        console.log("Permission granted, changing tab to:", value);
        setActiveTab(value);
      } else {
        console.log("Permission denied for tab:", value);
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
  
  // Debug permissions for troubleshooting
  console.log("Final permissions for tabs:", permissions);
  console.log("Active tab being rendered:", activeTab);

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
