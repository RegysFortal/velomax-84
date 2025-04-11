
import React from 'react';
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

interface ShipmentDetailsProps {
  shipment: Shipment;
  open: boolean;
  onClose: () => void;
}

export function ShipmentDetails({ shipment, open, onClose }: ShipmentDetailsProps) {
  const { clients } = useClients();
  const formState = useShipmentDetails(shipment, onClose);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>
            Detalhes do Embarque - {shipment.companyName}
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
              shipment={shipment} 
              formState={formState} 
              clients={clients} 
            />
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <DocumentsList shipmentId={shipment.id} documents={shipment.documents} />
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
