import React, { useState } from 'react';
import { Button, Card } from '../components/ui';
import { Supplier, Product } from '../types';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface SuppliersPageProps {
  suppliers: Supplier[];
  products: Product[];
  searchQuery?: string;
}

export const SuppliersPage: React.FC<SuppliersPageProps> = ({ suppliers, products, searchQuery = '' }) => {
  const [expandedSup, setExpandedSup] = useState<string | null>(null);

  const filteredSuppliers = suppliers.filter(sup => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      sup.name.toLowerCase().includes(q) ||
      sup.contactEmail.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-bt-text dark:text-white tracking-tight">Suppliers & Products</h1>
        <Button variant="secondary">Download Catalogue</Button>
      </div>
      
      <div className="grid gap-4">
        {filteredSuppliers.map(sup => {
           const supProducts = products.filter(p => p.supplierId === sup.id);
           const isExpanded = expandedSup === sup.id;

           return (
             <Card key={sup.id} noPadding className="transition-all duration-200 border-0 shadow-soft">
               <div 
                 className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                 onClick={() => setExpandedSup(isExpanded ? null : sup.id)}
               >
                 <div>
                   <h3 className="text-lg font-bold text-bt-indigo dark:text-bt-indigoLight">{sup.name}</h3>
                   <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Contact: {sup.contactEmail} • {sup.phone}</p>
                 </div>
                 <div className="flex items-center text-sm text-gray-500 dark:text-slate-500">
                    <span className="mr-4 font-medium">{supProducts.length} Products Available</span>
                    {isExpanded ? <ChevronUpIcon className="h-5 w-5"/> : <ChevronDownIcon className="h-5 w-5"/>}
                 </div>
               </div>
               
               {isExpanded && (
                 <div className="border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-6 animate-in fade-in slide-in-from-top-1">
                   <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-widest mb-4">Product Catalogue</h4>
                   <div className="bg-white dark:bg-bt-darkCard rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
                        <thead className="bg-gray-100 dark:bg-slate-800/80">
                          <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Product Name</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Description</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Unit Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                          {supProducts.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                              <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-slate-200">{p.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-slate-400">{p.description}</td>
                              <td className="px-4 py-3 text-sm font-extrabold text-gray-900 dark:text-white text-right">£{p.unitCost.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                   </div>
                 </div>
               )}
             </Card>
           );
        })}
      </div>
    </div>
  );
};