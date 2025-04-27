
import { Shipment, TransportMode, ShipmentStatus } from '@/types/shipment';

export function mapShipmentFromSupabase(data: any): Shipment {
  return {
    id: data.id,
    companyId: data.company_id,
    companyName: data.company_name,
    transportMode: data.transport_mode as TransportMode,
    carrierName: data.carrier_name,
    trackingNumber: data.tracking_number,
    packages: data.packages,
    weight: data.weight,
    arrivalFlight: data.arrival_flight,
    arrivalDate: data.arrival_date,
    observations: data.observations,
    status: data.status as ShipmentStatus,
    isRetained: data.is_retained,
    deliveryDate: data.delivery_date,
    deliveryTime: data.delivery_time,
    receiverName: data.receiver_name,
    receiverId: data.receiver_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    documents: []
  };
}

export function mapDocumentFromSupabase(data: any) {
  return {
    id: data.id,
    name: data.name,
    type: data.type as "cte" | "invoice" | "delivery_location" | "other",
    url: data.url,
    notes: data.notes,
    minuteNumber: data.minute_number,
    invoiceNumbers: data.invoice_numbers || [],
    weight: data.weight,
    packages: data.packages,
    isDelivered: data.is_delivered,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}
