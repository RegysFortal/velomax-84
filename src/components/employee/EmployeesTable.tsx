
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getDepartmentLabel, getPositionBadge } from "./utils/employeeBadges";

interface EmployeesTableProps {
  employees: User[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEditClick: (employee: User) => void;
  onDeleteClick: (id: string) => void;
}

export function EmployeesTable({
  employees,
  loading,
  searchTerm,
  onSearchChange,
  onEditClick,
  onDeleteClick,
}: EmployeesTableProps) {
  const filteredEmployees = employees.filter(emp => {
    const searchText = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(searchText) ||
      (emp.email && emp.email.toLowerCase().includes(searchText)) ||
      (emp.position && emp.position.toLowerCase().includes(searchText)) ||
      (emp.department && emp.department.toLowerCase().includes(searchText))
    );
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Lista de Colaboradores</CardTitle>
          <CardDescription>
            Total de {employees.length} colaboradores registrados
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar colaboradores..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <ScrollArea className="h-[500px] w-full pr-4">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">
              Carregando colaboradores...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      Nenhum colaborador encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.position ? getPositionBadge(emp.position) : '-'}</TableCell>
                      <TableCell>{getDepartmentLabel(emp.department)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditClick(emp)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteClick(emp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
