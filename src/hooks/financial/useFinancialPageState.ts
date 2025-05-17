
import { useState } from 'react';
import { FinancialReport } from '@/types';

export function useFinancialPageState() {
  const [activeTab, setActiveTab] = useState("open");
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [reportToClose, setReportToClose] = useState<FinancialReport | null>(null);
  const [reportToEdit, setReportToEdit] = useState<FinancialReport | null>(null);
  
  return {
    activeTab,
    setActiveTab,
    reportToDelete,
    setReportToDelete,
    reportToClose,
    setReportToClose,
    reportToEdit,
    setReportToEdit
  };
}
