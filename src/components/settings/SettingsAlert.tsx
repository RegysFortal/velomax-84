
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface SettingsAlertProps {
  error: string | null;
}

export const SettingsAlert: React.FC<SettingsAlertProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <Alert variant="default" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};
