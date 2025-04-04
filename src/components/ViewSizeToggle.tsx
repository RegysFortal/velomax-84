
import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ViewSizeToggle() {
  const { isMobile, toggleView, isForced } = useIsMobile();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={isForced ? "default" : "outline"} 
            size="icon" 
            onClick={toggleView}
            aria-label={isMobile ? 'Alternar para visualização de desktop' : 'Alternar para visualização móvel'}
            className={isForced ? "bg-primary text-primary-foreground" : ""}
          >
            {isMobile ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isMobile ? 'Alternar para visualização de desktop' : 'Alternar para visualização móvel'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
