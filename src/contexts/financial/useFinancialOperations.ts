
import { useState } from 'react';
import { FinancialReport } from '@/types';

export function useFinancialOperations() {
  // State for financial reports
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Create a new financial report
  const addFinancialReport = async (report: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReport: FinancialReport = {
      ...report,
      id: `report_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setFinancialReports(prev => [...prev, newReport]);
    console.log('Added new financial report:', newReport);
    return newReport.id;
  };
  
  const createReport = async (reportData: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log("Creating report with data:", reportData);
    
    const newReport: FinancialReport = {
      ...reportData,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setFinancialReports(prev => [...prev, newReport]);
    console.log('Created new financial report:', newReport);
    return newReport;
  };
  
  const updateFinancialReport = async (id: string, data: Partial<FinancialReport>) => {
    setFinancialReports(prev => 
      prev.map(report => {
        if (report.id === id) {
          const updatedReport = { 
            ...report, 
            ...data,
            updatedAt: new Date().toISOString()
          };
          console.log(`Updated report ${id}:`, updatedReport);
          return updatedReport;
        }
        return report;
      })
    );
  };
  
  const deleteFinancialReport = async (id: string) => {
    console.log(`Deleting report with ID: ${id}`);
    setFinancialReports(prev => prev.filter(report => report.id !== id));
  };

  return {
    financialReports,
    setFinancialReports,
    loading,
    setLoading,
    addFinancialReport,
    createReport,
    updateFinancialReport,
    deleteFinancialReport
  };
}
