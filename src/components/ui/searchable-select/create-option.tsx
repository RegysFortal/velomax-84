
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface CreateOptionProps {
  label: string;
  onSelect: () => void;
}

export function CreateOption({ label, onSelect }: CreateOptionProps) {
  return (
    <Button 
      variant="outline" 
      className="mt-2 w-full flex items-center justify-center" 
      onClick={onSelect}
    >
      <Plus className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
