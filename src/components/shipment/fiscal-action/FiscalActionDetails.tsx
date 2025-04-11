
import React, { useState } from 'react';
import { FiscalAction } from '@/types/shipment';
import { ReadOnlyFiscalActionDetails } from './ReadOnlyFiscalActionDetails';
import { ViewFiscalActionDetails } from './ViewFiscalActionDetails';
import { EditFiscalActionDetails } from './EditFiscalActionDetails';

interface FiscalActionDetailsProps {
  fiscalAction: FiscalAction;
  onUpdate: (updates: Partial<FiscalAction>) => void;
  readOnly?: boolean;
}

export function FiscalActionDetails({ 
  fiscalAction, 
  onUpdate,
  readOnly = false
}: FiscalActionDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (readOnly) {
    return <ReadOnlyFiscalActionDetails fiscalAction={fiscalAction} />;
  }

  if (isEditing) {
    return (
      <EditFiscalActionDetails 
        fiscalAction={fiscalAction} 
        onSave={(updates) => {
          onUpdate(updates);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <ViewFiscalActionDetails 
      fiscalAction={fiscalAction}
      onEdit={() => setIsEditing(true)}
    />
  );
}
