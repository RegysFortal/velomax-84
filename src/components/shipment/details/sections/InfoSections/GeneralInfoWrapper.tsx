
import React from 'react';
import { GeneralInfoSection } from "../GeneralInfoSection";

interface GeneralInfoWrapperProps {
  companyName: string;
  transportMode: "air" | "road";
  carrierName: string;
  trackingNumber: string;
}

export function GeneralInfoWrapper({
  companyName,
  transportMode,
  carrierName,
  trackingNumber
}: GeneralInfoWrapperProps) {
  return (
    <GeneralInfoSection
      companyName={companyName}
      transportMode={transportMode}
      carrierName={carrierName}
      trackingNumber={trackingNumber}
    />
  );
}
