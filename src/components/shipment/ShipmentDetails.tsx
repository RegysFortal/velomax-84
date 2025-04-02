
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shipment, ShipmentStatus, FiscalAction } from "@/types/shipment";
import { useShipments } from "@/contexts/ShipmentsContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShipmentDialog } from "./ShipmentDialog";
import { FiscalActionForm } from "./FiscalActionForm";
import { DocumentsList } from "./DocumentsList";
import { StatusBadge } from "./StatusBadge";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  PackageOpen,
  Clock,
  CheckCircle2,
  Timer,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

interface ShipmentDetailsProps {
  open: boolean;
  onClose: () => void;
  shipment: Shipment;
}

export function ShipmentDetails({ open, onClose, shipment }: ShipmentDetailsProps) {
  const { updateStatus, deleteShipment } = useShipments();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFiscalActionDialogOpen, setIsFiscalActionDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (status: ShipmentStatus) => {
    try {
      await updateStatus(shipment.id, status);
      toast.success(`Status atualizado para ${getStatusLabel(status)}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar o status");
    }
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este embarque?")) {
      setIsDeleting(true);
      try {
        await deleteShipment(shipment.id);
        toast.success("Embarque excluído com sucesso");
        onClose();
      } catch (error) {
        console.error("Error deleting shipment:", error);
        toast.error("Erro ao excluir o embarque");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Helper function to get status label
  const getStatusLabel = (status: ShipmentStatus) => {
    const statusLabels: Record<ShipmentStatus, string> = {
      in_transit: "Em Trânsito",
      retained: "Retida",
      cleared: "Liberada",
      standby: "Standby",
      delivered: "Entregue",
    };
    return statusLabels[status] || status;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div>Detalhes do Embarque</div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Excluir
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="fiscal">Ação Fiscal</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Empresa</p>
                  <p className="text-sm">{shipment.companyName}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Número do Conhecimento</p>
                  <p className="text-sm">{shipment.trackingNumber}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Transportadora</p>
                  <p className="text-sm">
                    {shipment.carrierName}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({shipment.transportMode === "air" ? "Aéreo" : "Rodoviário"})
                    </span>
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <StatusBadge status={shipment.status} />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Volumes / Peso</p>
                  <p className="text-sm">
                    {shipment.packages} volumes / {shipment.weight} kg
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Voo / Data de Chegada</p>
                  <p className="text-sm">
                    {shipment.arrivalFlight
                      ? `${shipment.arrivalFlight} / `
                      : ""}
                    {shipment.arrivalDate
                      ? format(new Date(shipment.arrivalDate), "dd/MM/yyyy", {
                          locale: ptBR,
                        })
                      : "Não definida"}
                  </p>
                </div>

                {shipment.isPriority && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm font-medium">Entrega Prioritária</p>
                    <p className="text-sm">
                      {shipment.deliveryDate
                        ? format(new Date(shipment.deliveryDate), "dd/MM/yyyy", {
                            locale: ptBR,
                          })
                        : ""}
                      {shipment.deliveryTime ? ` às ${shipment.deliveryTime}` : ""}
                    </p>
                  </div>
                )}

                <div className="space-y-1 col-span-2">
                  <p className="text-sm font-medium">Observações</p>
                  <p className="text-sm whitespace-pre-line">
                    {shipment.observations || "Sem observações"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium mb-2">Atualizar Status:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange("in_transit")}
                    className={shipment.status === "in_transit" ? "bg-accent" : ""}
                  >
                    <Truck className="h-4 w-4 mr-1" /> Em Trânsito
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange("retained")}
                    className={shipment.status === "retained" ? "bg-accent" : ""}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" /> Retida
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange("cleared")}
                    className={shipment.status === "cleared" ? "bg-accent" : ""}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Liberada
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange("standby")}
                    className={shipment.status === "standby" ? "bg-accent" : ""}
                  >
                    <Timer className="h-4 w-4 mr-1" /> Standby
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange("delivered")}
                    className={shipment.status === "delivered" ? "bg-accent" : ""}
                  >
                    <PackageOpen className="h-4 w-4 mr-1" /> Entregue
                  </Button>
                </div>

                {shipment.status === "retained" && !shipment.fiscalAction && (
                  <div className="mt-4">
                    <Button 
                      variant="secondary" 
                      onClick={() => setIsFiscalActionDialogOpen(true)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" /> Registrar Ação Fiscal
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsList shipmentId={shipment.id} documents={shipment.documents} />
            </TabsContent>

            <TabsContent value="fiscal">
              {shipment.fiscalAction ? (
                <div className="space-y-4 py-4">
                  <h3 className="font-medium">Detalhes da Retenção Fiscal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Motivo da Retenção</p>
                      <p className="text-sm">{shipment.fiscalAction.reason}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Valor a Pagar</p>
                      <p className="text-sm">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(shipment.fiscalAction.amountToPay)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Data de Pagamento</p>
                      <p className="text-sm">
                        {shipment.fiscalAction.paymentDate
                          ? format(
                              new Date(shipment.fiscalAction.paymentDate),
                              "dd/MM/yyyy",
                              { locale: ptBR }
                            )
                          : "Não definida"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Data de Liberação</p>
                      <p className="text-sm">
                        {shipment.fiscalAction.releaseDate
                          ? format(
                              new Date(shipment.fiscalAction.releaseDate),
                              "dd/MM/yyyy",
                              { locale: ptBR }
                            )
                          : "Não definida"}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    onClick={() => setIsFiscalActionDialogOpen(true)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Editar Ação Fiscal
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Nenhuma ação fiscal registrada para este embarque
                  </p>
                  {shipment.status === "retained" && (
                    <Button 
                      variant="secondary" 
                      className="mt-4"
                      onClick={() => setIsFiscalActionDialogOpen(true)}
                    >
                      Registrar Ação Fiscal
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <ShipmentDialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          shipment={shipment}
        />
      )}

      {/* Fiscal Action Dialog */}
      {isFiscalActionDialogOpen && (
        <FiscalActionForm
          open={isFiscalActionDialogOpen}
          onClose={() => setIsFiscalActionDialogOpen(false)}
          shipmentId={shipment.id}
          fiscalAction={shipment.fiscalAction}
        />
      )}
    </>
  );
}
