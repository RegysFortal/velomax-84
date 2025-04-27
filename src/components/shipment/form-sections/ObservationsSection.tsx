
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";

interface ObservationsSectionProps {
  observations: string;
  setObservations: (obs: string) => void;
  disabled?: boolean;
}

export function ObservationsSection({
  observations,
  setObservations,
  disabled
}: ObservationsSectionProps) {
  return (
    <FormField id="observations" label="Observações">
      <Textarea
        id="observations"
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
        placeholder="Observações sobre o embarque"
        rows={4}
        disabled={disabled}
      />
    </FormField>
  );
}
