
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
  
  // Memoize the selected option to prevent unnecessary re-renders
  const selectedOption = useMemo(() => {
    return options.find(option => option.value === value);
  }, [options, value]);
  
  // Memoize filtered options to prevent unnecessary filtering
  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;
    
    return options.filter(option => {
      const optionText = `${option.label} ${option.description || ''}`.toLowerCase();
      return optionText.includes(searchValue.toLowerCase());
    });
  }, [options, searchValue]);
  
  // Auto-focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);
  
  // Clear search when popover closes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setSearchValue(''), 150);
      return () => clearTimeout(timer);
    }
  }, [open]);
  
  const handleSelect = useCallback((currentValue: string) => {
    console.log("SearchableSelect - handleSelect called with:", currentValue);
    onValueChange(currentValue);
    setOpen(false);
  }, [onValueChange]);
  
  const handleCreateNew = useCallback(() => {
    if (onCreateNew && searchValue) {
      onCreateNew(searchValue);
    }
    setOpen(false);
  }, [onCreateNew, searchValue]);
  
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!disabled) {
      setOpen(newOpen);
    }
  }, [disabled]);
  
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
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
