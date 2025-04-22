
export interface SearchableSelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  showCreateOption?: boolean;
  createOptionLabel?: string;
  onCreateNew?: (value: string) => void;
  disabled?: boolean;
}
