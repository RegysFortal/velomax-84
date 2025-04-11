
import React from 'react';
import { FiscalAction } from '@/types/shipment';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReadOnlyFiscalActionDetailsProps {
  fiscalAction: FiscalAction;
}

export function ReadOnlyFiscalActionDetails({ fiscalAction }: ReadOnlyFiscalActionDetailsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  return (
    <div className="border p-4 rounded-md bg-muted/50">
      <h3 className="text-lg font-semibold mb-2">Detalhes da Ação Fiscal</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Número da Ação</p>
          <p className="font-medium">{fiscalAction.actionNumber || 'Não informado'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Valor a Pagar</p>
          <p className="font-medium">{formatCurrency(fiscalAction.amountToPay)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Motivo</p>
          <p className="font-medium">{fiscalAction.reason}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Data de Pagamento</p>
          <p className="font-medium">
            {fiscalAction.paymentDate 
              ? format(new Date(fiscalAction.paymentDate), 'dd/MM/yyyy', { locale: ptBR }) 
              : 'Aguardando'}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Data de Liberação</p>
          <p className="font-medium">
            {fiscalAction.releaseDate 
              ? format(new Date(fiscalAction.releaseDate), 'dd/MM/yyyy', { locale: ptBR }) 
              : 'Aguardando'}
          </p>
        </div>
      </div>
      {fiscalAction.notes && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Observações</p>
          <p className="text-sm">{fiscalAction.notes}</p>
        </div>
      )}
    </div>
  );
}
