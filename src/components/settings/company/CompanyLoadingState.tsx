
import React from 'react';
import { Card } from '@/components/ui/card';
import { CompanyHeader } from './CompanyHeader';

export function CompanyLoadingState() {
  return (
    <div className="space-y-6">
      <Card>
        <CompanyHeader isEditable={false} />
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Card>
    </div>
  );
}
