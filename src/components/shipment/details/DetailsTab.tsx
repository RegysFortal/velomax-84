
import React from 'react';
import { Shipment } from "@/types/shipment";
import { StatusActions } from "./StatusActions";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useShipmentDetails } from "./useShipmentDetails";

interface DetailsTabProps {
  shipment: Shipment;
  onClose: () => void;
}

export default function DetailsTab({ shipment, onClose }: DetailsTabProps) {
  const {
    isEditing,
    deleteAlertOpen,
    setDeleteAlertOpen,
    companyId,
    companyName,
    transportMode,
    carrierName,
    trackingNumber,
    packages,
    weight,
    arrivalFlight,
    arrivalDate,
    status,
    observations,
    deliveryDate,
    deliveryTime,
    receiverName,
    retentionReason,
    setRetentionReason,
    retentionAmount,
    setRetentionAmount,
    paymentDate,
    setPaymentDate,
    releaseDate,
    setReleaseDate,
    actionNumber,
    setActionNumber,
    fiscalNotes,
    setFiscalNotes,
    handleEditClick,
    handleCancelEdit,
    handleSave,
    handleDelete,
    handleStatusChange
  } = useShipmentDetails(shipment, onClose);

  // Determine if we're in retained status and should show edit button
  const showRetentionEditOption = status === 'retained';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium">Informações Gerais</h3>
          
          <div className="space-y-2 mt-2">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium">{companyName}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Modo de Transporte</p>
              <p className="font-medium">{transportMode === "air" ? "Aéreo" : "Rodoviário"}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Transportadora</p>
              <p className="font-medium">{carrierName}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Nº de Rastreio</p>
              <p className="font-medium">{trackingNumber}</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium">Detalhes da Carga</h3>
          
          <div className="space-y-2 mt-2">
            <div>
              <p className="text-sm text-muted-foreground">Volumes</p>
              <p className="font-medium">{packages}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Peso (kg)</p>
              <p className="font-medium">{weight}</p>
            </div>
            
            {transportMode === "air" && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Voo</p>
                  <p className="font-medium">{arrivalFlight || "-"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Data de Chegada</p>
                  <p className="font-medium">{arrivalDate || "-"}</p>
                </div>
              </>
            )}
          </div>
        </div>
        
        <StatusActions 
          status={status} 
          shipmentId={shipment.id} 
          onStatusChange={handleStatusChange}
        />
      </div>
      
      <Separator />
      
      {/* Retenção Fiscal (se aplicável) */}
      {status === "retained" && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Informações da Retenção</h3>
            {showRetentionEditOption && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEditClick}
              >
                Editar Informações de Retenção
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nº da Ação</p>
              <p className="font-medium">{actionNumber || "-"}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Motivo</p>
              <p className="font-medium">{retentionReason}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Valor a Pagar</p>
              <p className="font-medium">
                {retentionAmount 
                  ? `R$ ${parseFloat(retentionAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                  : "-"}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Data de Pagamento</p>
              <p className="font-medium">{paymentDate || "-"}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Data de Liberação</p>
              <p className="font-medium">{releaseDate || "-"}</p>
            </div>
            
            {fiscalNotes && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Observações</p>
                <p className="font-medium whitespace-pre-wrap">{fiscalNotes}</p>
              </div>
            )}
          </div>
          
          <Separator />
        </div>
      )}
      
      {/* Informações de Entrega (se aplicável) */}
      {status === "delivered_final" && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Informações da Entrega</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Recebedor</p>
              <p className="font-medium">{receiverName}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium">{deliveryDate}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Hora</p>
              <p className="font-medium">{deliveryTime}</p>
            </div>
          </div>
          
          <Separator />
        </div>
      )}
      
      {/* Observações */}
      {observations && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Observações</h3>
          <p className="whitespace-pre-wrap">{observations}</p>
          <Separator />
        </div>
      )}
      
      {/* Ações do Embarque */}
      <div className="flex justify-end space-x-2">
        <Button variant="destructive" onClick={() => setDeleteAlertOpen(true)}>
          Excluir
        </Button>
      </div>
      
      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Embarque</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este embarque?
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
