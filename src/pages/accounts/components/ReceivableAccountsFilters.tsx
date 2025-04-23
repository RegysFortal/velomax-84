
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

export function ReceivableAccountsFilters() {
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
            <SelectItem value="received">Recebido</SelectItem>
            <SelectItem value="partially_received">Recebido Parcial</SelectItem>
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
            <SelectItem value="1">Fretes</SelectItem>
            <SelectItem value="2">Vendas</SelectItem>
            <SelectItem value="3">Reembolsos</SelectItem>
            <SelectItem value="4">Serviços</SelectItem>
            <SelectItem value="5">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1 min-w-[200px]">
        <Label htmlFor="client">Cliente</Label>
        <Input 
          id="client" 
          placeholder="Buscar cliente..." 
          className="w-full"
        />
      </div>
      
      <div className="space-y-1 min-w-[200px]">
        <Label htmlFor="received-method">Forma de recebimento</Label>
        <Select defaultValue="all">
          <SelectTrigger id="received-method" className="w-full">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="bank_slip">Boleto</SelectItem>
            <SelectItem value="cash">Dinheiro</SelectItem>
            <SelectItem value="transfer">Transferência</SelectItem>
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
