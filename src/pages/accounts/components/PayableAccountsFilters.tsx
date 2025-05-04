
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export function PayableAccountsFilters() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-2">
        <Label htmlFor="search">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Fornecedor ou descrição..."
            className="pl-8 w-[250px]"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select defaultValue="all">
          <SelectTrigger id="category" className="w-[180px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="combustivel">Combustível</SelectItem>
            <SelectItem value="aluguel">Aluguel</SelectItem>
            <SelectItem value="seguros">Seguros</SelectItem>
            <SelectItem value="manutencao">Manutenção</SelectItem>
            <SelectItem value="servicos">Serviços</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select defaultValue="all">
          <SelectTrigger id="status" className="w-[180px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="paid">Pagos</SelectItem>
            <SelectItem value="overdue">Atrasados</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="payment-method">Forma de Pagamento</Label>
        <Select defaultValue="all">
          <SelectTrigger id="payment-method" className="w-[180px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="card">Cartão</SelectItem>
            <SelectItem value="transfer">Transferência</SelectItem>
            <SelectItem value="cash">Dinheiro</SelectItem>
            <SelectItem value="bank_slip">Boleto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="ml-auto">
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}
