
export interface Employee {
  id: string;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  hireDate?: string;
  departmentId?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  
  // Additional fields for employee information
  rg?: string;
  cpf?: string;
  birthDate?: string;
  driverLicense?: string;
  driverLicenseExpiry?: string;
  driverLicenseCategory?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  employeeSince?: string;
}
