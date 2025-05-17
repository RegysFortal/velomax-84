
import { Delivery, FinancialReport } from '@/types';

export function useDeliveriesFiltering(deliveries: Delivery[]) {
  // Helper function to get deliveries for a specific report
  const deliveriesForReport = (report: FinancialReport) => {
    return deliveries.filter(delivery => {
      if (delivery.clientId !== report.clientId) return false;
      
      const deliveryDate = new Date(delivery.deliveryDate);
      const startDate = new Date(report.startDate);
      const endDate = new Date(report.endDate);
      
      // Set hours to ensure correct comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      return deliveryDate >= startDate && deliveryDate <= endDate;
    });
  };

  return {
    deliveriesForReport
  };
}
