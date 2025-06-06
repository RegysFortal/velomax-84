import React, { useEffect, useState } from "react";
import { ClientSelection } from "@/components/shipment/ClientSelection";
import { TransportSection } from "@/components/shipment/TransportSection";
import { PackageDetailsSection } from "@/components/shipment/PackageDetailsSection";
import { ShipmentDateSection } from "@/components/shipment/ShipmentDateSection";
import { CarrierSection } from "@/components/shipment/CarrierSection";
import { StatusSection } from "@/components/shipment/StatusSection";
import { RetentionFormSection } from "./form-sections/RetentionFormSection";
import { FormActions } from "./form-sections/FormActions";
import { AddDocumentsModal } from "./AddDocumentsModal";
import { useCompanySelection } from "./hooks/useCompanySelection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";
import { Client } from "@/types";
import { ShipmentStatus, TransportMode } from "@/types";
import { FormField } from "@/components/ui/form-field";

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
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [documentsAdded, setDocumentsAdded] = useState(0);

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

  const handleDocumentsSave = (documents: any[]) => {
    setDocumentsAdded(documents.length);
    console.log("Documents saved:", documents);
  };

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
      
      {/* Transport Mode */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Transporte</label>
        <TransportSection 
          transportMode={transportMode} 
          setTransportMode={setTransportMode} 
          carrierName="" 
          setCarrierName={() => {}} 
          trackingNumber="" 
          setTrackingNumber={() => {}} 
        />
      </div>
      
      {/* Carrier Section */}
      <CarrierSection 
        transportMode={transportMode} 
        carrierName={carrierName} 
        setCarrierName={setCarrierName} 
      />
      
      {/* Tracking Number */}
      <FormField id="trackingNumber" label="Número do Conhecimento">
        <Input
          id="trackingNumber"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Digite o número do conhecimento"
        />
      </FormField>
      
      {/* Package Info */}
      <PackageDetailsSection 
        packages={packages} 
        setPackages={setPackages} 
        weight={weight} 
        setWeight={setWeight} 
      />
      
      {/* Add Documents Button */}
      <div className="space-y-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsDocumentsModalOpen(true)} 
          className="w-full"
        >
          <FileText className="w-4 h-4 mr-2" />
          Adicionar Documentos
          {documentsAdded > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
              {documentsAdded}
            </span>
          )}
        </Button>
      </div>
      
      {/* Status */}
      <StatusSection 
        status={status} 
        setStatus={setStatus} 
        shipmentId="" 
      />
      
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
      
      {/* Documents Modal */}
      <AddDocumentsModal 
        open={isDocumentsModalOpen} 
        onOpenChange={setIsDocumentsModalOpen} 
        onSave={handleDocumentsSave} 
      />
    </div>
  );
}
