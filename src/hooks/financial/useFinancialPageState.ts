
import { useState } from 'react';
import { FinancialReport } from '@/types';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export function useFinancialPageState() {
  const [activeTab, setActiveTab] = useState("open");
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [reportToClose, setReportToClose] = useState<FinancialReport | null>(null);
  const [reportToEdit, setReportToEdit] = useState<FinancialReport | null>(null);
  
  // Date state for filtering archived reports
  const [startDate, setStartDate] = useState<string>(format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  
  const onStartDateChange = (date: string) => {
    setStartDate(date);
  };
  
  const onEndDateChange = (date: string) => {
    setEndDate(date);
  };
  
  return {
    activeTab,
    setActiveTab,
    reportToDelete,
    setReportToDelete,
    reportToClose,
    setReportToClose,
    reportToEdit,
    setReportToEdit,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange
  };
}
