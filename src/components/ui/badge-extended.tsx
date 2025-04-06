
import React from 'react';
import { Badge as OriginalBadge } from './badge';
import { cn } from '@/lib/utils';
import { BadgeVariant } from '@/types/activity';

interface BadgeExtendedProps extends React.ComponentProps<typeof OriginalBadge> {
  variant?: BadgeVariant;
}

export function BadgeExtended({ 
  variant = "default", 
  className, 
  ...props 
}: BadgeExtendedProps) {
  const extendedClassNames = cn(
    variant === "success" && "bg-green-100 text-green-800 hover:bg-green-200/80 border-green-200",
    className
  );

  return (
    <OriginalBadge 
      variant={variant === "success" ? "default" : variant} 
      className={extendedClassNames} 
      {...props} 
    />
  );
}
