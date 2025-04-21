
import { useState, useMemo } from 'react';
import { Delivery } from '@/types/delivery';
import { Client } from '@/types';
import { isWithinInterval, parseISO } from 'date-fns';
import { FinancialReport } from '@/types/financial';

interface UseDeliveriesFiltersProps {
  deliveries: Delivery[];
  clients: Client[];
  financialReports: FinancialReport[];
}

export function useDeliveriesFilters({
  deliveries,
  clients,
  financialReports
}: UseDeliveriesFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const isDeliveryInClosedReport = (delivery: Delivery) => {
    const closedReports = financialReports.filter(report => report.status === 'closed');
    return closedReports.some(report => {
      if (report.clientId !== delivery.clientId) return false;
      const deliveryDate = new Date(delivery.deliveryDate);
      const reportStartDate = new Date(report.startDate);
      const reportEndDate = new Date(report.endDate);
      deliveryDate.setHours(0,0,0,0);
      reportStartDate.setHours(0,0,0,0);
      reportEndDate.setHours(23,59,59,999);
      return deliveryDate >= reportStartDate && deliveryDate <= reportEndDate;
    });
  };

  const filteredDeliveries = useMemo(() => {
    return deliveries
      .filter(delivery => {
        if (isDeliveryInClosedReport(delivery)) return false;
        if (selectedClientId && delivery.clientId !== selectedClientId) return false;
        if (startDate && endDate) {
          const deliveryDate = parseISO(delivery.deliveryDate);
          const filterStartDate = new Date(startDate);
          const filterEndDate = new Date(endDate);
          filterEndDate.setHours(23,59,59,999);
          if (!isWithinInterval(deliveryDate, { start: filterStartDate, end: filterEndDate })) {
            return false;
          }
        }
        const client = clients.find(c => c.id === delivery.clientId);
        const searchFields = [
          delivery.minuteNumber,
          client?.tradingName || '',
          client?.name || '',
          delivery.receiver,
          delivery.deliveryDate,
          delivery.occurrence || '',
        ].join(' ').toLowerCase();
        return searchFields.includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());
  }, [deliveries, selectedClientId, startDate, endDate, searchTerm, clients, financialReports]);

  const clearFilters = () => {
    setSelectedClientId('');
    setStartDate(null);
    setEndDate(null);
  };

  return {
    searchTerm, setSearchTerm,
    selectedClientId, setSelectedClientId,
    startDate, setStartDate,
    endDate, setEndDate,
    filteredDeliveries, clearFilters
  };
}
