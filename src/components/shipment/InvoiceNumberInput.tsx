
import React, { useState, KeyboardEvent, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface InvoiceNumberInputProps {
  invoiceNumbers: string[];
  setInvoiceNumbers: (values: string[]) => void;
}

export function InvoiceNumberInput({ invoiceNumbers, setInvoiceNumbers }: InvoiceNumberInputProps) {
  const [currentInput, setCurrentInput] = useState('');
  
  useEffect(() => {
    console.log("InvoiceNumberInput - Current invoice numbers:", invoiceNumbers);
  }, [invoiceNumbers]);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      e.preventDefault();
      
      // Clone the array to ensure we're not directly mutating state
      const updatedInvoices = Array.isArray(invoiceNumbers) ? [...invoiceNumbers] : [];
      
      // Add invoice number if it doesn't already exist
      if (!updatedInvoices.includes(currentInput.trim())) {
        updatedInvoices.push(currentInput.trim());
        console.log("Updated invoice numbers:", updatedInvoices);
        setInvoiceNumbers(updatedInvoices);
      }
      
      setCurrentInput('');
    }
  };
  
  const removeInvoiceNumber = (index: number) => {
    // Make sure invoiceNumbers is an array before operating on it
    if (!Array.isArray(invoiceNumbers)) {
      console.warn("invoiceNumbers is not an array:", invoiceNumbers);
      return;
    }
    
    const newInvoiceNumbers = [...invoiceNumbers];
    newInvoiceNumbers.splice(index, 1);
    console.log("After removal invoice numbers:", newInvoiceNumbers);
    setInvoiceNumbers(newInvoiceNumbers);
  };
  
  return (
    <div className="space-y-2">
      <Input
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite e pressione Enter para adicionar"
      />
      
      <div className="flex flex-wrap gap-2 mt-2">
        {Array.isArray(invoiceNumbers) && invoiceNumbers.length > 0 ? (
          invoiceNumbers.map((number, index) => (
            <Badge key={index} variant="secondary" className="px-2 py-1">
              {number}
              <button
                type="button"
                onClick={() => removeInvoiceNumber(index)}
                className="ml-1 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">Nenhuma nota fiscal adicionada</span>
        )}
      </div>
    </div>
  );
}
