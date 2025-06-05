
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BackupSelectionState } from './types';

interface BackupSelectionOptionsProps {
  selectionState: BackupSelectionState;
  onSelectionChange: (key: keyof BackupSelectionState, checked: boolean) => void;
}

export function BackupSelectionOptions({ selectionState, onSelectionChange }: BackupSelectionOptionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Selecionar Menus para Backup/Restauração</h3>
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="operational-data" 
            checked={selectionState.includeOperational}
            onCheckedChange={(checked) => onSelectionChange('includeOperational', !!checked)}
          />
          <Label htmlFor="operational-data" className="text-sm">
            Operacional (entregas, embarques)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="financial-data" 
            checked={selectionState.includeFinancial}
            onCheckedChange={(checked) => onSelectionChange('includeFinancial', !!checked)}
          />
          <Label htmlFor="financial-data" className="text-sm">
            Financeiro (relatórios, contas a receber, contas a pagar)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="fleet-data" 
            checked={selectionState.includeFleet}
            onCheckedChange={(checked) => onSelectionChange('includeFleet', !!checked)}
          />
          <Label htmlFor="fleet-data" className="text-sm">
            Frota (veículos, livro de bordo, combustível, manutenção)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="inventory-data" 
            checked={selectionState.includeInventory}
            onCheckedChange={(checked) => onSelectionChange('includeInventory', !!checked)}
          />
          <Label htmlFor="inventory-data" className="text-sm">
            Estoque (produtos, entradas, saídas)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="settings-data" 
            checked={selectionState.includeSettings}
            onCheckedChange={(checked) => onSelectionChange('includeSettings', !!checked)}
          />
          <Label htmlFor="settings-data" className="text-sm">
            Configurações (clientes, funcionários, cidades, tabelas de preço, configurações)
          </Label>
        </div>
      </div>
    </div>
  );
}
