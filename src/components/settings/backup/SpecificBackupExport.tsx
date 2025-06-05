
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SaveAll } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";

export function SpecificBackupExport() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const createCitiesAndPriceTablesBackup = async () => {
    try {
      setIsExporting(true);
      
      const backupData: Record<string, any> = {};
      
      // Collect cities from localStorage
      const citiesLocalStorage = localStorage.getItem('velomax_cities');
      if (citiesLocalStorage) {
        try {
          backupData['velomax_cities'] = JSON.parse(citiesLocalStorage);
          console.log('Added cities from localStorage to backup');
        } catch (err) {
          console.error('Error parsing cities from localStorage:', err);
        }
      }

      // Collect price tables from localStorage
      const priceTablesLocalStorage = localStorage.getItem('velomax_price_tables');
      if (priceTablesLocalStorage) {
        try {
          backupData['velomax_price_tables'] = JSON.parse(priceTablesLocalStorage);
          console.log('Added price tables from localStorage to backup');
        } catch (err) {
          console.error('Error parsing price tables from localStorage:', err);
        }
      }

      // Collect cities from Supabase
      try {
        const { data: citiesData, error: citiesError } = await supabase
          .from('cities')
          .select('*');
        
        if (!citiesError && citiesData) {
          backupData['supabase_cities'] = citiesData;
          console.log('Added cities from Supabase to backup:', citiesData.length);
        }
      } catch (error) {
        console.error('Error fetching cities from Supabase:', error);
      }

      // Collect price tables from Supabase
      try {
        const { data: priceTablesData, error: priceTablesError } = await supabase
          .from('price_tables')
          .select('*');
        
        if (!priceTablesError && priceTablesData) {
          backupData['supabase_price_tables'] = priceTablesData;
          console.log('Added price tables from Supabase to backup:', priceTablesData.length);
        }
      } catch (error) {
        console.error('Error fetching price tables from Supabase:', error);
      }
      
      // Create metadata
      backupData['_metadata'] = {
        createdAt: new Date().toISOString(),
        version: '2.1',
        type: 'velomax_cities_pricetables_backup',
        includes: ['cidades', 'tabelas de preço'],
        source: 'velomax_system',
        dataKeys: Object.keys(backupData).filter(key => key !== '_metadata')
      };
      
      // Create JSON and download it
      const backupJson = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with date
      const date = new Date().toISOString().split('T')[0];
      const fileName = `velomax_backup_cidades_tabelas_precos_${date}.json`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Log backup action in Supabase if connected
      if (user) {
        try {
          await supabase.from('backup_logs').insert([{
            user_id: user.id,
            backup_type: 'cities_price_tables',
            file_name: fileName,
            file_size: backupJson.length,
            notes: 'Backup específico de cidades e tabelas de preços'
          }]);
        } catch (logError) {
          console.error("Error logging backup:", logError);
        }
      }
      
      console.log('Cities and price tables backup created successfully');
      toast({
        title: "Backup criado com sucesso",
        description: `Arquivo criado: ${fileName}. Contém cidades e tabelas de preços.`,
      });
    } catch (error) {
      console.error("Error creating cities and price tables backup:", error);
      toast({
        title: "Erro ao criar backup",
        description: "Ocorreu um erro ao exportar os dados de cidades e tabelas de preços.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup Específico - Cidades e Tabelas de Preços</CardTitle>
        <CardDescription>
          Crie um arquivo de backup contendo apenas as cidades e tabelas de preços para transferir para outro sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Este backup incluirá:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Todas as cidades cadastradas (localStorage + Supabase)</li>
            <li>Todas as tabelas de preços (localStorage + Supabase)</li>
          </ul>
          
          <Button
            onClick={createCitiesAndPriceTablesBackup}
            disabled={isExporting}
            className="w-full"
          >
            <SaveAll className="mr-2 h-4 w-4" />
            {isExporting ? "Criando backup..." : "Criar Backup de Cidades e Tabelas de Preços"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
