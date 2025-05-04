
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CompanyFormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextarea?: boolean;
  disabled?: boolean;
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
  disabled = false
}: CompanyFormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <Label htmlFor={id}>{label}</Label>
      </div>
      
      {isTextarea ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows={4}
          className={disabled ? "bg-gray-50" : ""}
          disabled={disabled}
        />
      ) : (
        <Input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={disabled ? "bg-gray-50" : ""}
          disabled={disabled}
        />
      )}
    </div>
  );
}
