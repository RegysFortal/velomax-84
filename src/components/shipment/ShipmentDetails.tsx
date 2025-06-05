
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
import DetailsTab from "./details/DetailsTab";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

interface ShipmentDetailsProps {
  shipment: Shipment;
  open: boolean;
  onClose: () => void;
}

export function ShipmentDetails({ shipment, open, onClose }: ShipmentDetailsProps) {
  const { clients } = useClients();
  const { getShipmentById, deleteShipment, refreshShipmentsData } = useShipments();
  const [currentShipment, setCurrentShipment] = useState<Shipment>(shipment);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  
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
  
  const handleDelete = async () => {
    if (deleteInProgress) return;
    
    try {
      setDeleteInProgress(true);
      console.log('Deleting shipment with ID:', shipment.id);
      
      await deleteShipment(shipment.id);
      
      toast.success("Embarque excluído com sucesso");
      setDeleteDialogOpen(false);
      onClose();
      
      setTimeout(() => {
        refreshShipmentsData();
      }, 100);
      
    } catch (error) {
      console.error("Error deleting shipment:", error);
      toast.error("Erro ao excluir embarque");
    } finally {
      setDeleteInProgress(false);
    }
  };

  if (!currentShipment) {
    return null;
  }
  
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>
              Detalhes do Embarque - {currentShipment.companyName}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[calc(95vh-150px)]">
            <DetailsTab 
              shipment={currentShipment} 
              onClose={onClose} 
            />
            
            <div className="flex justify-between pt-6">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => setDeleteDialogOpen(true)}
                disabled={deleteInProgress}
              >
                <Trash className="h-4 w-4 mr-2" />
                Excluir Embarque
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este embarque? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteInProgress}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleteInProgress}
            >
              {deleteInProgress ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
