import React, { useState } from 'react';
import { Button, Card, StatusChip } from '../components/ui';
import { Invoice } from '../types';
import { DocumentArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface InvoicesPageProps {
  invoices: Invoice[];
  searchQuery?: string;
}

export const InvoicesPage: React.FC<InvoicesPageProps> = ({ invoices, searchQuery = '' }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.id.toLowerCase().includes(q) ||
      (inv.customerName?.toLowerCase().includes(q) ?? false) ||
      inv.period.toLowerCase().includes(q) ||
      inv.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-bt-text dark:text-white tracking-tight">Invoices</h1>
        <Button variant="secondary">Export All</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
         <Card className="border-0 shadow-soft">
            <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Total Due</span>
            <p className="text-3xl font-extrabold text-bt-text dark:text-white mt-1">
              £{invoices.filter(i=>i.status === 'Due' || i.status === 'Overdue').reduce((acc, curr) => acc + curr.total, 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
         </Card>
      </div>

      <Card noPadding className="overflow-x-auto border-0 shadow-soft">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
          <thead className="bg-gray-50/50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invoice #</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer / Period</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Due Date</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-bt-darkCard divide-y divide-gray-50 dark:divide-slate-800">
            {filteredInvoices.map(inv => (
              <tr 
                key={inv.id} 
                className="hover:bg-indigo-50/30 dark:hover:bg-slate-800 cursor-pointer transition-all group"
                onClick={() => setSelectedInvoice(inv)}
              >
                <td className="px-6 py-4 font-bold text-bt-indigo dark:text-bt-indigoLight underline group-hover:translate-x-1 transition-transform">{inv.id}</td>
                <td className="px-6 py-4">
                   <div className="text-sm font-bold text-gray-900 dark:text-slate-200">{inv.customerName || 'Acme Corp'}</div>
                   <div className="text-xs text-gray-500 dark:text-slate-500">{inv.period}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400 font-medium">{inv.dueDate}</td>
                <td className="px-6 py-4"><StatusChip status={inv.status} /></td>
                <td className="px-6 py-4 text-right text-sm font-extrabold text-gray-900 dark:text-slate-100">£{inv.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                   <button className="text-bt-indigo dark:text-bt-indigoLight hover:text-bt-indigoHover p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all">
                      <DocumentArrowDownIcon className="h-5 w-5"/>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div 
               className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
               onClick={() => setSelectedInvoice(null)}
            ></div>

            <div className="relative inline-block align-bottom bg-white dark:bg-bt-darkCard rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full animate-in zoom-in-95 duration-200">
               <div className="bg-bt-indigo px-6 py-4 flex justify-between items-center text-white">
                  <h3 className="text-xl font-bold tracking-tight">Invoice {selectedInvoice.id}</h3>
                  <button onClick={() => setSelectedInvoice(null)} className="text-white/60 hover:text-white">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
               </div>

               <div className="p-6 lg:p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                     <Card className="bg-gray-50 dark:bg-slate-800/50 border-0 shadow-none">
                        <span className="block text-[10px] text-gray-500 dark:text-slate-400 uppercase font-bold tracking-widest mb-1">Billing Period</span>
                        <span className="block text-lg font-bold text-bt-text dark:text-white">{selectedInvoice.period}</span>
                     </Card>
                     <Card className="bg-gray-50 dark:bg-slate-800/50 border-0 shadow-none">
                        <span className="block text-[10px] text-gray-500 dark:text-slate-400 uppercase font-bold tracking-widest mb-1">Status</span>
                        <div className="mt-1"><StatusChip status={selectedInvoice.status} /></div>
                     </Card>
                  </div>

                  <div className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-3">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-slate-200 uppercase tracking-widest">Customer Details</h3>
                    </div>
                    <div className="p-6 space-y-4 dark:bg-bt-darkCard">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Billed To</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-slate-200">{selectedInvoice.customerName || 'Acme Corp'}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Payment Method</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-slate-200">{selectedInvoice.method}</span>
                        </div>
                         <div className="flex justify-between items-baseline">
                          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Due Date</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-slate-200">{selectedInvoice.dueDate}</span>
                        </div>
                    </div>
                  </div>

                  <div className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
                      <thead className="bg-gray-50/50 dark:bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-slate-800">
                        <tr>
                           <td className="px-6 py-4 text-sm text-gray-900 dark:text-slate-300">Consolidated Services Charge ({selectedInvoice.period})</td>
                           <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-slate-200 text-right">£{selectedInvoice.amount.toFixed(2)}</td>
                        </tr>
                        <tr className="bg-gray-50/30 dark:bg-slate-900/30 font-bold">
                           <td className="px-6 py-2 text-xs text-gray-500 text-right">Subtotal</td>
                           <td className="px-6 py-2 text-xs text-bt-text dark:text-slate-200 text-right">£{selectedInvoice.amount.toFixed(2)}</td>
                        </tr>
                        <tr className="bg-gray-50/30 dark:bg-slate-900/30 font-bold">
                           <td className="px-6 py-2 text-xs text-gray-500 text-right">VAT (20%)</td>
                           <td className="px-6 py-2 text-xs text-bt-text dark:text-slate-200 text-right">£{selectedInvoice.tax.toFixed(2)}</td>
                        </tr>
                        <tr className="bg-bt-indigo text-white">
                           <td className="px-6 py-4 text-lg font-extrabold text-right">Total Due</td>
                           <td className="px-6 py-4 text-xl font-extrabold text-right tracking-tight">£{selectedInvoice.total.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
               </div>

               <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                  {selectedInvoice.status !== 'Paid' && (
                     <Button variant="primary" className="px-8" onClick={() => alert('Redirecting to payment...')}>
                        Pay Now
                     </Button>
                  )}
                  <Button variant="secondary" onClick={() => alert('PDF downloading...')}>
                     <DocumentArrowDownIcon className="h-5 w-5 mr-2" /> Download PDF
                  </Button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};