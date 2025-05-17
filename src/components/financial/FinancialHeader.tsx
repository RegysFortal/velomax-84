
import React from 'react';

interface FinancialHeaderProps {
  title: string;
  description: string;
}

export const FinancialHeader: React.FC<FinancialHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
