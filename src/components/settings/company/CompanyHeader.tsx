
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface CompanyHeaderProps {
  isEditable?: boolean;
}

export function CompanyHeader({ isEditable = true }: CompanyHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        Dados da Empresa
        {!isEditable && (
          <span className="text-sm font-normal text-amber-500 flex items-center gap-1">
            <AlertCircle size={16} />
            Modo Somente Leitura
          </span>
        )}
      </CardTitle>
      <CardDescription>
        {isEditable 
          ? 'Configure as informações da sua empresa que serão exibidas em relatórios e documentos.'
          : 'Essas informações da empresa serão exibidas em relatórios e documentos. Você não tem permissão para alterá-las.'}
      </CardDescription>
    </CardHeader>
  );
}
