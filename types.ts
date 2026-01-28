
export type Status = 'Draft' | 'Pending' | 'Approved' | 'Active' | 'Expired' | 'Cancelled' | 'Paid' | 'Overdue' | 'Part-paid' | 'Suspended' | 'Closed' | 'Open' | 'Awaiting Supplier Approval' | 'Awaiting Customer Approval' | 'Checking Credit' | 'Checking Site' | 'Converted' | 'Submitted' | 'Processing' | 'Survey' | 'Engineer Scheduled' | 'Installation' | 'Job done' | 'Due' | 'Inventory check' | 'Field agent assign' | 'Infra procurement';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Advanced User' | 'Admin' | 'Super Admin';
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactEmail: string;
  phone: string;
}

export interface Product {
  id: string;
  supplierId: string;
  name: string;
  description: string;
  unitCost: number;
}

export interface QuoteItem {
  id: string;
  productId: string;
  productName: string; // Snapshot
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface Quote {
  id: string;
  customerName: string;
  site: string;
  createdDate: string;
  value: number;
  status: Status;
  owner: string;
  items: QuoteItem[];
  statusChangedAt?: number; // Timestamp for simulation
}

export interface Order {
  id: string;
  quoteId?: string;
  status: Status;
  site: string;
  submittedDate: string;
  engineerAppointment?: string;
  items: string[];
  statusChangedAt?: number; // Timestamp for simulation
}

export interface Invoice {
  id: string;
  orderId?: string; // Link to order
  customerName?: string;
  period: string;
  amount: number; // Net
  tax: number; // VAT
  total: number; // Gross
  status: Status;
  dueDate: string;
  method: string;
}

export interface Service {
  id: string;
  name: string;
  site: string;
  status: 'Active' | 'Pending' | 'Suspended';
  startDate: string;
  term: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  servicesCount: number;
  primaryContact: string;
}

export interface Ticket {
  id: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  site: string;
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
  openedDate: string;
  lastUpdate: string;
  subject: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}
