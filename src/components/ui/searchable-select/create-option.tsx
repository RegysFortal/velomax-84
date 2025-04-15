
import React from 'react';
import { CommandItem } from '@/components/ui/command';
import { Plus } from 'lucide-react';

interface CreateOptionProps {
  label: string;
  onSelect: () => void;
}

export function CreateOption({ label, onSelect }: CreateOptionProps) {
  return (
    <CommandItem
      value="__create_new__"
      onSelect={onSelect}
      className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground border-t mt-1 pt-2"
    >
      <Plus className="h-4 w-4" />
      <span>{label}</span>
    </CommandItem>
  );
}
