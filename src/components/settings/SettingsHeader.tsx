
import React from 'react';

interface SettingsHeaderProps {
  title: string;
  description: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
