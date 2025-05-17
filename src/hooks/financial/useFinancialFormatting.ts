
export function useFinancialFormatting() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  // Formatar método de pagamento para exibição
  const getPaymentMethodLabel = (method?: string) => {
    if (!method) return "N/A";
    
    const methods = {
      boleto: "Boleto",
      pix: "PIX",
      cartao: "Cartão",
      especie: "Espécie",
      transferencia: "Transferência"
    };
    
    return methods[method as keyof typeof methods] || method;
  };

  return {
    formatCurrency,
    getPaymentMethodLabel
  };
}
