
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ContractorDialog } from './ContractorDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEmployeesData } from '@/hooks/useEmployeesData';
import { User } from '@/types';

export function ContractorTable() {
  const [editContractor, setEditContractor] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { employees, deleteEmployee } = useEmployeesData();
  
  // Filter only the contractors
  const contractors = employees.filter(employee => employee.type === 'contractor');

  const handleEdit = (contractor: User) => {
    setEditContractor(contractor);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este terceiro?')) {
      try {
        await deleteEmployee(id);
      } catch (error) {
        console.error('Erro ao excluir terceiro:', error);
      }
    }
  };

  const formatPhone = (phone: string | undefined) => {
    if (!phone) return '-';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatDocument = (doc: string | undefined) => {
    if (!doc) return '-';
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contractors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Nenhum terceiro cadastrado
              </TableCell>
            </TableRow>
          ) : (
            contractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell className="font-medium">{contractor.name}</TableCell>
                <TableCell>{contractor.role === 'driver' ? 'Motorista' : 'Ajudante'}</TableCell>
                <TableCell>{formatDocument(contractor.document)}</TableCell>
                <TableCell>{formatPhone(contractor.phone)}</TableCell>
                <TableCell>
                  {contractor.birthDate
                    ? format(new Date(contractor.birthDate), 'dd/MM/yyyy', { locale: ptBR })
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(contractor)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(contractor.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <ContractorDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        contractor={editContractor}
      />
    </div>
  );
}
