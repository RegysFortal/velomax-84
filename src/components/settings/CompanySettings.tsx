import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Building, Map, Phone, Mail, Globe } from 'lucide-react';

export function CompanySettings() {
  const [companyData, setCompanyData] = useState(() => {
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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('company_settings', JSON.stringify(companyData));
    toast({
      title: "Configurações salvas",
      description: "Os dados da empresa foram atualizados com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
          <CardDescription>
            Configure as informações da sua empresa que serão exibidas em relatórios e documentos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                <Building className="h-5 w-5 text-blue-500 mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input
                    id="company-name"
                    name="name"
                    value={companyData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                <Building className="h-5 w-5 text-indigo-500 mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    value={companyData.cnpj}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                <Map className="h-5 w-5 text-green-500 mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    name="address"
                    value={companyData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                <Map className="h-5 w-5 text-green-500 mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    name="city"
                    value={companyData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                <Map className="h-5 w-5 text-green-500 mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    name="state"
                    value={companyData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                <Map className="h-5 w-5 text-green-500 mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={companyData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                <Phone className="h-5 w-5 text-purple-500 mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={companyData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                <Mail className="h-5 w-5 text-red-500 mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={companyData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                <Globe className="h-5 w-5 text-blue-500 mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={companyData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Empresa</Label>
            <Textarea
              id="description"
              name="description"
              value={companyData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
