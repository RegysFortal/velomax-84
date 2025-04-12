
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { differenceInDays } from 'date-fns';
import { TrendingUp, ClipboardList, PieChart } from 'lucide-react';

interface FinancialSummaryCardsProps {
  averageDeliveries: number;
  startDate: string;
  endDate: string;
}

export const FinancialSummaryCards = ({
  averageDeliveries,
  startDate,
  endDate
}: FinancialSummaryCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Média de Entregas
          </CardTitle>
          <CardDescription>
            No período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center pt-2">
            <div className="text-3xl font-bold">
              {averageDeliveries.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              entregas por dia
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <ClipboardList className="mr-2 h-4 w-4" />
            Período de Análise
          </CardTitle>
          <CardDescription>
            Total de dias analisados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center pt-2">
            <div className="text-3xl font-bold">
              {Math.max(differenceInDays(new Date(endDate), new Date(startDate)) + 1, 1)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              dias no período
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <PieChart className="mr-2 h-4 w-4" />
            Análise de Desempenho
          </CardTitle>
          <CardDescription>
            Comparativo de receita
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center pt-2">
            <div className="text-lg font-medium">
              Veja os gráficos para
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              análise detalhada de receita e volume
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
