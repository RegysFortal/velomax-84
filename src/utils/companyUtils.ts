
/**
 * Formats company information for reports
 */
export function getCompanyInfo() {
  const storedData = localStorage.getItem('company_settings');
  return storedData ? JSON.parse(storedData) : {
    name: 'VeloMax Transportes',
    cnpj: '12.345.678/0001-90',
    address: 'Av. Principal, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
    phone: '(11) 1234-5678',
    email: 'contato@velomax.com',
    website: 'www.velomax.com',
    description: 'Empresa especializada em transporte de cargas.'
  };
}

/**
 * Formats a client's name for report file names
 * Takes the first name and capitalizes only the first letter
 */
export function formatClientNameForFileName(clientName: string): string {
  if (!clientName) return 'cliente';
  
  // Get the first name only
  const firstName = clientName.split(' ')[0];
  
  // Capitalize only first letter, make rest lowercase
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}
