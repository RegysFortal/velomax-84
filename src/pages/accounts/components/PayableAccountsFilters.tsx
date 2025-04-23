
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

export function PayableAccountsFilters() {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="space-y-1 min-w-[200px]">
        <Label htmlFor="status">Status</Label>
        <Select defaultValue="all">
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="paid">Pago</SelectItem>
            <SelectItem value="overdue">Atrasado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1 min-w-[200px]">
        <Label htmlFor="category">Categoria</Label>
        <Select defaultValue="all">
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="1">Combustível</SelectItem>
            <SelectItem value="2">Aluguel</SelectItem>
            <SelectItem value="3">Seguros</SelectItem>
            <SelectItem value="4">Água</SelectItem>
            <SelectItem value="5">Luz</SelectItem>
            <SelectItem value="6">Folha de pagamento</SelectItem>
            <SelectItem value="7">Impostos</SelectItem>
            <SelectItem value="8">Frete</SelectItem>
            <SelectItem value="9">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1 min-w-[200px]">
        <Label htmlFor="supplier">Fornecedor</Label>
        <Input 
          id="supplier" 
          placeholder="Buscar fornecedor..." 
          className="w-full"
        />
      </div>
      
      <div className="space-y-1 min-w-[200px]">
        <Label htmlFor="payment-method">Forma de pagamento</Label>
        <Select defaultValue="all">
          <SelectTrigger id="payment-method" className="w-full">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="boleto">Boleto</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="card">Cartão</SelectItem>
            <SelectItem value="transfer">Transferência</SelectItem>
            <SelectItem value="cash">Dinheiro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="ml-auto">
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </div>
    </div>
  );
}
