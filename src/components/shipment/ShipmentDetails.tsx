
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useShipments } from "@/contexts/shipments";
import { Shipment } from "@/types/shipment";
import { useClients } from "@/contexts";
import { DocumentsList } from "./DocumentsList";
import { DetailsTab } from "./details/DetailsTab";
import { useShipmentDetails } from "./details/useShipmentDetails";
import { toast } from "sonner";

interface ShipmentDetailsProps {
  shipment: Shipment;
  open: boolean;
  onClose: () => void;
}

export function ShipmentDetails({ shipment, open, onClose }: ShipmentDetailsProps) {
  const { clients } = useClients();
  const { getShipmentById } = useShipments();
  const [currentShipment, setCurrentShipment] = useState<Shipment>(shipment);
  const formState = useShipmentDetails(currentShipment, onClose);
  
  // Update the shipment whenever the dialog is opened or the ID changes
  useEffect(() => {
    if (open && shipment?.id) {
      const updatedShipment = getShipmentById(shipment.id);
      if (updatedShipment) {
        console.log('ShipmentDetails - Loaded updated shipment data:', updatedShipment);
        setCurrentShipment(updatedShipment);
      } else {
        toast.error("Não foi possível carregar os detalhes do embarque");
        onClose();
      }
    }
  }, [open, shipment?.id, getShipmentById, onClose]);
  
  // Log for debugging
  useEffect(() => {
    if (open) {
      console.log('ShipmentDetails - Shipment ID:', shipment?.id);
      console.log('ShipmentDetails - Documents:', currentShipment?.documents);
    }
  }, [open, shipment?.id, currentShipment?.documents]);
  
  if (!currentShipment) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>
            Detalhes do Embarque - {currentShipment.companyName}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            {/* <TabsTrigger value="history">Histórico</TabsTrigger> */}
          </TabsList>
          
          <TabsContent value="details">
            <DetailsTab 
              shipment={currentShipment} 
              formState={formState} 
              clients={clients} 
            />
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <DocumentsList 
              shipmentId={currentShipment.id} 
              documents={currentShipment.documents || []} 
            />
          </TabsContent>
          
          {/* <TabsContent value="history">
            <p>Em breve: Histórico de alterações do embarque.</p>
          </TabsContent> */}
        </Tabs>
        
        <div className="flex justify-end pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
