
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, Clock, Calendar } from "lucide-react";
import { PayableAccount } from "@/types/financial";

interface PayableAccountsStatsProps {
  accounts: PayableAccount[];
}

export const PayableAccountsStats = ({ accounts }: PayableAccountsStatsProps) => {
  // Calculate statistics
  const totalAmount = accounts.reduce((sum, account) => sum + account.amount, 0);
  const pendingAmount = accounts
    .filter(account => account.status === "pending" || account.status === "overdue")
    .reduce((sum, account) => sum + account.amount, 0);
    
  const overdueAmount = accounts
    .filter(account => account.status === "overdue")
    .reduce((sum, account) => sum + account.amount, 0);
  
  // Calculate counts
  const pendingCount = accounts.filter(account => 
    account.status === "pending" || account.status === "overdue"
  ).length;
  const overdueCount = accounts.filter(account => account.status === "overdue").length;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
          <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {accounts.length} contas registradas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contas Pendentes</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {pendingCount} contas a serem pagas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contas Atrasadas</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(overdueAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {overdueCount} contas em atraso
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
