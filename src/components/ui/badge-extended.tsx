
import React from 'react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import { BadgeVariant } from '@/types/activity';
import { BadgeProps } from '@radix-ui/react-accessible-icon';

interface BadgeExtendedProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export function BadgeExtended({ 
  variant = "default", 
  className, 
  children,
  ...props 
}: BadgeExtendedProps) {
  const extendedClassNames = cn(
    variant === "success" && "bg-green-100 text-green-800 hover:bg-green-200/80 border-green-200",
    className
  );

  // Create standard variant for Badge component
  let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "default";
  if (variant === "destructive" || variant === "outline" || variant === "secondary") {
    badgeVariant = variant;
  }

  return (
    <Badge 
      variant={badgeVariant} 
      className={extendedClassNames} 
      {...props} 
    >
      {children}
    </Badge>
  );
}
