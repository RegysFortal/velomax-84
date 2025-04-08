
import React from 'react';
import { Input } from "@/components/ui/input";

interface PackageDetailsSectionProps {
  packages: string;
  setPackages: (packages: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
}

export function PackageDetailsSection({
  packages,
  setPackages,
  weight,
  setWeight
}: PackageDetailsSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="packages" className="text-sm font-medium">Volumes</label>
        <Input 
          id="packages"
          type="number"
          min="0"
          value={packages}
          onChange={(e) => setPackages(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="weight" className="text-sm font-medium">Peso (kg)</label>
        <Input 
          id="weight"
          type="number"
          min="0"
          step="0.01"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>
    </>
  );
}
