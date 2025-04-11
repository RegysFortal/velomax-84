
import React, { useState, useRef, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { SearchTrigger } from "./trigger";
import { CreateOption } from "./create-option";
import { OptionItem } from "./option-item";
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
  }, [options.length, value]);

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
        <SearchTrigger 
          displayValue={displayValue}
          open={open}
          onClick={() => setOpen(!open)}
          disabled={disabled}
        />
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
            disabled={disabled}
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
                <OptionItem
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  isSelected={value === option.value}
                  onSelect={() => handleSelect(option.value)}
                />
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
