export interface Employee {
  id: string;
  name: string;
  employeeNumber: string;
  type: 'CAO' | 'MBV';
  startDate: string;
  yearsOfService: number;
}

export interface KeyItem {
  id: string;
  keyNumber: string;
  type: 'A' | 'B' | 'C';
  length: 'kort' | 'lang';
  status: 'available' | 'issued';
  assignedTo?: string;
  opmerking?: string;
}

export interface Transaction {
  id: string;
  employeeId: string;
  keyId: string;
  action: 'issue' | 'return';
  timestamp: Date;
  notes?: string;
  handledBy?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}