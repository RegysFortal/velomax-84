
import React from 'react';
import { CommandItem } from '@/components/ui/command';
import { Check } from 'lucide-react';
import { SearchableSelectOption } from './types';

interface OptionItemProps {
  option: SearchableSelectOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export function OptionItem({ option, isSelected, onSelect }: OptionItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent default and propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Call onSelect with option value
    console.log("OptionItem - clicked directly:", option.value);
    onSelect(option.value);
  };

  return (
    <CommandItem
      key={option.value}
      value={option.value}
      onSelect={() => {
        console.log("OptionItem - onSelect triggered:", option.value);
        // Use a timeout to ensure React processes this after other events
        setTimeout(() => {
          onSelect(option.value);
        }, 0);
      }}
      onClick={handleClick}
      className="flex items-center justify-between gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
      data-selected={isSelected}
    >
      <div className="flex flex-col">
        <span className="font-medium">
          {option.label}
        </span>
        {option.description && (
          <span className="text-xs text-muted-foreground">
            {option.description}
          </span>
        )}
      </div>
      {isSelected && <Check className="h-4 w-4 flex-shrink-0" />}
    </CommandItem>
  );
}
