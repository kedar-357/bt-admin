
import React from 'react';
import { clsx } from 'clsx';
import { Card, Button, StatusChip } from '../components/ui';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowPathIcon, DocumentArrowDownIcon, BoltIcon, 
  MapPinIcon, CheckCircleIcon, ClockIcon, 
  SignalIcon, ShieldCheckIcon, ChartBarIcon, 
  ArrowTrendingUpIcon, ChevronRightIcon,
  LifebuoyIcon
} from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const spendData = [
    { name: 'Jan', spend: 4200, usage: 2400 },
    { name: 'Feb', spend: 3800, usage: 2100 },
    { name: 'Mar', spend: 5100, usage: 2900 },
    { name: 'Apr', spend: 4900, usage: 3200 },
    { name: 'May', spend: 5400, usage: 3800 },
    { name: 'Jun', spend: 5800, usage: 4100 },
  ];

  const siteStatus = [
    { name: 'LDN-HQ', status: 'Online', latency: '12ms', type: 'Fibre 900' },
    { name: 'MAN-BR', status: 'Online', latency: '24ms', type: 'Fibre 300' },
    { name: 'LD-WHS', status: 'Warning', latency: '145ms', type: 'Leased Line' },
    { name: 'GLA-OF', status: 'Online', latency: '31ms', type: 'Fibre 900' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Welcome Hero - High Contrast BT Branding */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bt-pattern min-h-[220px] flex items-center px-8 lg:px-12 text-white border border-white/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-md mb-4 border border-white/20">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">System Status: Optimal</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">Good morning, Alice</h1>
          <p className="text-bt-bg/80 text-lg font-medium leading-relaxed">
            Your network usage is up <span className="text-green-400 font-bold">8.4%</span> this week. <br className="hidden lg:block"/>
            Everything at <span className="underline decoration-bt-blue/40">London HQ</span> is running perfectly.
          </p>
        </div>
        
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-bt-blue/20 to-transparent flex items-center justify-end pr-12 opacity-50 lg:opacity-100">
          <BoltIcon className="h-48 w-48 text-white/10 rotate-12" />
        </div>
      </div>

      {/* KPI Cards Grid - Adjusted to lg:grid-cols-3 after removing Network Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total Spend (YTD)', value: '£12,450.00', trend: '+12.5%', color: 'indigo', icon: ChartBarIcon },
          { label: 'Active Services', value: '14', trend: 'Healthy', color: 'blue', icon: SignalIcon },
          { label: 'Unpaid Invoices', value: '£1,250.00', trend: '2 Pending', color: 'warning', icon: DocumentArrowDownIcon },
        ].map((kpi, idx) => (
          <Card key={idx} className="relative group hover:shadow-xl transition-all duration-300 border-0 shadow-soft overflow-hidden">
             <div className={clsx(
               "absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity",
               kpi.color === 'indigo' ? "text-bt-indigo" : kpi.color === 'blue' ? "text-bt-blue" : "text-bt-warning"
             )}>
                <kpi.icon className="h-16 w-16" />
             </div>
             <div className="relative z-10">
               <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
               <div className="flex items-baseline space-x-2">
                 <h2 className="text-3xl font-extrabold text-bt-text dark:text-white tracking-tighter">{kpi.value}</h2>
                 <span className={clsx(
                   "text-[10px] font-bold px-1.5 py-0.5 rounded",
                   kpi.trend.includes('+') ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-bt-indigo/5 text-bt-indigo dark:bg-bt-indigo/20 dark:text-bt-indigoLight"
                 )}>
                   {kpi.trend}
                 </span>
               </div>
               <div className="mt-4 flex items-center text-xs font-medium text-gray-400 dark:text-slate-500 group-hover:text-bt-indigo transition-colors cursor-pointer">
                 View Breakdown <ChevronRightIcon className="h-3 w-3 ml-1" />
               </div>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analytics Section */}
        <Card className="lg:col-span-2 border-0 shadow-soft">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-extrabold text-bt-text dark:text-white">Spend & Usage Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Monthly performance overview</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-xs font-bold bg-bt-indigo text-white rounded-lg shadow-sm">6 Months</button>
              <button className="px-3 py-1.5 text-xs font-bold bg-white text-gray-500 rounded-lg hover:bg-gray-50 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">1 Year</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5514B4" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#5514B4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A0D6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00A0D6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} 
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#fff'}}
                  itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                  cursor={{stroke: '#5514B4', strokeWidth: 1}}
                />
                <Area type="monotone" dataKey="spend" stroke="#5514B4" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                <Area type="monotone" dataKey="usage" stroke="#00A0D6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
             <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-bt-indigo mr-2" />
                  <span className="text-xs font-bold text-gray-600 dark:text-slate-400">Spend (£)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-bt-blue mr-2" />
                  <span className="text-xs font-bold text-gray-600 dark:text-slate-400">Usage (TB)</span>
                </div>
             </div>
             <div className="flex items-center text-xs font-bold text-green-600 dark:text-green-400">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> Over budget by 2%
             </div>
          </div>
        </Card>

        {/* Site Health / Connectivity Grid */}
        <Card className="border-0 shadow-soft flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold text-bt-text dark:text-white">Site Health</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded dark:bg-green-900/30 dark:text-green-400">Live</span>
          </div>
          <div className="flex-1 space-y-4">
            {siteStatus.map((site, i) => (
              <div key={i} className="group p-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/30 hover:border-bt-indigo/20 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={clsx(
                      "h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-sm",
                      site.status === 'Online' ? "bg-bt-success" : "bg-bt-warning"
                    )}>
                      <MapPinIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-bt-text dark:text-slate-200 leading-none mb-1">{site.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{site.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={clsx(
                      "text-xs font-bold mb-0.5",
                      site.status === 'Online' ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                    )}>{site.status}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{site.latency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" fullWidth className="mt-6 border-dashed">Manage All Sites</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Active Orders Timeline */}
         <Card className="border-0 shadow-soft">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50 dark:border-slate-800">
              <h3 className="text-xl font-extrabold text-bt-text dark:text-white">Active Orders</h3>
              <ClockIcon className="h-5 w-5 text-gray-300" />
            </div>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-bt-indigo/40 before:to-transparent">
               {[
                 { id: 'ORD-8892', status: 'Processing', time: 'Est: 2 days', site: 'London Main' },
                 { id: 'ORD-8899', status: 'Engineer Scheduled', time: 'Nov 05, 09:00', site: 'Leeds Whs' },
               ].map((order, i) => (
                 <div key={i} className="relative flex items-start group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-bt-indigo text-white shadow-sm z-10 transition-transform group-hover:scale-110">
                       <ArrowPathIcon className={clsx("h-5 w-5", order.status === 'Processing' && "animate-spin-slow")} />
                    </div>
                    <div className="ml-5">
                       <p className="text-sm font-bold text-bt-text dark:text-slate-200 leading-none mb-1">{order.id} - <span className="text-bt-indigo dark:text-bt-indigoLight">{order.status}</span></p>
                       <p className="text-xs text-gray-500 mb-2 font-medium">{order.site}</p>
                       <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-bt-indigo dark:bg-bt-indigo/20 dark:text-bt-indigoLight rounded uppercase tracking-wider">
                         {order.time}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
            <Button variant="ghost" fullWidth className="mt-8 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-bt-indigo">
              View Order History
            </Button>
         </Card>

         <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-soft flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer group dark:bg-gradient-to-br dark:from-bt-darkCard dark:to-slate-900">
               <div className="h-12 w-12 rounded-2xl bg-bt-blue/10 text-bt-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <DocumentArrowDownIcon className="h-6 w-6" />
               </div>
               <div>
                  <h4 className="text-lg font-extrabold text-bt-text dark:text-white mb-1">Download Bills</h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Access your latest invoices and payment history instantly.</p>
               </div>
            </Card>

            <Card className="border-0 shadow-soft flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer group dark:bg-gradient-to-br dark:from-bt-darkCard dark:to-slate-900">
               <div className="h-12 w-12 rounded-2xl bg-bt-indigo/10 text-bt-indigo flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <LifebuoyIcon className="h-6 w-6" />
               </div>
               <div>
                  <h4 className="text-lg font-extrabold text-bt-text dark:text-white mb-1">Help & Support</h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Chat with our team or raise a fault report for any site.</p>
               </div>
            </Card>

            <div className="md:col-span-2 p-6 rounded-3xl bg-bt-indigo flex items-center justify-between text-white shadow-xl dark:shadow-none">
               <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <ArrowPathIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Renew Service</h4>
                    <p className="text-xs text-white/70">London HQ Fibre 900 contract expires in 45 days.</p>
                  </div>
               </div>
               <Button className="bg-white !text-bt-indigo hover:bg-white/90">View Offer</Button>
            </div>
         </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
