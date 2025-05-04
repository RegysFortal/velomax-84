
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LucideIcon } from 'lucide-react';

interface CompanyFormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextarea?: boolean;
  rows?: number;
}

export function CompanyFormField({
  id,
  name,
  label,
  value,
  icon: Icon,
  iconColor,
  onChange,
  isTextarea = false,
  rows = 3
}: CompanyFormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-4">
        <Icon className={`h-5 w-5 ${iconColor} mt-1`} />
        <div className="space-y-1 flex-1">
          <Label htmlFor={id}>{label}</Label>
          {isTextarea ? (
            <Textarea
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              rows={rows}
            />
          ) : (
            <Input
              id={id}
              name={name}
              value={value}
              onChange={onChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
