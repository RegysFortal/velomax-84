
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReportActions } from '../reports/hooks/useReportActions';
import { useFinancialReportsState } from './hooks/useFinancialReportsState';
import { useFinancialReportsUtils } from './hooks/useFinancialReportsUtils';
import { FinancialReportHeader } from './components/FinancialReportHeader';
import { DashboardTab } from './components/DashboardTab';
import { DetailedReportTabs } from './components/DetailedReportTabs';
import { IncomeReportTab } from './components/IncomeReportTab';
import { FinancialProvider } from '@/contexts/financial';

const FinancialReportsContent = () => {
  const {
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
  } = useFinancialReportsState();
  
  const { 
    formatCurrency,
    getCategoryExpenseData,
    getCategoryIncomeData,
    getMonthlyComparisonData
  } = useFinancialReportsUtils();
  
  const { generatePDF, exportToExcel } = useReportActions([]);
  
  // Convert string dates to Date objects for components that need them
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  
  // Helper functions to handle date conversions
  const handleStartDateChange = (date: Date) => {
    setStartDate(date.toISOString().split('T')[0]);
  };
  
  const handleEndDateChange = (date: Date) => {
    setEndDate(date.toISOString().split('T')[0]);
  };
  
  // Prepare chart data
  const categoryExpenseData = getCategoryExpenseData(filteredPayables);
  const categoryIncomeData = getCategoryIncomeData(filteredReceivables);
  const monthlyComparisonData = getMonthlyComparisonData(filteredPayables, filteredReceivables);
  
  return (
    <div className="flex flex-col gap-6">
      <FinancialReportHeader 
        startDate={startDateObj}
        endDate={endDateObj}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        generatePDF={generatePDF}
        exportToExcel={exportToExcel}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
        </TabsList>
        
        <DashboardTab 
          totalPayable={totalPayable}
          pendingPayable={pendingPayable}
          totalReceivable={totalReceivable}
          pendingReceivable={pendingReceivable}
          balance={balance}
          cashFlow={cashFlow}
          formatCurrency={formatCurrency}
          monthlyComparisonData={monthlyComparisonData}
          categoryExpenseData={categoryExpenseData}
          categoryIncomeData={categoryIncomeData}
        />
        
        <DetailedReportTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          startDate={startDateObj}
          endDate={endDateObj}
        />
        
        <IncomeReportTab 
          startDate={startDateObj}
          endDate={endDateObj}
        />
      </Tabs>
    </div>
  );
};

export default function FinancialReportsPage() {
  return (
    <FinancialProvider>
      <FinancialReportsContent />
    </FinancialProvider>
  );
}
