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
  
  // Find the selected option to display in the trigger
  const selectedOption = options.find(option => option.value === value);

  // Filter options based on search value
  const filteredOptions = options.filter(option => {
    const optionText = `${option.label} ${option.description || ''}`.toLowerCase();
    return optionText.includes(searchValue.toLowerCase());
  });
  
  // Handle outside click to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle selection - Improved to handle both click and keypress
  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue);
    setSearchValue('');
    setOpen(false);
  };
  
  // Handle create new option
  const handleCreateNew = () => {
    if (onCreateNew && searchValue) {
      onCreateNew(searchValue);
      setSearchValue('');
    }
    setOpen(false);
  };
  
  // Handle search input change
  const handleSearchChange = (input: string) => {
    setSearchValue(input);
  };
  
  // Handle trigger click
  const handleTriggerClick = () => {
    if (!disabled) {
      setOpen(!open);
    }
  };
  
  // Handle keyboard events including Enter key for creating new items
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue && showCreateOption && onCreateNew) {
      // Check if we have a direct match in options
      const exactMatch = options.find(option => 
        option.label.toLowerCase() === searchValue.toLowerCase()
      );
      
      // If we have an exact match, select it
      if (exactMatch) {
        handleSelect(exactMatch.value);
      } 
      // Otherwise create a new item if allowed
      else if (showCreateOption) {
        e.preventDefault();
        handleCreateNew();
      }
    }
  };
  
  // Show create option only if there's a search value and no exact match
  const shouldShowCreateOption = showCreateOption && searchValue && 
    !filteredOptions.some(option => option.label.toLowerCase() === searchValue.toLowerCase());
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div onClick={handleTriggerClick}>
          <SearchableSelectTrigger
            placeholder={placeholder}
            value={selectedOption?.label || ''}
            description={selectedOption?.description || ''}
            onClick={handleTriggerClick}
            disabled={disabled}
          />
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="p-0 max-h-[300px] overflow-hidden" ref={popoverRef} align="start">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <div className="flex-1">
              <CommandInput
                placeholder="Search..."
                value={searchValue}
                onValueChange={handleSearchChange}
                onKeyDown={handleInputKeyDown}
                className="h-9 w-full border-0 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
          
          <CommandList className="max-h-[250px] overflow-y-auto p-1">
            {filteredOptions.length === 0 && !shouldShowCreateOption ? (
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
                
                {shouldShowCreateOption && onCreateNew && (
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
