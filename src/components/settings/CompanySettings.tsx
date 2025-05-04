
import React from 'react';
import { Card } from '@/components/ui/card';
import { CompanyHeader } from './company/CompanyHeader';
import { CompanyForm } from './company/CompanyForm';
import { CompanyActions } from './company/CompanyActions';
import { CompanyLoadingState } from './company/CompanyLoadingState';
import { useCompanySettings } from './company/hooks/useCompanySettings';

export function CompanySettings() {
  const {
    companyData,
    isEditable,
    isLoading,
    isSaving,
    handleInputChange,
    handleSave
  } = useCompanySettings();

  if (isLoading) {
    return <CompanyLoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CompanyHeader isEditable={isEditable} />
        <CompanyForm 
          companyData={companyData}
          handleInputChange={handleInputChange}
          disabled={!isEditable}
        />
        <CompanyActions 
          onSave={handleSave} 
          disabled={!isEditable}
          loading={isSaving}
        />
      </Card>
    </div>
  );
}
