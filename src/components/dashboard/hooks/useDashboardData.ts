
import { useState, useMemo } from 'react';
import { useShipments } from '@/contexts/shipments';
import { useDeliveriesStorage } from '@/hooks/useDeliveriesStorage';
import { DateRange } from 'react-day-picker';
import { formatToLocaleDate } from '@/utils/dateUtils';

export function useDashboardData(dateRange: DateRange) {
  const { shipments, loading: shipmentsLoading } = useShipments();
  const { deliveries, loading: deliveriesLoading } = useDeliveriesStorage();

  // Convert date range to string format for API calls
  const startDate = formatToLocaleDate(dateRange.from || new Date());
  const endDate = formatToLocaleDate(dateRange.to || new Date());
  
  // Filter data based on date range
  const filteredShipments = useMemo(() => shipments.filter(shipment => {
    const createdDate = new Date(shipment.createdAt);
    return createdDate >= (dateRange.from || new Date()) && 
           createdDate <= (dateRange.to || new Date());
  }), [shipments, dateRange]);
  
  // Filter deliveries based on date range
  const filteredDeliveries = useMemo(() => deliveries.filter(delivery => {
    const deliveryDate = new Date(delivery.deliveryDate);
    return deliveryDate >= (dateRange.from || new Date()) && 
           deliveryDate <= (dateRange.to || new Date());
  }), [deliveries, dateRange]);

  // Count priority documents
  const priorityDocuments = useMemo(() => shipments.reduce((count, shipment) => {
    return count + shipment.documents.filter(doc => doc.isPriority).length;
  }, 0), [shipments]);
  
  // Calculate metrics
  const totalShipments = filteredShipments.length;
  const inTransitShipments = filteredShipments.filter(s => s.status === 'in_transit').length;
  const retainedShipments = filteredShipments.filter(s => s.status === 'retained').length;
  const totalDeliveries = filteredDeliveries.length;
  const activeDeliveries = filteredDeliveries.filter(d => {
    const deliveryDate = new Date(d.deliveryDate);
    return deliveryDate >= new Date();
  }).length;
  
  // Identify delayed shipments
  const delayedShipments = useMemo(() => filteredShipments.filter(s => {
    // Check only in_transit or retained shipments
    if (s.status !== 'in_transit' && s.status !== 'retained') {
      return false;
    }
    
    // If no arrival date, not considered delayed
    if (!s.arrivalDate) {
      return false;
    }
    
    const arrivalDate = new Date(s.arrivalDate);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - arrivalDate.getTime()) / (1000 * 3600 * 24));
    
    // Delayed if 3 or more days past arrival date
    return daysDiff >= 3;
  }).length, [filteredShipments]);
  
  // Attention needed shipments (delayed + retained)
  const attentionNeededShipments = delayedShipments + retainedShipments + priorityDocuments;

  const isLoading = shipmentsLoading || deliveriesLoading;

  return {
    filteredShipments,
    filteredDeliveries,
    totalShipments,
    inTransitShipments,
    retainedShipments,
    delayedShipments,
    priorityDocuments,
    attentionNeededShipments,
    totalDeliveries,
    activeDeliveries,
    isLoading
  };
}
