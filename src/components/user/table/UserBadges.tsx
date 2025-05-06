
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-red-500">Administrador</Badge>;
    case 'manager':
      return <Badge className="bg-blue-500">Gerente</Badge>;
    default:
      return <Badge>Usuário</Badge>;
  }
};

interface PositionBadgeProps {
  position?: string;
}

export const PositionBadge = ({ position }: PositionBadgeProps) => {
  if (!position) return null;
  
  switch (position.toLowerCase()) {
    case 'motorista':
      return <Badge className="bg-green-500">Motorista</Badge>;
    case 'ajudante':
      return <Badge className="bg-purple-500">Ajudante</Badge>;
    default:
      return null;
  }
};
