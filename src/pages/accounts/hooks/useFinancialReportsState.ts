
import { useState } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { PayableAccount, ReceivableAccount } from '@/types';
import { mockPayableAccounts, mockReceivableAccounts } from '../data/mockFinancialData';

export function useFinancialReportsState() {
  const [startDate, setStartDate] = useState<string>(format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [payableAccounts, setPayableAccounts] = useState<PayableAccount[]>(mockPayableAccounts);
  const [receivableAccounts, setReceivableAccounts] = useState<ReceivableAccount[]>(mockReceivableAccounts);

  // Update this handler to manually format dates to avoid timezone issues
  const handleDateRangeChange = (range: DateRange) => {
    if (range.from) {
      const from = range.from;
      const year = from.getFullYear();
      const month = String(from.getMonth() + 1).padStart(2, '0');
      const day = String(from.getDate()).padStart(2, '0');
      setStartDate(`${year}-${month}-${day}`);
    }
    if (range.to) {
      const to = range.to;
      const year = to.getFullYear();
      const month = String(to.getMonth() + 1).padStart(2, '0');
      const day = String(to.getDate()).padStart(2, '0');
      setEndDate(`${year}-${month}-${day}`);
    }
  };

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
  const cashFlow = balance >= 0 ? `R$ ${balance.toFixed(2)}` : `-R$ ${Math.abs(balance).toFixed(2)}`;

  return {
    startDate,
    endDate,
    activeTab,
    setActiveTab,
    handleDateRangeChange,
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
