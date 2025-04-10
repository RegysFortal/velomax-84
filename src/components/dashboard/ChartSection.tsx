
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart } from '@/components/ui/chart';

interface ChartSectionProps {
  deliveriesChartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  shipmentStatusData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
}

export const ChartSection = ({
  deliveriesChartData,
  shipmentStatusData
}: ChartSectionProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Entregas por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={deliveriesChartData} className="aspect-[2/1]" />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Embarques por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={shipmentStatusData} className="aspect-[4/3]" />
        </CardContent>
      </Card>
    </div>
  );
};
