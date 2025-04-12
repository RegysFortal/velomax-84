
import { useState, useEffect } from 'react';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppLayout } from '@/components/AppLayout';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { FinancialMetricCards } from '@/components/dashboard/financial/FinancialMetricCards';
import { FinancialChartSection } from '@/components/dashboard/financial/FinancialChartSection';
import { FinancialSummaryCards } from '@/components/dashboard/financial/FinancialSummaryCards';
import { RecentReportsTable } from '@/components/dashboard/financial/RecentReportsTable';
import { TopClientsTable } from '@/components/dashboard/financial/TopClientsTable';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts/clients';
import { useFinancial } from '@/contexts/FinancialContext';

const FinancialDashboard = () => {
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const { deliveries } = useDeliveries();
  const { clients } = useClients();
  const { financialReports } = useFinancial();
  
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    totalWeight: 0,
    averageDeliveries: 0,
    totalFreight: 0,
    activeClients: 0,
    averageTicket: 0,
    latePaymentRate: 0,
    topReports: [],
    topClients: [],
    clientDistribution: { 
      labels: [], 
      datasets: [{ 
        label: 'Faturamento por Cliente',
        data: [], 
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }] 
    },
    monthlyComparison: { labels: [], datasets: [] },
    growthTimeline: { labels: [], datasets: [] }
  });
  
  useEffect(() => {
    // Filter deliveries by date range
    const filteredDeliveries = deliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.deliveryDate);
      return deliveryDate >= new Date(startDate) && deliveryDate <= new Date(endDate);
    });
    
    // Calculate basic metrics
    const totalDeliveries = filteredDeliveries.length;
    const totalWeight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.weight, 0);
    const totalFreight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.totalFreight, 0);
    
    // Calculate active clients
    const activeClientIds = [...new Set(filteredDeliveries.map(d => d.clientId))];
    const activeClients = activeClientIds.length;
    
    // Calculate average ticket
    const averageTicket = totalDeliveries > 0 ? totalFreight / totalDeliveries : 0;
    
    // Calculate days in period for average deliveries per day
    const periodStart = new Date(startDate);
    const periodEnd = new Date(endDate);
    const daysInPeriod = Math.max(1, (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
    const averageDeliveries = totalDeliveries / daysInPeriod;
    
    // Calculate late payment rate (reports that are still open after end date)
    const lateReports = financialReports.filter(report => {
      return report.status === 'open' && new Date(report.endDate) < new Date();
    });
    const latePaymentRate = financialReports.length > 0 
      ? (lateReports.length / financialReports.length) * 100 
      : 0;
    
    // Get top 5 reports by value
    const topReports = [...financialReports]
      .sort((a, b) => b.totalFreight - a.totalFreight)
      .slice(0, 5);
    
    // Calculate client distribution
    const clientFreightMap = new Map();
    filteredDeliveries.forEach(delivery => {
      const currentFreight = clientFreightMap.get(delivery.clientId) || 0;
      clientFreightMap.set(delivery.clientId, currentFreight + delivery.totalFreight);
    });
    
    // Create data for client distribution chart
    const clientDistributionLabels = [];
    const clientDistributionData = [];
    const clientDistributionColors = [
      '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
      '#ec4899', '#06b6d4', '#84cc16', '#6366f1', '#14b8a6'
    ];
    
    // Sort clients by freight value and take top 10
    const sortedClients = [...clientFreightMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    sortedClients.forEach(([clientId, freight], index) => {
      const client = clients.find(c => c.id === clientId);
      clientDistributionLabels.push(client?.name || 'Cliente Desconhecido');
      clientDistributionData.push(freight);
    });
    
    // Get top clients by number of deliveries
    const clientDeliveryMap = new Map();
    filteredDeliveries.forEach(delivery => {
      const currentCount = clientDeliveryMap.get(delivery.clientId) || 0;
      clientDeliveryMap.set(delivery.clientId, currentCount + 1);
    });
    
    const topClients = [...clientDeliveryMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([clientId, count]) => {
        const client = clients.find(c => c.id === clientId);
        const freight = clientFreightMap.get(clientId) || 0;
        return {
          id: clientId,
          name: client?.name || 'Cliente Desconhecido',
          deliveries: count,
          freight: freight,
          avgTicket: count > 0 ? freight / count : 0
        };
      });
    
    // Generate monthly data for comparison chart
    const monthlyLabels = [];
    const monthlyDeliveries = [];
    const monthlyFreight = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(subMonths(new Date(), i));
      const monthLabel = format(monthStart, 'MMM/yy', { locale: ptBR });
      
      const monthDeliveries = deliveries.filter(delivery => {
        const deliveryDate = new Date(delivery.deliveryDate);
        return deliveryDate >= monthStart && deliveryDate <= monthEnd;
      });
      
      const monthDeliveryCount = monthDeliveries.length;
      const monthFreightTotal = monthDeliveries.reduce((sum, delivery) => sum + delivery.totalFreight, 0);
      
      monthlyLabels.push(monthLabel);
      monthlyDeliveries.push(monthDeliveryCount);
      monthlyFreight.push(monthFreightTotal);
    }
    
    const monthlyComparison = {
      labels: monthlyLabels,
      datasets: [
        {
          label: 'Entregas',
          data: monthlyDeliveries,
          backgroundColor: '#4f46e5',
          borderColor: '#4338ca',
          borderWidth: 1
        },
        {
          label: 'Faturamento (R$)',
          data: monthlyFreight,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
        }
      ]
    };
    
    // Generate growth timeline
    const weeklyLabels = [];
    const weeklyDeliveries = [];
    const weeklyWeight = [];
    const weeklyFreight = [];
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = subDays(new Date(), i * 7 + 7);
      const weekEnd = subDays(new Date(), i * 7);
      const weekLabel = `${format(weekStart, 'dd/MM', { locale: ptBR })} - ${format(weekEnd, 'dd/MM', { locale: ptBR })}`;
      
      const weekDeliveries = deliveries.filter(delivery => {
        const deliveryDate = new Date(delivery.deliveryDate);
        return deliveryDate >= weekStart && deliveryDate <= weekEnd;
      });
      
      const weekDeliveryCount = weekDeliveries.length;
      const weekWeightTotal = weekDeliveries.reduce((sum, delivery) => sum + delivery.weight, 0);
      const weekFreightTotal = weekDeliveries.reduce((sum, delivery) => sum + delivery.totalFreight, 0);
      
      weeklyLabels.push(weekLabel);
      weeklyDeliveries.push(weekDeliveryCount);
      weeklyWeight.push(weekWeightTotal);
      weeklyFreight.push(weekFreightTotal);
    }
    
    const growthTimeline = {
      labels: weeklyLabels,
      datasets: [
        {
          label: 'Entregas',
          data: weeklyDeliveries,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: 'Peso (kg)',
          data: weeklyWeight,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: 'Valor (R$)',
          data: weeklyFreight,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          tension: 0.4
        }
      ]
    };
    
    // Client distribution chart data
    const clientDistribution = {
      labels: clientDistributionLabels,
      datasets: [
        {
          label: 'Faturamento por Cliente',
          data: clientDistributionData,
          backgroundColor: clientDistributionColors.slice(0, clientDistributionData.length),
          borderColor: clientDistributionColors.slice(0, clientDistributionData.length),
          borderWidth: 1
        }
      ]
    };
    
    setStats({
      totalDeliveries,
      totalWeight,
      averageDeliveries,
      totalFreight,
      activeClients,
      averageTicket,
      latePaymentRate,
      topReports,
      topClients,
      clientDistribution,
      monthlyComparison,
      growthTimeline
    });
    
  }, [deliveries, clients, financialReports, startDate, endDate]);
  
  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
            <p className="text-muted-foreground">
              Acompanhe os indicadores financeiros e o desempenho da operação
            </p>
          </div>
          <DateRangeFilter 
            startDate={startDate} 
            endDate={endDate} 
            onDateRangeChange={handleDateRangeChange} 
          />
        </div>
        
        <FinancialMetricCards 
          totalDeliveries={stats.totalDeliveries}
          totalWeight={stats.totalWeight}
          totalFreight={stats.totalFreight}
          activeClients={stats.activeClients}
          averageTicket={stats.averageTicket}
          latePaymentRate={stats.latePaymentRate}
        />
        
        <FinancialChartSection 
          clientDistribution={stats.clientDistribution}
          monthlyComparison={stats.monthlyComparison}
          growthTimeline={stats.growthTimeline}
        />
        
        <FinancialSummaryCards
          averageDeliveries={stats.averageDeliveries}
          startDate={startDate}
          endDate={endDate}
        />
        
        <div className="grid gap-4 md:grid-cols-2">
          <RecentReportsTable topReports={stats.topReports} />
          <TopClientsTable topClients={stats.topClients} />
        </div>
      </div>
    </AppLayout>
  );
};

export default FinancialDashboard;
