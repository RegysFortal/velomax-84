import React, { useState, useEffect } from 'react';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PayableAccount, ReceivableAccount } from '@/types';
import { FileText } from 'lucide-react';
import { useReportActions } from '../reports/hooks/useReportActions';
import { ReportFilters } from './components/ReportFilters';
import { DateRange } from 'react-day-picker';
import { toLocalDate, toISODateString } from '@/utils/dateUtils';

// Mock data for now
import { mockPayableAccounts, mockReceivableAccounts } from './data/mockFinancialData';

export default function FinancialReportsPage() {
  const [startDate, setStartDate] = useState<string>(format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [payableAccounts, setPayableAccounts] = useState<PayableAccount[]>(mockPayableAccounts);
  const [receivableAccounts, setReceivableAccounts] = useState<ReceivableAccount[]>(mockReceivableAccounts);
  
  const { generatePDF, exportToExcel } = useReportActions([]);
  
  // Update this handler to use toISODateString for consistent date handling
  const handleDateRangeChange = (range: DateRange) => {
    if (range.from) {
      setStartDate(toISODateString(range.from));
    }
    if (range.to) {
      setEndDate(toISODateString(range.to));
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
  
  // Prepare chart data
  const categoryExpenseData = getCategoryExpenseData(filteredPayables);
  const categoryIncomeData = getCategoryIncomeData(filteredReceivables);
  const monthlyComparisonData = getMonthlyComparisonData(payableAccounts, receivableAccounts);
  
  function getCategoryExpenseData(accounts: PayableAccount[]) {
    const categoryMap = new Map<string, number>();
    accounts.forEach(account => {
      const category = account.categoryName || 'Sem categoria';
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + account.amount);
    });
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }
  
  function getCategoryIncomeData(accounts: ReceivableAccount[]) {
    const categoryMap = new Map<string, number>();
    accounts.forEach(account => {
      const category = account.categoryName || 'Sem categoria';
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + account.amount);
    });
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }
  
  function getMonthlyComparisonData(payables: PayableAccount[], receivables: ReceivableAccount[]) {
    const monthlyData: Record<string, { month: string, expenses: number, income: number }> = {};
    
    // Last 6 months
    for (let i = 0; i < 6; i++) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMM/yy', { locale: ptBR });
      
      monthlyData[monthKey] = { month: monthLabel, expenses: 0, income: 0 };
    }
    
    // Calculate expenses per month
    payables.forEach(account => {
      const monthKey = account.dueDate.substring(0, 7); // YYYY-MM
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].expenses += account.amount;
      }
    });
    
    // Calculate income per month
    receivables.forEach(account => {
      const monthKey = account.dueDate.substring(0, 7); // YYYY-MM
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].income += account.amount;
      }
    });
    
    return Object.values(monthlyData).reverse();
  }
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6B6B', '#4CAF50'];
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Financeiros</h1>
          <p className="text-muted-foreground">
            Análise de receitas e despesas
          </p>
        </div>
        <div className="flex gap-4">
          <DateRangeFilter
            dateRange={{
              from: toLocalDate(new Date(startDate)),
              to: toLocalDate(new Date(endDate))
            }}
            onDateRangeChange={handleDateRangeChange}
          />
          <div className="flex space-x-2">
            <Button variant="outline" onClick={generatePDF}>
              <FileText className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
            <Button variant="outline" onClick={exportToExcel}>
              <FileText className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">R$ {totalPayable.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Pendente: R$ {pendingPayable.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">R$ {totalReceivable.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Pendente: R$ {pendingReceivable.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {cashFlow}
                </div>
                <p className="text-xs text-muted-foreground">
                  No período selecionado
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Realização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalPayable > 0 ? 
                    `${(((totalPayable - pendingPayable) / totalPayable) * 100).toFixed(1)}%` : 
                    '0%'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Despesas pagas / Total despesas
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Comparativo Mensal</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyComparisonData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="income" name="Receitas" fill="#4CAF50" />
                    <Bar dataKey="expenses" name="Despesas" fill="#FF6B6B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryExpenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryExpenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Receitas por Categoria</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryIncomeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryIncomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-6">
          <ReportFilters />
          {/* Expense reports and tables would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Relatório Detalhado de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground pb-4">
                Filtro aplicado: {format(new Date(startDate), 'dd/MM/yyyy', { locale: ptBR })} até {format(new Date(endDate), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
              
              {/* Table would go here */}
              <div className="border rounded-md">
                <p className="p-4 text-center text-muted-foreground">
                  Dados de despesas detalhados seriam exibidos aqui
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="income" className="space-y-6">
          <ReportFilters />
          {/* Income reports and tables would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Relatório Detalhado de Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground pb-4">
                Filtro aplicado: {format(new Date(startDate), 'dd/MM/yyyy', { locale: ptBR })} até {format(new Date(endDate), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
              
              {/* Table would go here */}
              <div className="border rounded-md">
                <p className="p-4 text-center text-muted-foreground">
                  Dados de receitas detalhados seriam exibidos aqui
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
