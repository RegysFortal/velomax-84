
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bell, Siren, Timer, PackageX } from 'lucide-react';

interface PriorityAndAttentionCardsProps {
  priorityDocuments: number;
  attentionNeededShipments: number;
  retainedShipments: number;
  delayedShipments: number;
}

export function PriorityAndAttentionCards({
  priorityDocuments,
  attentionNeededShipments,
  retainedShipments,
  delayedShipments
}: PriorityAndAttentionCardsProps) {
  return (
    <>
      {/* Priority documents card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Documentos Prioritários
          </CardTitle>
          <Siren className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{priorityDocuments}</div>
          <p className="text-xs text-muted-foreground">
            {priorityDocuments > 0 
              ? 'Documentos com prioridade alta'
              : 'Nenhum documento prioritário'}
          </p>
        </CardContent>
      </Card>
      
      {/* Attention Needed card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Embarques que Precisam Atenção
          </CardTitle>
          <Bell className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attentionNeededShipments}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-sm">
              <PackageX className="h-4 w-4 text-orange-500 inline mr-1" />
              {retainedShipments} retidos
            </span>
            <span className="text-sm">
              <Timer className="h-4 w-4 text-red-500 inline mr-1" />
              {delayedShipments} atrasados
            </span>
            <span className="text-sm">
              <Siren className="h-4 w-4 text-red-500 inline mr-1" />
              {priorityDocuments} prioritários
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
