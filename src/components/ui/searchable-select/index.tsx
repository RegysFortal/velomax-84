
import React, { useState, useRef, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { SearchTrigger } from "./trigger";
import { CreateOption } from "./create-option";
import { SearchableSelectProps } from "./types";

export type { SearchableSelectOption, SearchableSelectProps } from "./types";

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Selecione uma opção...",
  emptyMessage = "Nenhum resultado encontrado.",
  onCreateNew,
  showCreateOption = false,
  createOptionLabel = "Cadastrar novo",
  disabled = false
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Debug logs
  useEffect(() => {
    console.log("SearchableSelect - options count:", options.length);
    console.log("SearchableSelect - current value:", value);
    
    if (options.length > 0) {
      console.log("SearchableSelect - First few options:", options.slice(0, 3));
    }
  }, [options, value]);

  // Find the selected option label
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Handle option selection
  const handleSelect = (currentValue: string) => {
    console.log("SearchableSelect - Item selected:", currentValue);
    
    // Find the exact option object that matches the value or label
    const selectedOption = options.find(option => option.value === currentValue);
    
    if (selectedOption) {
      console.log("SearchableSelect - Selected option found:", selectedOption);
      onValueChange(selectedOption.value);
    } else {
      console.log("SearchableSelect - No matching option found for:", currentValue);
    }
    
    setOpen(false);
  };

  // Handle create new option
  const handleCreateNew = () => {
    if (onCreateNew) {
      console.log("SearchableSelect - Create new option clicked");
      onCreateNew();
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SearchTrigger 
          displayValue={displayValue}
          open={open}
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
        />
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 bg-white z-50" 
        ref={popoverRef}
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput 
            placeholder={`Procurar ${placeholder.toLowerCase()}`} 
            className="h-9" 
            value={searchQuery}
            onValueChange={setSearchQuery}
            disabled={disabled}
            autoFocus
          />
          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty>
              <div className="py-2 px-2 text-sm text-muted-foreground">
                {emptyMessage}
                {showCreateOption && onCreateNew && (
                  <CreateOption
                    onClick={handleCreateNew}
                    label={createOptionLabel}
                  />
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
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
                  {value === option.value && <span className="ml-2">✓</span>}
                </CommandItem>
              ))}
              {showCreateOption && onCreateNew && options.length > 0 && (
                <CommandItem
                  value="__create-new__"
                  onSelect={handleCreateNew}
                  className="flex items-center border-t"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {createOptionLabel}
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
