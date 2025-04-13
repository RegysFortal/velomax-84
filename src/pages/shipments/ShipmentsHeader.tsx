
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SearchWithMagnifier } from '@/components/ui/search-with-magnifier';

interface ShipmentsHeaderProps {
  onCreateClick: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ShipmentsHeader({ 
  onCreateClick, 
  searchTerm, 
  onSearchChange 
}: ShipmentsHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Embarques</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe os embarques e cargas no sistema
          </p>
        </div>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Embarque
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <SearchWithMagnifier
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Buscar por empresa, conhecimento ou transportadora..."
        />
      </div>
    </>
  );
}
