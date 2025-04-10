
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreateOptionProps {
  onClick: () => void;
  label: string;
}

export function CreateOption({ onClick, label }: CreateOptionProps) {
  return (
    <Button 
      variant="outline" 
      className="mt-2 w-full flex items-center justify-center" 
      onClick={onClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
