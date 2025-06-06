
import React, { useEffect, useState } from "react";
import { ClientSelection } from "@/components/shipment/ClientSelection";
import { TransportSection } from "@/components/shipment/TransportSection";
import { CarrierSection } from "@/components/shipment/CarrierSection";
import { PackageDetailsSection } from "@/components/shipment/PackageDetailsSection";
import { ShipmentDateSection } from "@/components/shipment/ShipmentDateSection";
import { RetentionFormSection } from "./form-sections/RetentionFormSection";
import { FormActions } from "./form-sections/FormActions";
import { useCompanySelection } from "./hooks/useCompanySelection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client } from "@/types";
import { ShipmentStatus, TransportMode } from "@/types";

interface ShipmentFormContentProps {
  companyId: string;
  setCompanyId: (id: string) => void;
  setCompanyName: (name: string) => void;
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;
  carrierName: string;
  setCarrierName: (name: string) => void;
  trackingNumber: string;
  setTrackingNumber: (number: string) => void;
  packages: string;
  setPackages: (packages: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  shipmentDate: string;
  setShipmentDate: (date: string) => void;
  status: ShipmentStatus;
  setStatus: (status: ShipmentStatus) => void;
  retentionReason?: string;
  setRetentionReason: (reason: string) => void;
  retentionAmount?: string;
  setRetentionAmount: (amount: string) => void;
  paymentDate?: string;
  setPaymentDate: (date: string) => void;
  actionNumber?: string;
  setActionNumber: (number: string) => void;
  releaseDate?: string;
  setReleaseDate: (date: string) => void;
  fiscalNotes?: string;
  setFiscalNotes: (notes: string) => void;
  clients: Client[];
  onSubmit: () => void;
  onCancel: () => void;
}

export function ShipmentFormContent({
  companyId,
  setCompanyId,
  setCompanyName,
  transportMode,
  setTransportMode,
  carrierName,
  setCarrierName,
  trackingNumber,
  setTrackingNumber,
  packages,
  setPackages,
  weight,
  setWeight,
  shipmentDate,
  setShipmentDate,
  status,
  setStatus,
  retentionReason,
  setRetentionReason,
  retentionAmount,
  setRetentionAmount,
  paymentDate,
  setPaymentDate,
  actionNumber,
  setActionNumber,
  releaseDate,
  setReleaseDate,
  fiscalNotes,
  setFiscalNotes,
  clients,
  onSubmit,
  onCancel
}: ShipmentFormContentProps) {
  useEffect(() => {
    console.log("ShipmentFormContent - Clients available:", clients.length);
    if (clients.length > 0) {
      console.log("ShipmentFormContent - First client:", clients[0].name);
    }
  }, [clients]);

  const {
    handleCompanyChange
  } = useCompanySelection({
    clients,
    setCompanyId,
    setCompanyName
  });

  return (
    <div className="space-y-6">
      {/* Data do Embarque */}
      <ShipmentDateSection 
        shipmentDate={shipmentDate} 
        setShipmentDate={setShipmentDate} 
      />
      
      {/* Client Selection */}
      <ClientSelection 
        companyId={companyId} 
        onCompanyChange={handleCompanyChange} 
        clients={clients} 
      />
      
      {/* Transport Mode (without label) */}
      <TransportSection 
        transportMode={transportMode} 
        setTransportMode={setTransportMode} 
        carrierName={carrierName} 
        setCarrierName={setCarrierName} 
        trackingNumber={trackingNumber} 
        setTrackingNumber={setTrackingNumber} 
      />
      
      {/* Carrier Selection and Tracking Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CarrierSection
          transportMode={transportMode}
          carrierName={carrierName}
          setCarrierName={setCarrierName}
        />
        
        <div className="space-y-2">
          <Label htmlFor="trackingNumber">Número do Conhecimento</Label>
          <Input
            id="trackingNumber"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Digite o número do conhecimento"
          />
        </div>
      </div>
      
      {/* Package Info - Volumes and Weight on same line */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="packages">Volumes</Label>
          <Input 
            id="packages" 
            value={packages} 
            onChange={(e) => setPackages(e.target.value)}
            type="number"
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input 
            id="weight" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)}
            type="number"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      {/* Retention Details (conditional) */}
      {status === "retained" && (
        <RetentionFormSection 
          retentionReason={retentionReason} 
          setRetentionReason={setRetentionReason} 
          retentionAmount={retentionAmount} 
          setRetentionAmount={setRetentionAmount} 
          paymentDate={paymentDate} 
          setPaymentDate={setPaymentDate} 
          actionNumber={actionNumber} 
          setActionNumber={setActionNumber} 
          releaseDate={releaseDate} 
          setReleaseDate={setReleaseDate} 
          fiscalNotes={fiscalNotes} 
          setFiscalNotes={setFiscalNotes} 
        />
      )}
      
      {/* Form Actions */}
      <FormActions onSubmit={onSubmit} onCancel={onCancel} />
    </div>
  );
}
