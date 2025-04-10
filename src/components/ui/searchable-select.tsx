
import React, { useState, useRef, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  onCreateNew?: () => void;
  showCreateOption?: boolean;
  createOptionLabel?: string;
  disabled?: boolean; // Added the disabled prop
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Selecione uma opção...",
  emptyMessage = "Nenhum resultado encontrado.",
  onCreateNew,
  showCreateOption = false,
  createOptionLabel = "Cadastrar novo",
  disabled = false // Default value added
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Debug logs
  useEffect(() => {
    console.log("SearchableSelect - options count:", options.length);
    console.log("SearchableSelect - current value:", value);
    console.log("SearchableSelect - showCreateOption:", showCreateOption);
  }, [options.length, value, showCreateOption]);

  // Find the selected option label
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Close the popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    console.log("SearchableSelect - Item selected:", optionValue);
    onValueChange(optionValue);
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
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left"
          disabled={disabled} // Add disabled prop to Button
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
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
            disabled={disabled} // Add disabled prop to CommandInput
          />
          <CommandList>
            <CommandEmpty>
              <div className="py-2 px-2 text-sm text-muted-foreground">
                {emptyMessage}
                {showCreateOption && onCreateNew && (
                  <Button 
                    variant="outline" 
                    className="mt-2 w-full flex items-center justify-center" 
                    onClick={handleCreateNew}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {createOptionLabel}
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
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
                  {value === option.value && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
              {showCreateOption && onCreateNew && (
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
