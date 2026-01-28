import { Quote, Order, Invoice, Service, User, Site, Ticket, Notification, Supplier, Product } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Smith', email: 'alice@acmecorp.com', role: 'Super Admin', status: 'Active', lastActive: '2023-10-27 10:30' },
  { id: 'u2', name: 'Bob Jones', email: 'bob@acmecorp.com', role: 'Admin', status: 'Active', lastActive: '2023-10-26 14:15' },
  { id: 'u3', name: 'Charlie Day', email: 'charlie@acmecorp.com', role: 'User', status: 'Pending', lastActive: '-' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'SUP-001', name: 'Cisco Systems', contactEmail: 'sales@cisco.com', phone: '0800 123 456' },
  { id: 'SUP-002', name: 'Yealink', contactEmail: 'distro@yealink.com', phone: '0800 999 888' },
  { id: 'SUP-003', name: 'Openreach', contactEmail: 'provisioning@openreach.co.uk', phone: '0800 111 222' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'PROD-001', supplierId: 'SUP-003', name: 'Fibre 900 Connection', description: '900Mbps downstream / 115Mbps upstream', unitCost: 45.00 },
  { id: 'PROD-002', supplierId: 'SUP-003', name: 'Fibre 300 Connection', description: '300Mbps downstream / 48Mbps upstream', unitCost: 35.00 },
  { id: 'PROD-003', supplierId: 'SUP-001', name: 'Meraki MR36 AP', description: 'Wi-Fi 6 Access Point', unitCost: 250.00 },
  { id: 'PROD-004', supplierId: 'SUP-001', name: 'Meraki MX68 Gateway', description: 'Security & SD-WAN Appliance', unitCost: 450.00 },
  { id: 'PROD-005', supplierId: 'SUP-002', name: 'SIP-T54W IP Phone', description: 'Prime Business Phone', unitCost: 120.00 },
  { id: 'PROD-006', supplierId: 'SUP-002', name: 'CP960 Conference Phone', description: 'Optima HD IP Conference Phone', unitCost: 350.00 },
];

export const MOCK_QUOTES: Quote[] = [
  { 
    id: 'Q-2023-001', 
    customerName: 'Acme HQ', 
    site: 'London Main', 
    createdDate: '2023-10-15', 
    value: 1250.00, 
    status: 'Approved', 
    owner: 'Alice Smith', 
    items: [
      { id: 'qi-1', productId: 'PROD-001', productName: 'Fibre 900 Connection', quantity: 1, unitCost: 45.00, totalCost: 45.00 },
      { id: 'qi-2', productId: 'PROD-004', productName: 'Meraki MX68 Gateway', quantity: 2, unitCost: 450.00, totalCost: 900.00 }
    ] 
  },
  { 
    id: 'Q-2023-002', 
    customerName: 'Acme North', 
    site: 'Manchester Branch', 
    createdDate: '2023-10-20', 
    value: 450.00, 
    status: 'Draft', 
    owner: 'Bob Jones', 
    items: [
      { id: 'qi-3', productId: 'PROD-005', productName: 'SIP-T54W IP Phone', quantity: 5, unitCost: 120.00, totalCost: 600.00 }
    ] 
  },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-8892', quoteId: 'Q-2023-001', status: 'Processing', site: 'London Main', submittedDate: '2023-10-18', items: ['Fibre 900', 'Static IP'] },
  { id: 'ORD-8899', quoteId: 'Q-2023-999', status: 'Engineer Scheduled', site: 'Leeds Warehouse', submittedDate: '2023-10-22', engineerAppointment: '2023-11-05 09:00', items: ['Leased Line 1Gb'] },
  { id: 'ORD-9001', status: 'Active', site: 'London Main', submittedDate: '2023-09-01', items: ['Cloud Voice Express'] },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-10', period: 'Oct 2023', amount: 1250.00, tax: 250.00, total: 1500.00, status: 'Due', dueDate: '2023-11-01', method: 'Direct Debit' },
  { id: 'INV-2023-09', period: 'Sep 2023', amount: 1245.50, tax: 249.10, total: 1494.60, status: 'Paid', dueDate: '2023-10-01', method: 'Direct Debit' },
  { id: 'INV-2023-08', period: 'Aug 2023', amount: 1245.50, tax: 249.10, total: 1494.60, status: 'Overdue', dueDate: '2023-09-01', method: 'Credit Card' },
];

export const MOCK_SERVICES: Service[] = [
  { id: 'SVC-001', name: 'Business Fibre 900', site: 'London Main', status: 'Active', startDate: '2022-01-15', term: '24 Months' },
  { id: 'SVC-002', name: 'Cloud Phone System', site: 'London Main', status: 'Active', startDate: '2022-01-15', term: '24 Months' },
  { id: 'SVC-003', name: 'Secure Access', site: 'Manchester Branch', status: 'Pending', startDate: '2023-11-01', term: '36 Months' },
];

export const MOCK_SITES: Site[] = [
  { id: 'SITE-LDN', name: 'London Main', address: '1 Newgate St, London EC1A 7AJ', servicesCount: 2, primaryContact: 'Alice Smith' },
  { id: 'SITE-MAN', name: 'Manchester Branch', address: '45 Mosley St, Manchester M2 3HZ', servicesCount: 1, primaryContact: 'Bob Jones' },
  { id: 'SITE-BIRM', name: 'Birmingham Hub', address: '1 Colmore Row, Birmingham B3 2BJ', servicesCount: 0, primaryContact: 'David Miller' },
  { id: 'SITE-LEEDS', name: 'Leeds Warehouse', address: 'Sweet St, Leeds LS11 9AY', servicesCount: 1, primaryContact: 'Sarah Jenkins' },
  { id: 'SITE-GLASGOW', name: 'Glasgow Office', address: '200 Renfield St, Glasgow G2 3PR', servicesCount: 0, primaryContact: 'Kevin Mccall' },
  { id: 'SITE-BRISTOL', name: 'Bristol Tech Park', address: 'Temple Way, Bristol BS2 0BU', servicesCount: 0, primaryContact: 'Emily White' },
];

export const MOCK_TICKETS: Ticket[] = [
  { id: 'INC-5542', priority: 'High', site: 'London Main', status: 'In Progress', openedDate: '2023-10-27', lastUpdate: '2023-10-27 11:00', subject: 'Intermittent Connectivity' },
  { id: 'REQ-1123', priority: 'Low', site: 'Manchester Branch', status: 'New', openedDate: '2023-10-26', lastUpdate: '2023-10-26 09:30', subject: 'Request for new user setup' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Invoice Due', message: 'Invoice INV-2023-10 is due in 3 days.', type: 'warning', timestamp: '2 hours ago', read: false },
  { id: 'n2', title: 'Order Update', message: 'Order ORD-8899 engineer appointment confirmed.', type: 'success', timestamp: '1 day ago', read: false },
];