import React, { useState } from 'react';
import { Button, Card, StatusChip } from '../components/ui';
import { Order } from '../types';
import { clsx } from 'clsx';
import { 
  ArrowLeftIcon, CheckIcon, ClockIcon, ClipboardDocumentCheckIcon, 
  CalendarDaysIcon, InformationCircleIcon, MapPinIcon, DevicePhoneMobileIcon,
  ShieldCheckIcon, WrenchScrewdriverIcon, RocketLaunchIcon,
  MagnifyingGlassIcon, UserIcon, TruckIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

interface OrdersPageProps {
  orders: Order[];
  searchQuery?: string;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ orders, searchQuery = '' }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const filters = [
    { name: 'All', label: 'All Orders' },
    { name: 'Processing', label: 'Processing' },
    { name: 'Action Required', label: 'Action Required' },
    { name: 'Completed', label: 'Completed' }
  ];

  const filteredOrders = orders.filter(o => {
    let matchesFilter = true;
    if (activeFilter === 'Processing') matchesFilter = ['Submitted', 'Processing', 'Inventory check', 'Field agent assign', 'Infra procurement', 'Installation', 'Job done'].includes(o.status);
    else if (activeFilter === 'Action Required') matchesFilter = ['Draft'].includes(o.status);
    else if (activeFilter === 'Completed') matchesFilter = ['Active', 'Closed', 'Cancelled'].includes(o.status);
    
    if (!matchesFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.site.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q) ||
        o.items.some(item => item.toLowerCase().includes(q))
      );
    }

    return true;
  });

  if (selectedOrder) {
    const steps = [
      { name: 'Submitted', label: 'Verification', icon: ClipboardDocumentCheckIcon },
      { name: 'Processing', label: 'Processing', icon: ShieldCheckIcon },
      { name: 'Inventory check', label: 'Inventory', icon: MagnifyingGlassIcon },
      { name: 'Field agent assign', label: 'Agent Assign', icon: UserIcon },
      { name: 'Infra procurement', label: 'Procurement', icon: TruckIcon },
      { name: 'Installation', label: 'Setup', icon: WrenchScrewdriverIcon },
      { name: 'Job done', label: 'Done', icon: CheckCircleIcon },
      { name: 'Active', label: 'Activated', icon: RocketLaunchIcon },
    ];
    
    const stepNames = steps.map(s => s.name);
    const currentStepIndex = stepNames.indexOf(selectedOrder.status);

    const getStageDescription = (status: string) => {
      switch (status) {
        case 'Inventory check':
          return "Contacting Openreach for inventory status...";
        case 'Field agent assign':
          return "Contacting Openreach for field agent assignment and availability.";
        case 'Infra procurement':
          return "Liaising with Openreach for necessary infrastructure and hardware procurement.";
        case 'Installation':
          return "Field agent is currently on-site. The agent will upload photos and installation details shortly. Contact Openreach for live status updates.";
        case 'Job done':
          return "Field work is complete. Our team is now performing final end-to-end testing before activation.";
        case 'Active':
          return "Great news! Your service is fully operational and activated. You can now manage your features in the Dashboard.";
        case 'Submitted':
          return "Order successfully submitted. We are verifying details and validating your requirements.";
        case 'Processing':
          return "Backend network configuration and system allocation is in progress.";
        default:
          return "Our team is currently finalizing the requirements for this stage. No action is required from you at this time.";
      }
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="pl-0 text-gray-500 dark:text-slate-400 hover:text-bt-indigo transition-colors" onClick={() => setSelectedOrderId(null)}>
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Orders
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 uppercase tracking-widest dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
              Live Tracker
            </span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <h1 className="text-4xl font-extrabold text-bt-text dark:text-white tracking-tight mb-2 flex items-center gap-3">
               Order {selectedOrder.id}
               <StatusChip status={selectedOrder.status === 'Active' ? 'Activated' : selectedOrder.status} />
             </h1>
             <p className="text-gray-500 dark:text-slate-400 text-lg">Detailed progress for your service activation at <span className="text-bt-indigo dark:text-bt-indigoLight font-semibold">{selectedOrder.site}</span></p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary">View PDF Quote</Button>
            <Button variant="primary" className="shadow-lg shadow-indigo-100 dark:shadow-none">Contact Support</Button>
          </div>
        </div>

        {/* Tracker Card */}
        <Card className="overflow-hidden border-0 shadow-soft">
          <div className="bg-gradient-to-r from-bt-indigo/5 to-transparent dark:from-bt-indigo/20 p-1 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between px-5 py-2">
               <span className="text-xs font-bold text-bt-indigo dark:text-bt-indigoLight uppercase tracking-wider">Estimated Activation: Soon</span>
               <span className="text-xs text-gray-400">Order ID: {selectedOrder.id}</span>
            </div>
          </div>
          <div className="p-8 lg:p-12">
            <div className="relative">
              <div className="absolute top-5 left-0 w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full z-0" />
              <div 
                 className="absolute top-5 left-0 h-1.5 bg-bt-success rounded-full z-0 transition-all duration-1000 ease-in-out shadow-[0_0_12px_rgba(0,138,0,0.3)]"
                 style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }} 
              />
              
              <div className="relative z-10 flex justify-between w-full">
                {steps.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const isFuture = idx > currentStepIndex;
                  
                  return (
                    <div key={step.name} className="flex flex-col items-center group">
                      <div className={clsx(
                        "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-700 relative",
                        isCompleted ? "bg-bt-success border-bt-success text-white scale-100" : 
                        isCurrent ? "bg-white dark:bg-bt-darkCard border-bt-success text-bt-success scale-110 shadow-lg ring-4 ring-green-100 dark:ring-green-900/30" : 
                        "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-300 dark:text-slate-600"
                      )}>
                        {isCompleted ? <CheckIcon className="h-5 w-5 md:h-6 md:w-6 stroke-[3]" /> : 
                         isCurrent ? (
                           <>
                             <div className="absolute inset-0 rounded-full bg-bt-success/20 animate-ping" />
                             <step.icon className="h-5 w-5 md:h-6 md:w-6 relative z-10" />
                           </>
                         ) : <step.icon className="h-4 w-4 md:h-5 md:w-5" />}
                      </div>
                      <div className="mt-4 text-center">
                        <p className={clsx(
                          "text-[10px] md:text-xs font-bold tracking-tight transition-colors duration-300",
                          isFuture ? "text-gray-300 dark:text-slate-600" : "text-bt-text dark:text-white"
                        )}>{step.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-12">
              <div className="bg-indigo-50/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-indigo-100 dark:border-slate-800 flex items-start space-x-4">
                <div className="bg-white dark:bg-bt-darkCard p-3 rounded-xl shadow-sm text-bt-indigo dark:text-bt-indigoLight">
                  <InformationCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-bt-indigo dark:text-bt-indigoLight mb-1">Current Stage: {selectedOrder.status}</h4>
                  <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {getStageDescription(selectedOrder.status)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-900 text-bt-indigo dark:text-bt-indigoLight border border-indigo-100 dark:border-slate-800 shadow-sm">
                      <ClockIcon className="h-3 w-3 mr-1" /> Est. Time: Variable
                    </span>
                    {selectedOrder.status === 'Field agent assign' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-900 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800 shadow-sm">
                        <UserIcon className="h-3 w-3 mr-1" /> Openreach Liaison
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <Card className="md:col-span-1 h-full">
             <div className="flex items-center space-x-2 mb-6 border-b border-gray-50 dark:border-slate-800 pb-4">
               <ClipboardDocumentCheckIcon className="h-5 w-5 text-bt-indigo dark:text-bt-indigoLight" />
               <h3 className="text-lg font-bold text-bt-text dark:text-white">Order Items</h3>
             </div>
             <ul className="space-y-3">
               {selectedOrder.items.map((item, i) => (
                 <li key={i} className="flex items-center text-sm p-4 bg-gray-50 dark:bg-slate-800/30 rounded-xl border border-gray-100 dark:border-slate-800 group hover:border-bt-indigo transition-colors cursor-default">
                   <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center mr-3 text-bt-indigo dark:text-bt-indigoLight shadow-sm group-hover:bg-bt-indigo group-hover:text-white transition-all">
                     <DevicePhoneMobileIcon className="h-4 w-4" />
                   </div>
                   <span className="font-semibold text-bt-text dark:text-slate-200">{item}</span>
                 </li>
               ))}
             </ul>
           </Card>
           
           <Card className="md:col-span-2 h-full">
             <div className="flex items-center space-x-2 mb-6 border-b border-gray-50 dark:border-slate-800 pb-4">
               <ClockIcon className="h-5 w-5 text-bt-indigo dark:text-bt-indigoLight" />
               <h3 className="text-lg font-bold text-bt-text dark:text-white">Recent Activity</h3>
             </div>
             <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-bt-indigo/50 before:via-bt-indigo/20 before:to-transparent">
                <div className="relative flex items-center justify-between group">
                   <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-bt-indigo text-white shadow-md z-10 transition-transform group-hover:scale-110">
                         <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      </div>
                      <div className="ml-6">
                         <h4 className="text-sm font-bold text-gray-900 dark:text-slate-200">Status Updated</h4>
                         <p className="text-xs text-gray-500 dark:text-slate-400">Order moved to {selectedOrder.status}</p>
                      </div>
                   </div>
                   <span className="text-xs font-medium text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded">Just now</span>
                </div>
                
                <div className="relative flex items-center justify-between group">
                   <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-bt-success text-white shadow-sm z-10 transition-transform group-hover:scale-110">
                         <CheckIcon className="h-4 w-4" />
                      </div>
                      <div className="ml-6">
                         <h4 className="text-sm font-bold text-gray-900 dark:text-slate-200">Processing Initiated</h4>
                         <p className="text-xs text-gray-500 dark:text-slate-400">Liaison with Openreach for network setup started.</p>
                      </div>
                   </div>
                   <span className="text-xs font-medium text-gray-400">Earlier today</span>
                </div>
             </div>
           </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-bt-text dark:text-white tracking-tight">Orders</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Track and manage your service activations.</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
           <Button variant="secondary" className="flex-1 sm:flex-none">Export CSV</Button>
           <Button variant="primary" className="flex-1 sm:flex-none shadow-lg shadow-indigo-100 dark:shadow-none">New Order</Button>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f.name}
            onClick={() => setActiveFilter(f.name)}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all border shrink-0",
              activeFilter === f.name 
                ? "bg-bt-indigo text-white border-bt-indigo shadow-md dark:shadow-none" 
                : "bg-white text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-800 hover:border-bt-indigo/30 hover:bg-gray-50 dark:hover:bg-slate-800"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card noPadding className="overflow-hidden border-0 shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
            <thead className="bg-gray-50/50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Site</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submitted</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-bt-darkCard divide-y divide-gray-50 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                 <tr><td colSpan={6} className="px-6 py-20 text-center flex flex-col items-center justify-center text-gray-400">
                   No orders found.
                 </td></tr>
              ) : filteredOrders.map(o => (
                <tr 
                  key={o.id} 
                  className="hover:bg-indigo-50/30 dark:hover:bg-slate-800 cursor-pointer transition-all group" 
                  onClick={() => setSelectedOrderId(o.id)}
                >
                  <td className="px-6 py-5 font-bold text-bt-indigo dark:text-bt-indigoLight group-hover:translate-x-1 transition-transform">{o.id}</td>
                  <td className="px-6 py-5"><StatusChip status={o.status === 'Active' ? 'Activated' : o.status} /></td>
                  <td className="px-6 py-5 text-sm font-semibold text-bt-text dark:text-slate-200">{o.items.slice(0, 1).join(', ')}{o.items.length > 1 && ` +${o.items.length - 1} more`}</td>
                  <td className="px-6 py-5 text-sm text-gray-500 dark:text-slate-400 font-medium">{o.site}</td>
                  <td className="px-6 py-5 text-sm text-gray-400 font-medium">{o.submittedDate}</td>
                  <td className="px-6 py-5 text-right">
                     <span className="text-xs text-bt-indigo dark:text-bt-indigoLight font-bold">Track Status →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};