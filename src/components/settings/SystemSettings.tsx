
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useSystemSettings } from './hooks/useSystemSettings';
import { BackupRetentionSection } from './sections/BackupRetentionSection';
import { RegionalSettingsSection } from './sections/RegionalSettingsSection';
import { ApiIntegrationSection } from './sections/ApiIntegrationSection';

export function SystemSettings() {
  const { user } = useAuth();
  const {
    isLoading,
    isEditable,
    isSaving,
    backupFrequency,
    setBackupFrequency,
    dataRetention,
    setDataRetention,
    timezone,
    setTimezone,
    enableAuditLog,
    setEnableAuditLog,
    apiKey,
    showApiKey,
    setShowApiKey,
    handleSave,
    generateNewApiKey,
  } = useSystemSettings(user);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Carregando configurações...</AlertDescription>
        </Alert>
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackupRetentionSection 
        backupFrequency={backupFrequency}
        setBackupFrequency={setBackupFrequency}
        dataRetention={dataRetention}
        setDataRetention={setDataRetention}
        isEditable={isEditable}
      />

      <RegionalSettingsSection 
        timezone={timezone}
        setTimezone={setTimezone}
        enableAuditLog={enableAuditLog}
        setEnableAuditLog={setEnableAuditLog}
        isEditable={isEditable}
      />

      <ApiIntegrationSection 
        apiKey={apiKey}
        showApiKey={showApiKey}
        setShowApiKey={setShowApiKey}
        generateNewApiKey={generateNewApiKey}
        isEditable={isEditable}
      />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!isEditable || isSaving}>
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}
