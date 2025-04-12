
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, LineChart } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FinancialChartSectionProps {
  clientDistribution: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  monthlyComparison: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  growthTimeline: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
      tension: number;
    }[];
  };
}

export const FinancialChartSection = ({
  clientDistribution,
  monthlyComparison,
  growthTimeline
}: FinancialChartSectionProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Participação por Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={clientDistribution} className="aspect-[4/3]" />
        </CardContent>
      </Card>
      
      <Card className="col-span-4">
        <CardHeader>
          <Tabs defaultValue="monthly">
            <div className="flex items-center justify-between">
              <CardTitle>Evolução Financeira</CardTitle>
              <TabsList>
                <TabsTrigger value="monthly">Mensal</TabsTrigger>
                <TabsTrigger value="growth">Crescimento</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly">
            <TabsContent value="monthly" className="mt-0">
              <BarChart data={monthlyComparison} className="aspect-[2/1]" />
            </TabsContent>
            <TabsContent value="growth" className="mt-0">
              <LineChart data={growthTimeline} className="aspect-[2/1]" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
