
import React from 'react';
import { Input } from "@/components/ui/input";

interface PackageDetailsSectionProps {
  packages: string;
  setPackages: (packages: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  disabled?: boolean; // Added the disabled prop
}

export function PackageDetailsSection({
  packages,
  setPackages,
  weight,
  setWeight,
  disabled
}: PackageDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="packages" className="text-sm font-medium">Volumes</label>
        <Input 
          id="packages" 
          value={packages} 
          onChange={(e) => setPackages(e.target.value)}
          type="number"
          min="0"
          disabled={disabled}
        />
      </div>

      <div>
        <label htmlFor="weight" className="text-sm font-medium">Peso (kg)</label>
        <Input 
          id="weight" 
          value={weight} 
          onChange={(e) => setWeight(e.target.value)}
          type="number"
          min="0"
          step="0.01"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
