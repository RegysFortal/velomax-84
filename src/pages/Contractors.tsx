
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { ContractorTable } from '@/components/contractor/ContractorTable';
import { ContractorDialog } from '@/components/contractor/ContractorDialog';

export default function Contractors() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Terceiros</h1>
          <p className="text-muted-foreground">
            Gerenciamento de terceiros como motoristas e ajudantes
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Terceiro
        </Button>
      </div>

      <ContractorTable />

      <ContractorDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
}
