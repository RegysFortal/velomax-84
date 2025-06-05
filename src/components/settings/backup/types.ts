
export interface BackupSelectionState {
  includeOperational: boolean;
  includeFinancial: boolean;
  includeFleet: boolean;
  includeInventory: boolean;
  includeSettings: boolean;
}

export interface BackupMetadata {
  createdAt: string;
  version: string;
  type: string;
  includes: string[];
}

export interface BackupData extends Record<string, any> {
  _metadata: BackupMetadata;
}
