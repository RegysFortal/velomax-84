
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { toISODateString } from '@/utils/dateUtils';

interface ReportFiltersProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: (date: Date | undefined) => void;
  onEndDateChange?: (date: Date | undefined) => void;
  onApplyFilters?: () => void;
}

export function ReportFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyFilters
}: ReportFiltersProps = {}) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {onStartDateChange && (
        <div className="space-y-2">
          <Label htmlFor="start-date">Data Inicial</Label>
          <DatePicker
            date={startDate}
            onSelect={onStartDateChange}
            placeholder="Selecionar data inicial"
          />
        </div>
      )}
      
      {onEndDateChange && (
        <div className="space-y-2">
          <Label htmlFor="end-date">Data Final</Label>
          <DatePicker
            date={endDate}
            onSelect={onEndDateChange}
            placeholder="Selecionar data final"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="report-type">Tipo de Relatório</Label>
        <Select defaultValue="all">
          <SelectTrigger id="report-type" className="w-[180px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
            <SelectItem value="expense">Despesas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select defaultValue="all">
          <SelectTrigger id="category" className="w-[180px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="freight">Fretes</SelectItem>
            <SelectItem value="rent">Aluguel</SelectItem>
            <SelectItem value="fuel">Combustível</SelectItem>
            <SelectItem value="taxes">Impostos</SelectItem>
            <SelectItem value="other">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="client">Cliente/Fornecedor</Label>
        <Input 
          id="client" 
          placeholder="Nome..." 
          className="w-[200px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="payment-method">Método de Pagamento</Label>
        <Select defaultValue="all">
          <SelectTrigger id="payment-method" className="w-[180px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="card">Cartão</SelectItem>
            <SelectItem value="transfer">Transferência</SelectItem>
            <SelectItem value="cash">Dinheiro</SelectItem>
            <SelectItem value="bank_slip">Boleto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="ml-auto">
        <Button variant="outline" onClick={onApplyFilters}>
          <Filter className="mr-2 h-4 w-4" />
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}
