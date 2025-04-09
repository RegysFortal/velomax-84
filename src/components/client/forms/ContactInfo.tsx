
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactInfoProps {
  contact: string;
  setContact: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
}

export function ContactInfo({
  contact,
  setContact,
  phone,
  setPhone,
  email,
  setEmail,
}: ContactInfoProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact">Contato</Label>
          <Input 
            id="contact" 
            value={contact} 
            onChange={(e) => setContact(e.target.value)} 
            placeholder="Nome do contato"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input 
            id="phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="email@exemplo.com"
        />
      </div>
    </>
  );
}
