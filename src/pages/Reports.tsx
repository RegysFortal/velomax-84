
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Reports = () => {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  
  return (
    <div>
      <h1>Relatórios de Fechamento</h1>
      {reportId ? (
        <p>Visualizando relatório ID: {reportId}</p>
      ) : (
        <p>Selecione um relatório para visualizar</p>
      )}
    </div>
  );
};

export default Reports;
