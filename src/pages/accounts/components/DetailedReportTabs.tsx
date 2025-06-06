
import { TabsContent } from "@/components/ui/tabs";
import { PayableAccountsTable } from "./PayableAccountsTable";
import { PayableAccountsFilters } from "./PayableAccountsFilters";

interface DetailedReportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  startDate: Date;
  endDate: Date;
}

export function DetailedReportTabs({ activeTab, setActiveTab, startDate, endDate }: DetailedReportTabsProps) {
  return (
    <TabsContent value="expenses" className="space-y-4">
      <div className="space-y-4">
        <PayableAccountsFilters />
        <div className="text-center py-8 text-muted-foreground">
          <p>Tabela de despesas será implementada aqui</p>
          <p className="text-sm">Período: {startDate.toLocaleDateString('pt-BR')} - {endDate.toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </TabsContent>
  );
}
