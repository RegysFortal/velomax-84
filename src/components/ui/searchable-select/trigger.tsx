import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

interface SearchableSelectTriggerProps {
  placeholder: string;
  value: string;
  description?: string;
  onClick: () => void;
  disabled?: boolean;
}

export function SearchableSelectTrigger({ 
  placeholder, 
  value, 
  description, 
  onClick, 
  disabled 
}: SearchableSelectTriggerProps) {
  return (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={true}
      className="w-full justify-between text-left font-normal"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex flex-col items-start gap-1 truncate">
        {value ? (
          <>
            <span className="truncate">{value}</span>
            {description && (
              <span className="text-xs text-muted-foreground truncate">{description}</span>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </div>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );
}

// Keeping backward compatibility
export { SearchableSelectTrigger as SearchTrigger };
