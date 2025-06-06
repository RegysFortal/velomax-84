
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface SummaryCardsProps {
  totalPayable: number;
  pendingPayable: number;
  totalReceivable: number;
  pendingReceivable: number;
  balance: number;
  cashFlow: number;
  formatCurrency: (value: number) => string;
}

export function SummaryCards({
  totalPayable,
  pendingPayable,
  totalReceivable,
  pendingReceivable,
  balance,
  cashFlow,
  formatCurrency
}: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalReceivable)}</div>
          <p className="text-xs text-muted-foreground">
            Pendente: {formatCurrency(pendingReceivable)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalPayable)}</div>
          <p className="text-xs text-muted-foreground">
            Pendente: {formatCurrency(pendingPayable)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground">
            Receitas - Despesas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fluxo de Caixa</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(cashFlow)}
          </div>
          <p className="text-xs text-muted-foreground">
            Pendências líquidas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
