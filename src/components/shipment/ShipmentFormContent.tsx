import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientSelection } from "@/components/shipment/ClientSelection";
import { TransportSection } from "@/components/shipment/TransportSection";
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
  arrivalFlight?: string;
  setArrivalFlight: (flight: string) => void;
  arrivalDate?: string;
  setArrivalDate: (date: string) => void;
  observations?: string;
  setObservations: (obs: string) => void;
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
  arrivalFlight,
  setArrivalFlight,
  arrivalDate,
  setArrivalDate,
  observations,
  setObservations,
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
  onCancel,
}: ShipmentFormContentProps) {
  useEffect(() => {
    console.log("ShipmentFormContent - Clients available:", clients.length);
    if (clients.length > 0) {
      console.log("ShipmentFormContent - First client:", clients[0].name);
    }
  }, [clients]);

  const handleCompanyChange = (newCompanyId: string) => {
    console.log("ShipmentFormContent - Company changed to:", newCompanyId);
    setCompanyId(newCompanyId);
    
    const selectedClient = clients.find(client => client.id === newCompanyId);
    if (selectedClient) {
      console.log("ShipmentFormContent - Selected client:", selectedClient.name);
      setCompanyName(selectedClient.tradingName || selectedClient.name);
    } else {
      console.warn("ShipmentFormContent - Client not found with ID:", newCompanyId);
    }
  };

  const handleRetentionStatusChange = (value: string) => {
    setStatus(value as ShipmentStatus);
  };

  return (
    <div className="space-y-8">
      {/* Client Selection */}
      <div className="space-y-2">
        <Label>Cliente</Label>
        <ClientSelection
          companyId={companyId}
          onCompanyChange={handleCompanyChange}
          clients={clients}
        />
      </div>
      
      {/* Transport Information */}
      <div className="space-y-4">
        <TransportSection 
          transportMode={transportMode}
          setTransportMode={setTransportMode}
          carrierName={carrierName}
          setCarrierName={setCarrierName}
          trackingNumber={trackingNumber}
          setTrackingNumber={setTrackingNumber}
        />
      </div>
      
      {/* Package Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="packages">Volumes</Label>
          <Input
            id="packages"
            type="number"
            value={packages}
            onChange={(e) => setPackages(e.target.value)}
            placeholder="Quantidade"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Peso em kg"
            step="0.01"
          />
        </div>
      </div>
      
      {/* Arrival Information */}
      <div className="grid grid-cols-2 gap-4">
        {transportMode === "air" && (
          <div className="space-y-2">
            <Label htmlFor="arrivalFlight">Voo</Label>
            <Input
              id="arrivalFlight"
              value={arrivalFlight || ""}
              onChange={(e) => setArrivalFlight(e.target.value)}
              placeholder="Número do voo"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="arrivalDate">Data de Chegada</Label>
          <Input
            id="arrivalDate"
            type="date"
            value={arrivalDate || ""}
            onChange={(e) => setArrivalDate(e.target.value)}
          />
        </div>
      </div>
      
      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={handleRetentionStatusChange}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_transit">Em Trânsito</SelectItem>
            <SelectItem value="retained">Retida</SelectItem>
            <SelectItem value="delivered">Retirada</SelectItem>
            <SelectItem value="delivered_final">Entregue</SelectItem>
            <SelectItem value="partially_delivered">Entregue Parcial</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Retention Details (conditional) */}
      {status === "retained" && (
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
          <h3 className="font-medium">Detalhes da Retenção</h3>
          
          <div className="space-y-2">
            <Label htmlFor="retentionReason">Motivo da Retenção</Label>
            <Input
              id="retentionReason"
              value={retentionReason || ""}
              onChange={(e) => setRetentionReason(e.target.value)}
              placeholder="Motivo da retenção"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retentionAmount">Valor a Pagar</Label>
              <Input
                id="retentionAmount"
                type="number"
                value={retentionAmount || ""}
                onChange={(e) => setRetentionAmount(e.target.value)}
                placeholder="Valor em R$"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionNumber">Número da Ação</Label>
              <Input
                id="actionNumber"
                value={actionNumber || ""}
                onChange={(e) => setActionNumber(e.target.value)}
                placeholder="Número da ação fiscal"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Data de Pagamento</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate || ""}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="releaseDate">Data de Liberação</Label>
              <Input
                id="releaseDate"
                type="date"
                value={releaseDate || ""}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fiscalNotes">Observações Fiscais</Label>
            <Textarea
              id="fiscalNotes"
              value={fiscalNotes || ""}
              onChange={(e) => setFiscalNotes(e.target.value)}
              placeholder="Observações sobre a retenção"
              rows={3}
            />
          </div>
        </div>
      )}
      
      {/* Observations */}
      <div className="space-y-2">
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          value={observations || ""}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Observações sobre o embarque"
          rows={4}
        />
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={onSubmit}>Salvar</Button>
      </div>
    </div>
  );
}
