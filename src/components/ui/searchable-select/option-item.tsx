
import React from "react";
import { CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";

interface OptionItemProps {
  label: string;
  description?: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function OptionItem({ label, description, isSelected, onSelect }: OptionItemProps) {
  return (
    <CommandItem
      value={label}
      onSelect={onSelect}
      className="flex items-center justify-between"
    >
      <div>
        <div>{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      {isSelected && <Check className="h-4 w-4" />}
    </CommandItem>
  );
}
