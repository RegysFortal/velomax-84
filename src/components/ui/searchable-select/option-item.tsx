
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
  // Add explicit click handler to ensure the selection works
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(option.value);
  };

  return (
    <CommandItem
      key={option.value}
      value={option.value}
      onSelect={() => onSelect(option.value)}
      onClick={handleClick}
      className="flex items-center justify-between hover:bg-accent hover:text-accent-foreground cursor-pointer py-2"
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
      {isSelected && <Check className="h-4 w-4" />}
    </CommandItem>
  );
}
