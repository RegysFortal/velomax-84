
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";
import { useFinancial } from "@/contexts/FinancialContext";
import { useDeliveries } from "@/contexts/DeliveriesContext";
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

interface StatusSectionProps {
  status: ShipmentStatus;
  setStatus: (status: ShipmentStatus) => void;
  shipmentId: string;
}

export function StatusSection({
  status,
  setStatus,
  shipmentId
}: StatusSectionProps) {
  const { financialReports } = useFinancial();
  const { deliveries } = useDeliveries();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ShipmentStatus | null>(null);
  const [reportInfo, setReportInfo] = useState<{ id: string; title: string } | null>(null);

  const isDeliveryInClosedReport = (deliveryId: string) => {
    const delivery = deliveries.find(d => d.minuteNumber === shipmentId);
    if (!delivery) return false;

    const closedReports = financialReports.filter(
      report => report.status === 'closed'
    );

    for (const report of closedReports) {
      // Verificar se o cliente da entrega é o mesmo do relatório
      if (report.clientId !== delivery.clientId) continue;
      
      // Verificar se a data da entrega está dentro do período do relatório
      const deliveryDate = new Date(delivery.deliveryDate);
      const reportStartDate = new Date(report.startDate);
      const reportEndDate = new Date(report.endDate);
      
      // Ajustar para comparação correta de datas
      deliveryDate.setHours(0, 0, 0, 0);
      reportStartDate.setHours(0, 0, 0, 0);
      reportEndDate.setHours(23, 59, 59, 999);
      
      if (deliveryDate >= reportStartDate && deliveryDate <= reportEndDate) {
        setReportInfo({
          id: report.id,
          title: report.title || `Relatório ${report.id}`
        });
        return true;
      }
    }
    
    return false;
  };

  const handleStatusChange = (newStatus: ShipmentStatus) => {
    // Se estiver voltando para o mesmo status, apenas ignora
    if (newStatus === status) return;

    // Verificar se a entrega já está em um relatório fechado
    if (newStatus === 'delivered_final' && isDeliveryInClosedReport(shipmentId)) {
      // Salvar o status pendente e mostrar diálogo
      setPendingStatus(newStatus);
      setShowConfirmDialog(true);
    } else {
      // Se não estiver em relatório fechado, aplica a mudança normalmente
      setStatus(newStatus);
    }
  };

  const confirmStatusChange = () => {
    if (pendingStatus) {
      setStatus(pendingStatus);
      toast.success("Status atualizado com sucesso");
    }
    setShowConfirmDialog(false);
    setPendingStatus(null);
  };

  const cancelStatusChange = () => {
    setShowConfirmDialog(false);
    setPendingStatus(null);
  };

  return (
    <>
      <div className="space-y-2 md:col-span-2 pt-4 border-t border-gray-200">
        <label htmlFor="status" className="text-sm font-medium">Status</label>
        <Select value={status} onValueChange={(val: ShipmentStatus) => handleStatusChange(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_transit">Em Trânsito</SelectItem>
            <SelectItem value="retained">Retida</SelectItem>
            <SelectItem value="delivered">Retirada</SelectItem>
            <SelectItem value="delivered_final">Entregue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Minuta já está fechada em relatório</AlertDialogTitle>
            <AlertDialogDescription>
              Esta minuta já está incluída em um relatório fechado: 
              <span className="font-semibold block mt-2">
                {reportInfo?.title}
              </span>
              Tem certeza que deseja alterar o status mesmo assim? Isto pode causar inconsistências nos relatórios financeiros.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelStatusChange}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange} className="bg-red-600 hover:bg-red-700">
              Sim, alterar mesmo assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
