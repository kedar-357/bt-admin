import { useState, useEffect } from 'react';
import { 
  MOCK_ORDERS, MOCK_QUOTES, MOCK_INVOICES, 
  MOCK_SITES, MOCK_SUPPLIERS, MOCK_PRODUCTS 
} from '../constants';
import { Quote, Order, Invoice, Site, Supplier, Product } from '../types';

export const useBusinessLogic = () => {
  const [sites, setSites] = useState<Site[]>(MOCK_SITES);
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [suppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);

  // Central Simulation Loop: Runs every 1s
  useEffect(() => {
    const interval = setInterval(() => {
       const now = Date.now();
       
       // 1. Update Quotes
       setQuotes(prevQuotes => {
          return prevQuotes.map(q => {
             if (!q.statusChangedAt) return q;
             const elapsed = now - q.statusChangedAt;

             // Supplier Approval (5s) -> Awaiting Customer Approval
             if (q.status === 'Awaiting Supplier Approval' && elapsed > 5000) {
                 return { ...q, status: 'Awaiting Customer Approval', statusChangedAt: now };
             }
             // Customer Approval (10s) -> Checking Credit
             if (q.status === 'Awaiting Customer Approval' && elapsed > 10000) {
                 return { ...q, status: 'Checking Credit', statusChangedAt: now };
             }
             // Checking Credit (10s) -> Checking Site
             if (q.status === 'Checking Credit' && elapsed > 10000) {
                 return { ...q, status: 'Checking Site', statusChangedAt: now };
             }
             // Checking Site (10s) -> Approved (Conversion)
             if (q.status === 'Checking Site' && elapsed > 10000) {
                 return { ...q, status: 'Approved', statusChangedAt: now };
             }

             return q;
          });
       });

       // 2. Update Orders (Lifecycle Simulation)
       setOrders(prevOrders => {
          return prevOrders.map(o => {
             if (!o.statusChangedAt) return o;
             const elapsed = now - o.statusChangedAt;
             const stepTime = 5000; // 5 seconds per stage

             if (o.status === 'Submitted' && elapsed > stepTime) return { ...o, status: 'Processing', statusChangedAt: now };
             if (o.status === 'Processing' && elapsed > stepTime) return { ...o, status: 'Inventory check', statusChangedAt: now };
             if (o.status === 'Inventory check' && elapsed > stepTime) return { ...o, status: 'Field agent assign', statusChangedAt: now };
             if (o.status === 'Field agent assign' && elapsed > stepTime) return { ...o, status: 'Infra procurement', statusChangedAt: now };
             if (o.status === 'Infra procurement' && elapsed > stepTime) return { ...o, status: 'Installation', statusChangedAt: now };
             if (o.status === 'Installation' && elapsed > stepTime) return { ...o, status: 'Job done', statusChangedAt: now };
             if (o.status === 'Job done' && elapsed > stepTime) return { ...o, status: 'Active', statusChangedAt: now };
             
             return o;
          });
       });

    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Effect to handle Quote -> Order -> Invoice conversion
  useEffect(() => {
     const approvedQuotes = quotes.filter(q => q.status === 'Approved');
     
     if (approvedQuotes.length > 0) {
        approvedQuotes.forEach(q => {
           // 1. Create Order
           const newOrder: Order = {
             id: `ORD-${Math.floor(Math.random() * 100000)}`,
             quoteId: q.id,
             status: 'Submitted',
             site: q.site,
             submittedDate: new Date().toISOString().split('T')[0],
             items: q.items.map(i => i.productName),
             statusChangedAt: Date.now()
           };

           // 2. Create Invoice
           const taxRate = 0.20; // 20% VAT
           const taxAmount = q.value * taxRate;
           const totalAmount = q.value + taxAmount;
           const newInvoice: Invoice = {
             id: `INV-${Date.now()}`,
             orderId: newOrder.id,
             customerName: q.customerName,
             period: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
             amount: q.value,
             tax: taxAmount,
             total: totalAmount,
             status: 'Due',
             dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 days
             method: 'Direct Debit'
           };

           setOrders(prev => [newOrder, ...prev]);
           setInvoices(prev => [newInvoice, ...prev]);
           
           // 3. Mark Quote as Converted to stop re-processing
           setQuotes(prev => prev.map(curr => curr.id === q.id ? { ...curr, status: 'Converted' } : curr));
        });
     }
  }, [quotes]);

  return {
    sites, setSites,
    quotes, setQuotes,
    orders, setOrders,
    invoices, setInvoices,
    suppliers,
    products
  };
};