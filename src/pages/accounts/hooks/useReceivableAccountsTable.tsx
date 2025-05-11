
import React, { useState } from 'react';
import { ReceivableAccount } from '@/types/financial';

export function useReceivableAccountsTable(
  onDelete: (id: string) => void,
  onMarkAsReceived: (id: string, fullAmount: boolean, partialAmount?: number) => void
) {
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<ReceivableAccount | null>(null);
  const [receiveMethod, setReceiveMethod] = useState("pix");
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  const handleDelete = () => {
    if (accountToDelete) {
      onDelete(accountToDelete);
      setAccountToDelete(null);
    }
  };
  
  const handleOpenReceiveDialog = (account: ReceivableAccount) => {
    setSelectedAccount(account);
    setPartialAmount(account.amount.toString());
    setReceiveDialogOpen(true);
  };
  
  const handleReceive = (isFullAmount: boolean) => {
    if (selectedAccount) {
      if (isFullAmount) {
        onMarkAsReceived(selectedAccount.id, true);
      } else {
        const amount = parseFloat(partialAmount);
        if (amount && amount > 0) {
          onMarkAsReceived(selectedAccount.id, false, amount);
        }
      }
      
      setReceiveDialogOpen(false);
      setSelectedAccount(null);
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="text-yellow-500 font-medium">Pendente</span>;
      case "received":
        return <span className="text-green-500 font-medium">Recebido</span>;
      case "overdue":
        return <span className="text-red-500 font-medium">Atrasado</span>;
      case "partially_received":
        return <span className="text-blue-500 font-medium">Parcialmente Recebido</span>;
      default:
        return <span className="text-gray-500 font-medium">Desconhecido</span>;
    }
  };
  
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "pix":
        return "PIX";
      case "bank_slip":
      case "boleto":
        return "Boleto";
      case "transfer":
      case "transferencia":
        return "Transferência";
      case "cash":
      case "especie":
        return "Dinheiro";
      case "cartao":
        return "Cartão";
      default:
        return "Outro";
    }
  };

  return {
    accountToDelete,
    setAccountToDelete,
    receiveDialogOpen,
    setReceiveDialogOpen,
    partialAmount,
    setPartialAmount,
    selectedAccount,
    setSelectedAccount,
    receiveMethod,
    setReceiveMethod,
    formatCurrency,
    handleDelete,
    handleOpenReceiveDialog,
    handleReceive,
    getStatusLabel,
    getPaymentMethodLabel
  };
}
