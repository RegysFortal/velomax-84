
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useShipments } from "@/contexts/ShipmentsContext";
import { FiscalAction } from "@/types/shipment";
import { toast } from "sonner";

const fiscalActionSchema = z.object({
  reason: z.string().min(2, "Motivo da retenção é obrigatório"),
  amountToPay: z.coerce.number().min(0, "Valor deve ser igual ou maior que 0"),
  paymentDate: z.string().optional(),
  releaseDate: z.string().optional(),
});

type FiscalActionFormValues = z.infer<typeof fiscalActionSchema>;

interface FiscalActionFormProps {
  open: boolean;
  onClose: () => void;
  shipmentId: string;
  fiscalAction?: FiscalAction;
}

export function FiscalActionForm({
  open,
  onClose,
  shipmentId,
  fiscalAction,
}: FiscalActionFormProps) {
  const { updateFiscalAction } = useShipments();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!fiscalAction;

  // Default values for the form
  const defaultValues: Partial<FiscalActionFormValues> = {
    reason: fiscalAction?.reason || "",
    amountToPay: fiscalAction?.amountToPay || 0,
    paymentDate: fiscalAction?.paymentDate || "",
    releaseDate: fiscalAction?.releaseDate || "",
  };

  const form = useForm<FiscalActionFormValues>({
    resolver: zodResolver(fiscalActionSchema),
    defaultValues,
  });

  const onSubmit = async (data: FiscalActionFormValues) => {
    setIsLoading(true);

    try {
      await updateFiscalAction(shipmentId, data);
      toast.success(
        isEditing
          ? "Informações fiscais atualizadas com sucesso!"
          : "Ação fiscal registrada com sucesso!"
      );
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error saving fiscal action:", error);
      toast.error("Erro ao salvar as informações fiscais");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Ação Fiscal" : "Registrar Ação Fiscal"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da Retenção</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o motivo da retenção fiscal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amountToPay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor a Pagar (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Informe o valor a ser pago para liberação
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Pagamento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Liberação</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
