
import { useState, useEffect } from "react";
import { Delivery } from "@/types/delivery";
import { Client } from "@/types/client";
import { FinancialReport } from "@/types";

interface UseDeliveriesFiltersProps {
  deliveries: Delivery[];
  clients: Client[];
  financialReports: FinancialReport[];
}

// Adding extended delivery interface to handle optional properties
interface ExtendedDelivery extends Delivery {
  origin?: string;
  destination?: string;
}

export const useDeliveriesFilters = ({ 
  deliveries, 
  clients, 
  financialReports = [] 
}: UseDeliveriesFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [filteredDeliveries, setFilteredDeliveries] = useState(deliveries);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedClientId("");
    setStartDate(null);
    setEndDate(null);
  };
  
  // Get deliveries that are in closed reports
  const deliveriesInClosedReports = () => {
    const closedReports = financialReports.filter(report => report.status === 'closed');
    
    // Create a Set to track which deliveries are in closed reports
    const deliveryIdsInClosedReports = new Set();
    
    closedReports.forEach(report => {
      // Get all deliveries for this client within the report date range
      const reportStartDate = new Date(report.startDate);
      const reportEndDate = new Date(report.endDate);
      
      deliveries
        .filter(delivery => 
          delivery.clientId === report.clientId && 
          new Date(delivery.deliveryDate) >= reportStartDate && 
          new Date(delivery.deliveryDate) <= reportEndDate
        )
        .forEach(delivery => deliveryIdsInClosedReports.add(delivery.id));
    });
    
    return deliveryIdsInClosedReports;
  };

  useEffect(() => {
    const deliveryIdsInClosedReports = deliveriesInClosedReports();
    
    const filtered = deliveries.filter((delivery) => {
      // Cast delivery to ExtendedDelivery to handle optional properties
      const extendedDelivery = delivery as ExtendedDelivery;
      
      // Filter out deliveries that are in closed reports
      if (deliveryIdsInClosedReports.has(delivery.id)) return false;
      
      // Filter by search term (minutes, client name, etc.)
      if (searchTerm) {
        const client = clients.find((c) => c.id === delivery.clientId);
        const clientName = client?.name || "";
        const searchTermLower = searchTerm.toLowerCase();

        const matchesSearch =
          delivery.minuteNumber.toString().toLowerCase().includes(searchTermLower) ||
          clientName.toLowerCase().includes(searchTermLower) ||
          delivery.receiver.toLowerCase().includes(searchTermLower) ||
          delivery.notes?.toLowerCase().includes(searchTermLower) ||
          extendedDelivery.origin?.toLowerCase().includes(searchTermLower) ||
          extendedDelivery.destination?.toLowerCase().includes(searchTermLower);

        if (!matchesSearch) return false;
      }

      // Filter by selected client
      if (selectedClientId && delivery.clientId !== selectedClientId) {
        return false;
      }

      // Filter by date range
      if (startDate && endDate) {
        const deliveryDate = new Date(delivery.deliveryDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Set hours to ensure correct comparison
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        
        return deliveryDate >= start && deliveryDate <= end;
      }

      return true;
    });

    setFilteredDeliveries(filtered);
  }, [searchTerm, selectedClientId, startDate, endDate, deliveries, clients, financialReports]);

  return {
    searchTerm,
    setSearchTerm,
    selectedClientId,
    setSelectedClientId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredDeliveries,
    clearFilters,
  };
};
