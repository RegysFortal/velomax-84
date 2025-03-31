
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { useLogbook } from '@/contexts/LogbookContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Car, Wrench, CarFront, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Maintenance = () => {
  const { vehicles, maintenances } = useLogbook();

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manutenções</h1>
            <p className="text-muted-foreground">
              Gerencie manutenções, trocas de óleo e pneus da frota.
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="oil">Trocas de Óleo</TabsTrigger>
            <TabsTrigger value="tires">Pneus</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{vehicle.plate}</CardTitle>
                    <CardDescription>{vehicle.model} ({vehicle.year})</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Odômetro:</dt>
                        <dd className="font-medium">{vehicle.currentOdometer} km</dd>
                      </div>
                      
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Última troca de óleo:</dt>
                        <dd className="font-medium">{vehicle.lastOilChange} km</dd>
                      </div>
                      
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Próxima troca em:</dt>
                        <dd className={`font-medium ${vehicle.nextOilChangeKm - vehicle.currentOdometer < 1000 ? "text-destructive" : ""}`}>
                          {vehicle.nextOilChangeKm - vehicle.currentOdometer} km
                        </dd>
                      </div>
                    </dl>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="w-full flex items-center gap-1">
                        <Wrench className="h-4 w-4" />
                        <span>Manutenção</span>
                      </Button>
                      <Button size="sm" variant="outline" className="w-full flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        <span>Pneu</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Manutenções Recentes</h2>
              {maintenances.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <Wrench className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">Nenhuma manutenção registrada.</p>
                    <Button variant="outline" className="mt-4">
                      Registrar manutenção
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-muted-foreground">Lista de manutenções será implementada em breve.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="oil" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Trocas de Óleo</CardTitle>
                <CardDescription>
                  Controle de trocas de óleo por veículo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CarFront className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">A funcionalidade de trocas de óleo será implementada em breve.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tires" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Controle de Pneus</CardTitle>
                <CardDescription>
                  Gerencie as trocas e rodízio de pneus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Car className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">A funcionalidade de controle de pneus será implementada em breve.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Manutenções</CardTitle>
                <CardDescription>
                  Histórico completo de manutenções por veículo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <History className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">O histórico de manutenções será implementado em breve.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Maintenance;
