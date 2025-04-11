
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

interface SearchTriggerProps {
  displayValue: string;
  open: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function SearchTrigger({ displayValue, open, onClick, disabled }: SearchTriggerProps) {
  return (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="w-full justify-between text-left font-normal"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="truncate">{displayValue}</span>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );
}
