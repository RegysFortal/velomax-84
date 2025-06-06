
import { useState, useEffect } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { PayableAccount, ReceivableAccount } from '@/types';
import { mockPayableAccounts, mockReceivableAccounts } from '../data/mockFinancialData';

export function useFinancialReportsState() {
  const [startDate, setStartDate] = useState<string>(format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [payableAccounts, setPayableAccounts] = useState<PayableAccount[]>(mockPayableAccounts);
  const [receivableAccounts, setReceivableAccounts] = useState<ReceivableAccount[]>(mockReceivableAccounts);

  // Filter accounts by date range
  const filteredPayables = payableAccounts.filter(account => {
    const accountDate = account.dueDate;
    return accountDate >= startDate && accountDate <= endDate;
  });
  
  const filteredReceivables = receivableAccounts.filter(account => {
    const accountDate = account.dueDate;
    return accountDate >= startDate && accountDate <= endDate;
  });

  // Calculate totals
  const totalPayable = filteredPayables.reduce((sum, account) => sum + account.amount, 0);
  const totalReceivable = filteredReceivables.reduce((sum, account) => sum + account.amount, 0);
  const pendingPayable = filteredPayables.filter(a => a.status !== 'paid').reduce((sum, account) => sum + account.amount, 0);
  const pendingReceivable = filteredReceivables.filter(a => a.status !== 'received' && a.status !== 'partially_received').reduce((sum, account) => sum + account.amount, 0);
  
  const balance = totalReceivable - totalPayable;
  const cashFlow = pendingReceivable - pendingPayable; // Return as number, not formatted string

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
