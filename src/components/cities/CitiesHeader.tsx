
import { CityAddDialog } from './CityAddDialog';

interface CitiesHeaderProps {
  onAddCity: (data: { name: string; state: string; distance: number }) => void;
}

export function CitiesHeader({ onAddCity }: CitiesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cidades</h1>
        <p className="text-muted-foreground">
          Gerencie as cidades disponíveis para entregas.
        </p>
      </div>
      <CityAddDialog onAddCity={onAddCity} />
    </div>
  );
}
