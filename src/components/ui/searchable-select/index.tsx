
import React, { useState, useRef, useEffect } from 'react';
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { SearchableSelectTrigger } from './trigger';
import { OptionItem } from './option-item';
import { CreateOption } from './create-option';
import { SearchableSelectProps } from './types';

export function SearchableSelect({
  options = [],
  value,
  onValueChange,
  placeholder = 'Select an option',
  emptyMessage = 'No results found',
  showCreateOption = false,
  createOptionLabel = 'Create new item',
  onCreateNew,
  disabled = false,
  allowCustomValue = false
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Find the selected option to display in the trigger
  const selectedOption = options.find(option => option.value === value);

  // Filter options based on search value
  const filteredOptions = options.filter(option => {
    const optionText = `${option.label} ${option.description || ''}`.toLowerCase();
    return optionText.includes(searchValue.toLowerCase());
  });
  
  // Auto-focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);
  
  // Clear search when popover closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => setSearchValue(''), 150);
    }
  }, [open]);
  
  // Debug options and selection
  useEffect(() => {
    console.log("SearchableSelect - Options:", options.length);
    console.log("SearchableSelect - Current value:", value);
    if (value) {
      console.log("SearchableSelect - Selected option:", selectedOption?.label);
    }
  }, [options, value, selectedOption]);
  
  // Handle selection
  const handleSelect = (currentValue: string) => {
    console.log("SearchableSelect - handleSelect called with:", currentValue);
    
    try {
      console.log("SearchableSelect - About to call onValueChange with:", currentValue);
      
      // Call onValueChange with the selected value
      onValueChange(currentValue);
      
      // Close the popover after selection
      setSearchValue('');
      setOpen(false);
    } catch (error) {
      console.error("Error in handleSelect:", error);
    }
  };
  
  // Handle create new option
  const handleCreateNew = () => {
    if (onCreateNew && searchValue) {
      onCreateNew(searchValue);
      setSearchValue('');
    }
    setOpen(false);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
          <SearchableSelectTrigger
            placeholder={placeholder}
            value={selectedOption?.label || ''}
            description={selectedOption?.description || ''}
            disabled={disabled}
            onClick={() => !disabled && setOpen(!open)}
          />
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        className="p-0 max-h-[300px] overflow-hidden w-[var(--radix-popover-trigger-width)] min-w-[250px]" 
        ref={popoverRef} 
        align="start"
        sideOffset={8}
      >
        <Command className="rounded-lg border shadow-md w-full">
          <div className="flex items-center border-b px-3">
            <div className="flex-1">
              <CommandInput
                ref={inputRef}
                placeholder="Buscar..."
                value={searchValue}
                onValueChange={setSearchValue}
                className="h-9 w-full border-0 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
          
          <CommandList className="max-h-[250px] overflow-y-auto p-1">
            {filteredOptions.length === 0 && !showCreateOption ? (
              <CommandEmpty className="py-6 text-center text-sm">{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <OptionItem
                    key={option.value}
                    option={option}
                    isSelected={value === option.value}
                    onSelect={handleSelect}
                  />
                ))}
                
                {showCreateOption && onCreateNew && searchValue && (
                  <CreateOption 
                    label={`${createOptionLabel}: "${searchValue}"`} 
                    onSelect={handleCreateNew} 
                  />
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
