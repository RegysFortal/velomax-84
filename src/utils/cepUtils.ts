
/**
 * Utility function to fetch address information from a CEP (Brazilian postal code)
 * Uses the public ViaCEP API
 */
export interface CepResponse {
  cep: string;
  logradouro: string; // street
  complemento: string;
  bairro: string; // neighborhood
  localidade: string; // city
  uf: string; // state
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const fetchAddressFromCep = async (cep: string): Promise<CepResponse | null> => {
  // Remove any non-numeric characters
  const cleanCep = cep.replace(/\D/g, '');
  
  // Check if we have a valid CEP format (8 digits)
  if (cleanCep.length !== 8) {
    return null;
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    // If the API returns an error
    if (data.erro) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching CEP:', error);
    return null;
  }
};
