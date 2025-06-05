
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDeliveryFormContext } from "./context/DeliveryFormContext";
import { useDeliveryFormCalculations } from "./hooks/useDeliveryFormCalculations";

interface FreightSectionProps {
  isEditMode: boolean;
}

export const FreightSection: React.FC<FreightSectionProps> = ({ isEditMode }) => {
  const { form, freight, setFreight } = useDeliveryFormContext();
  const [freightInput, setFreightInput] = useState(String(freight));
  const [isManualEdit, setIsManualEdit] = useState(false);
  
  const { calculateFreight, setManualFreight } = useDeliveryFormCalculations({
    form,
    setFreight,
    delivery: null,
    isEditMode,
  });

  // Sincronizar o valor de entrada com o estado externo apenas se não estiver sendo editado manualmente
  useEffect(() => {
    if (!isManualEdit) {
      setFreightInput(String(freight));
      form.setValue('totalFreight', freight);
    }
  }, [freight, isManualEdit, form]);

  const handleFreightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFreightInput(value);
    
    // Marcar como edição manual para prevenir sobrescrita
    if (!isManualEdit) {
      setIsManualEdit(true);
    }
    
    // Atualizar o valor no formulário em tempo real
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setManualFreight(numValue);
      form.setValue('totalFreight', numValue);
      console.log('FreightSection - Updated form totalFreight to:', numValue);
    } else if (value === '' || value === '0') {
      // Allow empty or zero values
      setManualFreight(0);
      form.setValue('totalFreight', 0);
      console.log('FreightSection - Set totalFreight to 0');
    }
  };

  const handleRecalculate = () => {
    setIsManualEdit(false);
    const calculated = calculateFreight();
    console.log(`Frete recalculado: ${calculated}`);
    setFreightInput(String(calculated));
    form.setValue('totalFreight', calculated);
  };

  const handleFreightBlur = () => {
    // Quando o campo perde o foco, garantir que o valor seja válido
    const numValue = parseFloat(freightInput);
    if (isNaN(numValue) || numValue < 0) {
      // Se valor inválido, restaurar o último valor válido
      const currentFormValue = form.getValues('totalFreight') || freight;
      setFreightInput(String(currentFormValue));
    } else {
      // Se valor válido, garantir que está sincronizado
      setManualFreight(numValue);
      form.setValue('totalFreight', numValue);
      console.log('FreightSection - Final totalFreight value on blur:', numValue);
    }
  };

  const handleFreightFocus = () => {
    // Quando o campo recebe foco, marcar como edição manual
    setIsManualEdit(true);
  };

  return (
    <div className="bg-muted p-4 rounded-md">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <Label className="font-semibold">Valor Total do Frete:</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRecalculate}
              className="text-xs"
            >
              Recalcular
            </Button>
            <Input
              type="number"
              value={freightInput}
              onChange={handleFreightChange}
              onBlur={handleFreightBlur}
              onFocus={handleFreightFocus}
              className="w-32 text-right font-bold"
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-right italic">
          {isManualEdit ? (
            <span className="text-amber-600">
              Valor manual aplicado - clique em "Recalcular" para usar a tabela de preços
            </span>
          ) : (
            <span className="text-green-600">
              Valor calculado automaticamente - você pode editá-lo manualmente
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
