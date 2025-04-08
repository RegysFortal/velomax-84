import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientSearchSelect } from "@/components/client/ClientSearchSelect";
import { ShipmentStatus } from "@/types/shipment";
import { Client } from "@/types";

interface ShipmentFormSectionProps {
  companyId: string;
  setCompanyId: (id: string) => void;
  setCompanyName: (name: string) => void;
  transportMode: "air" | "road";
  setTransportMode: (mode: "air" | "road") => void;
  carrierName: string;
  setCarrierName: (name: string) => void;
  trackingNumber: string;
  setTrackingNumber: (number: string) => void;
  packages: string;
  setPackages: (packages: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  arrivalFlight: string;
  setArrivalFlight: (flight: string) => void;
  arrivalDate: string;
  setArrivalDate: (date: string) => void;
  observations: string;
  setObservations: (observations: string) => void;
  status: ShipmentStatus;
  setStatus: (status: ShipmentStatus) => void;
  clients: Client[];
}

export function ShipmentFormSection({
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
  clients
}: ShipmentFormSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="companyName" className="text-sm font-medium">Cliente</label>
        <ClientSearchSelect 
          value={companyId || ""}
          onValueChange={(value) => {
            console.log("ShipmentDialog - Cliente selecionado:", value);
            setCompanyId(value);
            const client = clients.find(c => c.id === value);
            if (client) {
              setCompanyName(client.name);
            }
          }}
          placeholder="Selecione um cliente"
          disableAutoSelect={false}
          showCreateOption={true}
          createOptionLabel="Cadastrar novo cliente"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="transportMode" className="text-sm font-medium">Modal de Transporte</label>
        <Select 
          value={transportMode} 
          onValueChange={(val: "air" | "road") => {
            setTransportMode(val);
            setCarrierName(""); // Reset carrier when mode changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o modal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="air">Aéreo</SelectItem>
            <SelectItem value="road">Rodoviário</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="carrierName" className="text-sm font-medium">Transportadora</label>
        {transportMode === "air" ? (
          <Select 
            value={carrierName} 
            onValueChange={(val) => setCarrierName(val)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a companhia aérea" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GOL">GOL</SelectItem>
              <SelectItem value="LATAM">LATAM</SelectItem>
              <SelectItem value="AZUL">AZUL</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input 
            id="carrierName"
            value={carrierName}
            onChange={(e) => setCarrierName(e.target.value)}
            placeholder="Nome da transportadora"
            required
          />
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="trackingNumber" className="text-sm font-medium">Número do Conhecimento</label>
        <Input 
          id="trackingNumber"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Ex: 123456789"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="packages" className="text-sm font-medium">Volumes</label>
        <Input 
          id="packages"
          type="number"
          min="0"
          value={packages}
          onChange={(e) => setPackages(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="weight" className="text-sm font-medium">Peso (kg)</label>
        <Input 
          id="weight"
          type="number"
          min="0"
          step="0.01"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>
      
      {transportMode === "air" && (
        <div className="space-y-2">
          <label htmlFor="arrivalFlight" className="text-sm font-medium">Voo de Chegada</label>
          <Input 
            id="arrivalFlight"
            value={arrivalFlight}
            onChange={(e) => setArrivalFlight(e.target.value)}
            placeholder="Ex: LA3456"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="arrivalDate" className="text-sm font-medium">Data de Chegada</label>
        <Input 
          id="arrivalDate"
          type="date"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="observations" className="text-sm font-medium">Observações</label>
        <Textarea 
          id="observations"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Observações sobre a carga (perecível, biológico, entrega dedicada, etc.)"
        />
      </div>
      
      <div className="space-y-2 md:col-span-2 pt-4 border-t border-gray-200">
        <label htmlFor="status" className="text-sm font-medium">Status</label>
        <Select value={status} onValueChange={(val: ShipmentStatus) => setStatus(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_transit">Em Trânsito</SelectItem>
            <SelectItem value="retained">Retida</SelectItem>
            <SelectItem value="delivered">Retirada</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
