
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

  // Filter options based on search query
  const filteredOptions = options.filter(option => {
    const label = option.label.toLowerCase();
    const description = option.description?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return label.includes(query) || description.includes(query);
  });

  // Handle option selection
  const handleSelect = (currentValue: string) => {
    console.log("SearchableSelect - Item selected:", currentValue);
    onValueChange(currentValue);
    setOpen(false);
    setSearchQuery(""); // Clear search when an item is selected
  };

  // Handle create new option
  const handleCreateNew = () => {
    if (onCreateNew) {
      console.log("SearchableSelect - Create new option clicked");
      onCreateNew();
      setOpen(false);
    }
  };

  // Force correct positioning
  useEffect(() => {
    const handleResize = () => {
      if (open && popoverRef.current) {
        // Force reposition of popover when window size changes
        const event = new Event('resize');
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open]);

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
        className="w-[var(--radix-popover-trigger-width)] p-0 bg-white dark:bg-gray-900 z-[9999]" 
        ref={popoverRef}
        align="start"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={20}
        style={{ 
          maxHeight: "80vh", 
          overflowY: "auto",
          position: "absolute",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        }}
      >
        <Command className="bg-white dark:bg-gray-900 rounded-md">
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
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  className="flex items-center justify-between hover:bg-accent hover:text-accent-foreground cursor-pointer"
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
              {showCreateOption && onCreateNew && filteredOptions.length > 0 && (
                <CommandItem
                  value="__create-new__"
                  onSelect={handleCreateNew}
                  className="flex items-center border-t hover:bg-accent hover:text-accent-foreground cursor-pointer"
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
