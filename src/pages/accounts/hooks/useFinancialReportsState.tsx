
import { useState, useEffect } from 'react';
import { PayableAccount, ReceivableAccount } from '@/types/financial';

export function useFinancialReportsState() {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [payableAccounts, setPayableAccounts] = useState<PayableAccount[]>([]);
  const [receivableAccounts, setReceivableAccounts] = useState<ReceivableAccount[]>([]);

  // Filter accounts by date range
  const filteredPayables = payableAccounts.filter(account => {
    const accountDate = new Date(account.dueDate);
    return accountDate >= startDate && accountDate <= endDate;
  });

  const filteredReceivables = receivableAccounts.filter(account => {
    const accountDate = new Date(account.dueDate);
    return accountDate >= startDate && accountDate <= endDate;
  });

  // Calculate totals
  const totalPayable = filteredPayables.reduce((sum, account) => sum + account.amount, 0);
  const totalReceivable = filteredReceivables.reduce((sum, account) => sum + account.amount, 0);
  const pendingPayable = filteredPayables.filter(acc => acc.status === 'pending').reduce((sum, account) => sum + account.amount, 0);
  const pendingReceivable = filteredReceivables.filter(acc => acc.status === 'pending').reduce((sum, account) => sum + account.amount, 0);
  const balance = totalReceivable - totalPayable;
  const cashFlow = pendingReceivable - pendingPayable;

  return {
    startDate,
    endDate,
    activeTab,
    setActiveTab,
    setStartDate,
    setEndDate,
    filteredPayables,
    filteredReceivables,
    totalPayable,
    totalReceivable,
    pendingPayable,
    pendingReceivable,
    balance,
    cashFlow
  };
}
