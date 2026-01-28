import React, { useState } from 'react';
import { Button, Card, Input, Select, StatusChip } from '../components/ui';
import { Quote, Product, Site, QuoteItem } from '../types';
import { 
  PlusIcon, TrashIcon, ArrowRightIcon, ChevronLeftIcon, 
  CheckCircleIcon, DocumentTextIcon, ArrowLeftIcon,
  PrinterIcon, ShareIcon, ShoppingBagIcon,
  BuildingLibraryIcon, SignalIcon, ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface QuotesPageProps {
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  products: Product[];
  sites: Site[];
  searchQuery?: string;
}

export const QuotesPage: React.FC<QuotesPageProps> = ({ quotes, setQuotes, products, sites, searchQuery = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'form' | 'summary'>('form');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  
  const [customerName, setCustomerName] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [lineItems, setLineItems] = useState<{productId: string, qty: number}[]>([{productId: '', qty: 1}]);

  const selectedQuote = quotes.find(q => q.id === selectedQuoteId);

  const handleAddLine = () => {
    setLineItems([...lineItems, { productId: '', qty: 1 }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleUpdateLine = (index: number, field: 'productId' | 'qty', value: string | number) => {
    const newLines = [...lineItems];
    // @ts-ignore
    newLines[index][field] = value;
    setLineItems(newLines);
  };

  const calculateSummary = () => {
    const finalItems: QuoteItem[] = [];
    let subtotal = 0;

    lineItems.forEach((item, idx) => {
      const product = products.find(p => p.id === item.productId);
      if (product && item.qty > 0) {
        const cost = product.unitCost * item.qty;
        subtotal += cost;
        finalItems.push({
          id: `qi-${Date.now()}-${idx}`,
          productId: product.id,
          productName: product.name,
          quantity: item.qty,
          unitCost: product.unitCost,
          totalCost: cost
        });
      }
    });

    const tax = subtotal * 0.20;
    const total = subtotal + tax;

    return { finalItems, subtotal, tax, total };
  };

  const { finalItems, subtotal, tax, total } = calculateSummary();

  const handleCreateQuote = () => {
    const site = sites.find(s => s.id === selectedSiteId);
    
    const newQuote: Quote = {
      id: `Q-2023-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      customerName: customerName || 'New Customer',
      site: site ? site.name : 'Unknown Site',
      createdDate: new Date().toISOString().split('T')[0],
      value: subtotal,
      status: 'Awaiting Supplier Approval',
      owner: 'Alice Smith',
      items: finalItems,
      statusChangedAt: Date.now()
    };

    setQuotes(prev => [newQuote, ...prev]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCustomerName('');
    setSelectedSiteId('');
    setLineItems([{productId: '', qty: 1}]);
    setModalStep('form');
  };

  const isFormValid = customerName && selectedSiteId && lineItems.every(li => li.productId && li.qty > 0);

  const filteredQuotes = quotes.filter(q => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      q.id.toLowerCase().includes(query) ||
      q.customerName.toLowerCase().includes(query) ||
      q.site.toLowerCase().includes(query) ||
      q.status.toLowerCase().includes(query)
    );
  });

  if (selectedQuote) {
    // Special View for Validation Checks
    if (selectedQuote.status === 'Checking Credit' || selectedQuote.status === 'Checking Site') {
      const isCreditChecking = selectedQuote.status === 'Checking Credit';
      const isSiteChecking = selectedQuote.status === 'Checking Site';
      
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="pl-0 text-gray-500 hover:text-bt-indigo dark:text-slate-400 transition-colors" onClick={() => setSelectedQuoteId(null)}>
              <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Quotes
            </Button>
          </div>
          
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-bt-text dark:text-white mb-2">Finalizing Quote {selectedQuote.id}</h2>
                <p className="text-gray-500 dark:text-slate-400">Performing mandatory pre-order checks for <span className="text-bt-indigo dark:text-bt-indigoLight font-bold">{selectedQuote.customerName}</span></p>
             </div>

             <div className="space-y-6">
                {/* 1. Customer Approval */}
                <Card className="border-l-4 border-bt-success shadow-soft">
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full text-green-700 dark:text-green-400 mr-4">
                      <CheckCircleIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">Customer Approval</h4>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Quote accepted by customer.</p>
                      <span className="inline-block mt-2 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-400">Completed</span>
                    </div>
                  </div>
                </Card>

                {/* 2. Credit Check */}
                <Card className={clsx("border-l-4 shadow-soft transition-all duration-500", 
                   isCreditChecking ? "border-bt-indigo bg-indigo-50/50 dark:bg-indigo-900/10" : "border-bt-success"
                )}>
                  <div className="flex items-start">
                    <div className={clsx("p-2 rounded-full mr-4", 
                       isCreditChecking ? "bg-indigo-100 text-bt-indigo dark:bg-indigo-900/50 dark:text-bt-indigoLight" : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                    )}>
                      {isCreditChecking ? (
                         <ArrowPathIconSpin className="h-6 w-6" />
                      ) : (
                         <CheckCircleIcon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-between">
                         Credit Bureau Check
                         {isCreditChecking && <span className="text-xs font-bold text-bt-indigo dark:text-bt-indigoLight uppercase animate-pulse">In Progress...</span>}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Verifying financial profile with UK Credit Bureau.</p>
                      {isCreditChecking && (
                         <div className="mt-4 p-3 bg-white dark:bg-bt-darkCard rounded-lg border border-indigo-100 dark:border-slate-700 text-xs text-gray-500 dark:text-slate-400 font-mono">
                           > Connecting to Equifax/Experian API...<br/>
                           > Retrieving credit score for {selectedQuote.customerName}...<br/>
                           > Assessing risk factors...
                         </div>
                      )}
                      {!isCreditChecking && (
                         <span className="inline-block mt-2 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-400">Approved</span>
                      )}
                    </div>
                  </div>
                </Card>

                {/* 3. Site Check */}
                <Card className={clsx("border-l-4 shadow-soft transition-all duration-500", 
                   isSiteChecking ? "border-bt-indigo bg-indigo-50/50 dark:bg-indigo-900/10" : isCreditChecking ? "border-gray-200 opacity-60" : "border-bt-success"
                )}>
                  <div className="flex items-start">
                     <div className={clsx("p-2 rounded-full mr-4", 
                       isSiteChecking ? "bg-indigo-100 text-bt-indigo dark:bg-indigo-900/50 dark:text-bt-indigoLight" : "bg-gray-100 text-gray-400 dark:bg-slate-800"
                    )}>
                      {isSiteChecking ? <ArrowPathIconSpin className="h-6 w-6" /> : <SignalIcon className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-between">
                        Openreach Serviceability Check
                         {isSiteChecking && <span className="text-xs font-bold text-bt-indigo dark:text-bt-indigoLight uppercase animate-pulse">In Progress...</span>}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Checking fibre availability at <span className="font-semibold">{selectedQuote.site}</span>.</p>
                       {isSiteChecking && (
                         <div className="mt-4 p-3 bg-white dark:bg-bt-darkCard rounded-lg border border-indigo-100 dark:border-slate-700 text-xs text-gray-500 dark:text-slate-400 font-mono">
                           > Querying Openreach Infrastructure Database...<br/>
                           > Validating NAD key for address...<br/>
                           > Checking exchange capacity...
                         </div>
                      )}
                    </div>
                  </div>
                </Card>
             </div>
          </div>
        </div>
      );
    }

    // Default Details View
    const quoteSubtotal = selectedQuote.items.reduce((acc, curr) => acc + curr.totalCost, 0);
    const quoteTax = quoteSubtotal * 0.20;
    const quoteTotal = quoteSubtotal + quoteTax;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="pl-0 text-gray-500 hover:text-bt-indigo dark:text-slate-400 transition-colors" onClick={() => setSelectedQuoteId(null)}>
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Quotes
          </Button>
          <div className="flex space-x-3">
            <Button variant="secondary" size="sm">
              <PrinterIcon className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button variant="secondary" size="sm">
              <ShareIcon className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <h1 className="text-4xl font-extrabold text-bt-text dark:text-white tracking-tight mb-2 flex items-center gap-3">
               Quote {selectedQuote.id}
               <StatusChip status={selectedQuote.status} />
             </h1>
             <p className="text-gray-500 dark:text-slate-400 text-lg">Sales configuration for <span className="text-bt-indigo dark:text-bt-indigoLight font-semibold">{selectedQuote.site}</span></p>
          </div>
          {selectedQuote.status === 'Approved' && (
            <div className="flex flex-col items-end">
               <span className="text-sm text-gray-500 mb-1">Checks passed. Order creating...</span>
               <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 animate-pulse w-full"></div>
               </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card noPadding className="border-0 shadow-soft">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Line Items</h3>
                <span className="text-xs font-bold text-gray-400">{selectedQuote.items.length} Products</span>
              </div>
              <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
                <thead className="bg-gray-50/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity</th>
                    <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Price</th>
                    <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-bt-darkCard divide-y divide-gray-50 dark:divide-slate-800">
                  {selectedQuote.items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-bt-text dark:text-white">{item.productName}</div>
                        <div className="text-[10px] text-gray-400 font-medium">SKU: {item.productId}</div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-sm text-bt-text dark:text-slate-300">£{item.unitCost.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-bt-text dark:text-white">£{item.totalCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <div className="flex justify-end">
              <Card className="w-full max-w-sm border-0 shadow-soft bg-bt-indigo text-white">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium opacity-80">
                    <span>Subtotal</span>
                    <span>£{quoteSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium opacity-80">
                    <span>VAT (20%)</span>
                    <span>£{quoteTax.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-white/20 flex justify-between items-baseline">
                    <span className="text-lg font-bold">Total Quote Value</span>
                    <span className="text-2xl font-extrabold tracking-tight">£{quoteTotal.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-soft">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Quote Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Customer</label>
                  <p className="text-sm font-bold text-bt-text dark:text-slate-200">{selectedQuote.customerName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Delivery Site</label>
                  <p className="text-sm font-bold text-bt-text dark:text-slate-200">{selectedQuote.site}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Date Created</label>
                  <p className="text-sm font-bold text-bt-text dark:text-slate-200">{selectedQuote.createdDate}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Owner</label>
                  <p className="text-sm font-bold text-bt-text dark:text-slate-200">{selectedQuote.owner}</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-soft bg-gray-50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold text-bt-indigo dark:text-bt-indigoLight uppercase tracking-widest mb-3 flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-2" /> Notes
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 italic leading-relaxed">
                "Special instructions for on-site delivery. Please call 24 hours prior to hardware arrival."
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-bt-text dark:text-white tracking-tight">Quotes</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Configure and manage sales quotations.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-indigo-100">
          <PlusIcon className="h-5 w-5 mr-2 stroke-[3]"/> Create New Quote
        </Button>
      </div>

      <Card noPadding className="shadow-soft border-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
            <thead className="bg-gray-50/50 dark:bg-slate-800/50">
              <tr>
                {['Quote ID', 'Customer', 'Site', 'Created', 'Value', 'Status', 'Owner', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-bt-darkCard divide-y divide-gray-50 dark:divide-slate-800">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-400 font-medium">
                    No quotes found.
                  </td>
                </tr>
              ) : filteredQuotes.map(q => (
                <tr 
                  key={q.id} 
                  className="hover:bg-indigo-50/30 dark:hover:bg-slate-800 transition-all cursor-pointer group"
                  onClick={() => setSelectedQuoteId(q.id)}
                >
                  <td className="px-6 py-5 whitespace-nowrap font-bold text-bt-indigo dark:text-bt-indigoLight group-hover:underline">{q.id}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-bt-text dark:text-slate-200">{q.customerName}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 font-medium">{q.site}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400 font-medium">{q.createdDate}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-bt-text dark:text-slate-100">£{q.value.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-5 whitespace-nowrap"><StatusChip status={q.status} /></td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium dark:text-slate-400">{q.owner}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <button 
                      className="text-bt-indigo dark:text-bt-indigoLight hover:text-bt-indigoHover font-bold text-xs uppercase tracking-wider"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuoteId(q.id);
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            
            <div className={clsx(
              "relative bg-white dark:bg-bt-darkCard rounded-2xl shadow-2xl transform transition-all w-full animate-in zoom-in-95 duration-200",
              modalStep === 'form' ? "max-w-3xl" : "max-w-2xl"
            )}>
              <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-bt-indigo rounded-t-2xl text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {modalStep === 'form' ? 'Create New Quote' : 'Quote Summary'}
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                  <PlusIcon className="h-7 w-7 rotate-45" />
                </button>
              </div>

              <div className="p-6 lg:p-8">
                {modalStep === 'form' ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input 
                        label="Customer Name" 
                        value={customerName} 
                        onChange={e => setCustomerName(e.target.value)} 
                        placeholder="e.g. Acme Corp" 
                      />
                      <Select 
                        label="Delivery Site" 
                        value={selectedSiteId} 
                        onChange={e => setSelectedSiteId(e.target.value)}
                        options={[{label: 'Select Site...', value: ''}, ...sites.map(s => ({label: s.name, value: s.id}))]} 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                         <h4 className="text-sm font-bold text-bt-text dark:text-slate-300 uppercase tracking-widest">Line Items</h4>
                         <span className="text-xs text-gray-400 font-medium">{lineItems.length} items added</span>
                      </div>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                         {lineItems.map((item, idx) => (
                           <div key={idx} className="flex gap-4 items-end bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700 relative group transition-all hover:bg-white dark:hover:bg-slate-800 hover:border-bt-indigo/20 hover:shadow-sm">
                              <div className="flex-grow">
                                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 block">Product</label>
                                <Select 
                                   className="!py-2.5"
                                   value={item.productId}
                                   onChange={(e) => handleUpdateLine(idx, 'productId', e.target.value)}
                                   options={[{label: 'Select Product...', value: ''}, ...products.map(p => ({label: `${p.name} (£${p.unitCost})`, value: p.id}))]}
                                />
                              </div>
                              <div className="w-24">
                                 <Input 
                                   label="Qty" 
                                   type="number" 
                                   min={1} 
                                   className="!py-2.5"
                                   value={item.qty} 
                                   onChange={(e) => handleUpdateLine(idx, 'qty', parseInt(e.target.value))}
                                 />
                              </div>
                              <button 
                                onClick={() => handleRemoveLine(idx)}
                                className="p-2 text-gray-300 hover:text-bt-error transition-colors bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-slate-800 mb-0.5"
                                title="Remove item"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                           </div>
                         ))}
                      </div>
                      <button 
                        type="button" 
                        onClick={handleAddLine}
                        className="mt-4 flex items-center text-bt-indigo dark:text-bt-indigoLight font-bold text-sm hover:underline py-2 px-1"
                      >
                        <PlusIcon className="h-5 w-5 mr-1 stroke-[3]"/> Add Another Product
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center space-x-4 bg-green-50 dark:bg-green-900/30 p-4 rounded-xl border border-green-100 dark:border-green-800">
                      <div className="p-2 bg-bt-success rounded-full text-white">
                        <CheckCircleIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-green-800 dark:text-green-400">Review & Confirm</h4>
                        <p className="text-xs text-green-700 dark:text-green-500">Please verify the quote details below before final submission.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-4 border-b border-gray-100 dark:border-slate-800">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                        <p className="text-lg font-bold text-bt-text dark:text-white">{customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Site</p>
                        <p className="text-lg font-bold text-bt-text dark:text-white">{sites.find(s => s.id === selectedSiteId)?.name}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Itemized Summary</p>
                      <div className="bg-gray-50 dark:bg-slate-800/30 rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-sm">
                          <thead className="bg-gray-100/50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-4 py-3 text-left font-bold text-gray-600 dark:text-slate-300">Product</th>
                              <th className="px-4 py-3 text-center font-bold text-gray-600 dark:text-slate-300">Qty</th>
                              <th className="px-4 py-3 text-right font-bold text-gray-600 dark:text-slate-300">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {finalItems.map(item => (
                              <tr key={item.id} className="bg-white dark:bg-transparent">
                                <td className="px-4 py-3 font-medium text-bt-text dark:text-slate-200">{item.productName}</td>
                                <td className="px-4 py-3 text-center text-gray-500 font-bold">{item.quantity}</td>
                                <td className="px-4 py-3 text-right font-bold text-bt-text dark:text-white">£{item.totalCost.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50/80 dark:bg-slate-900/80 font-bold">
                            <tr>
                              <td colSpan={2} className="px-4 py-2 text-right text-gray-500 dark:text-slate-400">Subtotal</td>
                              <td className="px-4 py-2 text-right text-bt-text dark:text-slate-200">£{subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td colSpan={2} className="px-4 py-2 text-right text-gray-500 dark:text-slate-400">VAT (20%)</td>
                              <td className="px-4 py-2 text-right text-bt-text dark:text-slate-200">£{tax.toFixed(2)}</td>
                            </tr>
                            <tr className="bg-bt-indigo text-white">
                              <td colSpan={2} className="px-4 py-3 text-right text-lg">Total Quote Value</td>
                              <td className="px-4 py-3 text-right text-lg">£{total.toFixed(2)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 lg:p-8 bg-gray-50 dark:bg-slate-900 rounded-b-2xl border-t border-gray-100 dark:border-slate-800 flex justify-between">
                {modalStep === 'form' ? (
                  <>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button 
                      variant="primary" 
                      disabled={!isFormValid}
                      onClick={() => setModalStep('summary')}
                      className="px-10"
                    >
                      Review Quote <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </Button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setModalStep('form')}
                      className="flex items-center text-gray-500 dark:text-slate-400 font-bold hover:text-bt-indigo transition-colors"
                    >
                      <ChevronLeftIcon className="h-5 w-5 mr-1" /> Back to Edit
                    </button>
                    <Button 
                      variant="primary" 
                      onClick={handleCreateQuote}
                      className="px-10 shadow-lg"
                    >
                      Confirm & Submit Quote
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const ArrowPathIconSpin = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className} style={{animation: 'spin 1s linear infinite'}}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>
)
