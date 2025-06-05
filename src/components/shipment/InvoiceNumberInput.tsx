
import React, { useState, KeyboardEvent, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface InvoiceNumberInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function InvoiceNumberInput({ value, onChange, placeholder = "Digite e pressione Enter para adicionar" }: InvoiceNumberInputProps) {
  const [currentInput, setCurrentInput] = useState('');
  
  useEffect(() => {
    console.log("InvoiceNumberInput - Current invoice numbers:", value);
  }, [value]);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      e.preventDefault();
      
      // Clone the array to ensure we're not directly mutating state
      const updatedInvoices = Array.isArray(value) ? [...value] : [];
      
      // Add invoice number if it doesn't already exist
      if (!updatedInvoices.includes(currentInput.trim())) {
        updatedInvoices.push(currentInput.trim());
        console.log("Updated invoice numbers:", updatedInvoices);
        onChange(updatedInvoices);
      }
      
      setCurrentInput('');
    }
  };
  
  const removeInvoiceNumber = (index: number) => {
    // Make sure value is an array before operating on it
    if (!Array.isArray(value)) {
      console.warn("value is not an array:", value);
      return;
    }
    
    const newInvoiceNumbers = [...value];
    newInvoiceNumbers.splice(index, 1);
    console.log("After removal invoice numbers:", newInvoiceNumbers);
    onChange(newInvoiceNumbers);
  };
  
  return (
    <div className="space-y-2">
      <Input
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      
      <div className="flex flex-wrap gap-2 mt-2">
        {Array.isArray(value) && value.length > 0 ? (
          value.map((number, index) => (
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
