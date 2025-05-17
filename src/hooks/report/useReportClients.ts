
import { useState, useEffect } from 'react';
import { useClients } from '@/contexts';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { toLocalDate } from '@/utils/dateUtils';

export function useReportClients() {
  const { clients, loading: clientsLoading } = useClients();
  const { deliveries } = useDeliveries();
  const [availableClients, setAvailableClients] = useState(clients);
  
  // Function to find clients with unreported deliveries
  const getClientsWithUnreportedDeliveries = (financialReports: any[]) => {
    // Find all reportable deliveries that aren't in closed reports
    const closedReports = financialReports.filter(report => report.status === 'closed');
    
    // Create a Set to track which deliveries are already in closed reports
    const deliveriesInClosedReports = new Set();
    
    // Fill the Set with deliveries in closed reports
    closedReports.forEach(report => {
      const reportStartDate = new Date(report.startDate);
      const reportEndDate = new Date(report.endDate);
      
      // Configure hours for correct comparisons
      reportStartDate.setHours(0, 0, 0, 0);
      reportEndDate.setHours(23, 59, 59, 999);
      
      deliveries
        .filter(delivery => 
          delivery.clientId === report.clientId &&
          new Date(delivery.deliveryDate) >= reportStartDate &&
          new Date(delivery.deliveryDate) <= reportEndDate
        )
        .forEach(delivery => deliveriesInClosedReports.add(delivery.id));
    });
    
    // Filter deliveries that aren't in closed reports
    const unreportedDeliveries = deliveries.filter(
      delivery => !deliveriesInClosedReports.has(delivery.id)
    );
    
    // Return client IDs with unreported deliveries
    const clientIds = [...new Set(unreportedDeliveries.map(d => d.clientId))];
    return clientIds;
  };

  // Filter clients based on date range
  const filterClientsByDateRange = (startDate: Date | undefined, endDate: Date | undefined) => {
    if (startDate && endDate) {
      // Use toLocalDate helper to ensure proper date comparison
      const startDateObj = toLocalDate(startDate);
      const endDateObj = toLocalDate(endDate);
      
      console.log('Filtrando clientes por período:', startDateObj, endDateObj);
      
      // Set hours to ensure proper date comparison
      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(23, 59, 59, 999);
      
      // Get unique client IDs with deliveries in the selected period
      const clientsWithDeliveries = deliveries
        .filter(delivery => {
          const deliveryDate = new Date(delivery.deliveryDate);
          return deliveryDate >= startDateObj && deliveryDate <= endDateObj;
        })
        .map(delivery => delivery.clientId);
      
      // Filter clients list to only include those with deliveries
      const uniqueClientIds = [...new Set(clientsWithDeliveries)];
      return clients.filter(client => uniqueClientIds.includes(client.id));
    }
    
    return clients;
  };
  
  return {
    clients,
    clientsLoading,
    availableClients,
    setAvailableClients,
    getClientsWithUnreportedDeliveries,
    filterClientsByDateRange
  };
}
