
import React from "react";
import { CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { SearchableSelectOption } from "./types";

interface OptionItemProps {
  option: SearchableSelectOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export function OptionItem({ option, isSelected, onSelect }: OptionItemProps) {
  return (
    <CommandItem
      key={option.value}
      value={option.value}
      onSelect={() => onSelect(option.value)}
      className="flex items-center justify-between"
    >
      <div>
        <div>{option.label}</div>
        {option.description && (
          <div className="text-xs text-muted-foreground">
            {option.description}
          </div>
        )}
      </div>
      {isSelected && <Check className="h-4 w-4" />}
    </CommandItem>
  );
}
