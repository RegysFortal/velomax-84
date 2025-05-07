
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ReceivableAccountsHeaderProps {
  onNewAccount: () => void;
}

export const ReceivableAccountsHeader: React.FC<ReceivableAccountsHeaderProps> = ({ onNewAccount }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contas a Receber</h1>
        <p className="text-muted-foreground">
          Gerencie todas as suas contas a receber em um só lugar.
        </p>
      </div>
      <Button onClick={onNewAccount}>
        <Plus className="mr-2 h-4 w-4" />
        Nova Conta
      </Button>
    </div>
  );
};
