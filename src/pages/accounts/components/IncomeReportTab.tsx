
import { TabsContent } from "@/components/ui/tabs";
import { ReceivableAccountsTable } from "./ReceivableAccountsTable";
import { ReceivableAccountsFilters } from "./ReceivableAccountsFilters";

interface IncomeReportTabProps {
  startDate: Date;
  endDate: Date;
}

export function IncomeReportTab({ startDate, endDate }: IncomeReportTabProps) {
  return (
    <TabsContent value="income" className="space-y-4">
      <div className="space-y-4">
        <ReceivableAccountsFilters />
        <div className="text-center py-8 text-muted-foreground">
          <p>Tabela de receitas será implementada aqui</p>
          <p className="text-sm">Período: {startDate.toLocaleDateString('pt-BR')} - {endDate.toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </TabsContent>
  );
}
