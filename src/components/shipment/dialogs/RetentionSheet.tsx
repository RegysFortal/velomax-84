
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RetentionFormSection } from "../RetentionFormSection";
import { toast } from "sonner";

interface RetentionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionNumber: string;
  setActionNumber: (action: string) => void;
  retentionReason: string;
  setRetentionReason: (reason: string) => void;
  retentionAmount: string;
  setRetentionAmount: (amount: string) => void;
  paymentDate: string;
  setPaymentDate: (date: string) => void;
  releaseDate: string;
  setReleaseDate: (date: string) => void;
  fiscalNotes: string;
  setFiscalNotes: (notes: string) => void;
  onConfirm: () => void;
}

export function RetentionSheet({
  open,
  onOpenChange,
  actionNumber,
  setActionNumber,
  retentionReason,
  setRetentionReason,
  retentionAmount,
  setRetentionAmount,
  paymentDate,
  setPaymentDate,
  releaseDate,
  setReleaseDate,
  fiscalNotes,
  setFiscalNotes,
  onConfirm
}: RetentionSheetProps) {
  const handleConfirm = () => {
    if (!retentionReason.trim()) {
      toast.error("Por favor, informe o motivo da retenção");
      return;
    }

    onConfirm();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Informações de Retenção</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <RetentionFormSection
            actionNumber={actionNumber}
            setActionNumber={setActionNumber}
            retentionReason={retentionReason}
            setRetentionReason={setRetentionReason}
            retentionAmount={retentionAmount}
            setRetentionAmount={setRetentionAmount}
            paymentDate={paymentDate}
            setPaymentDate={setPaymentDate}
            releaseDate={releaseDate}
            setReleaseDate={setReleaseDate}
            fiscalNotes={fiscalNotes}
            setFiscalNotes={setFiscalNotes}
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>
              Confirmar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
