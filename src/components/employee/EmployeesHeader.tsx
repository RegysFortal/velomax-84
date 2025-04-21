
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface EmployeesHeaderProps {
  onCreateClick: () => void;
}

export function EmployeesHeader({ onCreateClick }: EmployeesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Colaboradores</h1>
        <p className="text-muted-foreground">
          Gerencie os funcionários da empresa.
        </p>
      </div>
      <Button onClick={onCreateClick} className="flex gap-2 items-center">
        <UserPlus className="h-4 w-4" />
        <span>Novo Colaborador</span>
      </Button>
    </div>
  );
}
