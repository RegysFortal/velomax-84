
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createPDFReport, createExcelReport } from './exportUtils';
import { formatClientNameForFileName } from './companyUtils';

// Company info for reports
export const getCompanyInfo = () => {
  return {
    name: 'VeloMax Transportes Ltda',
    cnpj: '12.345.678/0001-90',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    phone: '(11) 3000-1000',
    email: 'contato@velomax.com.br',
    website: 'www.velomax.com.br',
  };
};

// Export functions
export { createPDFReport, createExcelReport, formatClientNameForFileName };
