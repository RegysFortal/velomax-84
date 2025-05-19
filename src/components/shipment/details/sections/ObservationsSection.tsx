
import React from 'react';
import { Separator } from "@/components/ui/separator";

interface ObservationsSectionProps {
  observations?: string;
}

export function ObservationsSection({ observations }: ObservationsSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Observações</h3>
      <p className="whitespace-pre-wrap">{observations}</p>
      <Separator />
    </div>
  );
}
