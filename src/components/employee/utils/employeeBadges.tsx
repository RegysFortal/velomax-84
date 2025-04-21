
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";

export const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-red-500">Administrador</Badge>;
    case 'manager':
      return <Badge className="bg-blue-500">Gerente</Badge>;
    default:
      return <Badge>Usuário</Badge>;
  }
};

export const getPositionBadge = (position: string | undefined) => {
  if (!position) return null;
  
  switch (position.toLowerCase()) {
    case 'motorista':
      return <Badge className="bg-green-500">Motorista</Badge>;
    case 'ajudante':
      return <Badge className="bg-purple-500">Ajudante</Badge>;
    default:
      return <Badge className="bg-gray-500">{position}</Badge>;
  }
};

export const getDepartmentLabel = (department: string | undefined) => {
  if (!department) return '-';
  
  switch (department) {
    case 'operations':
      return 'Operações';
    case 'finance':
      return 'Financeiro';
    case 'administrative':
      return 'Administrativo';
    case 'logistics':
      return 'Logística';
    case 'commercial':
      return 'Comercial';
    default:
      return department;
  }
};
