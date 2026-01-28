import React, { useState } from 'react';
import { Button, Card, Input, StatusChip } from '../components/ui';
import { Site } from '../types';
import { 
  PlusIcon, MapPinIcon, PencilIcon, TrashIcon, 
  ArrowLeftIcon, BuildingOffice2Icon, UserIcon,
  SignalIcon, ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface SitesPageProps {
  sites: Site[];
  setSites: React.Dispatch<React.SetStateAction<Site[]>>;
  searchQuery?: string;
}

export const SitesPage: React.FC<SitesPageProps> = ({ sites, setSites, searchQuery = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', contact: '' });

  const selectedSite = sites.find(s => s.id === selectedSiteId);

  const handleOpenModal = (site?: Site) => {
    if (site) {
      setEditingSite(site);
      setFormData({ name: site.name, address: site.address, contact: site.primaryContact });
    } else {
      setEditingSite(null);
      setFormData({ name: '', address: '', contact: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingSite) {
      setSites(prev => prev.map(s => s.id === editingSite.id ? { ...s, name: formData.name, address: formData.address, primaryContact: formData.contact } : s));
    } else {
      const newSite: Site = {
        id: `SITE-${Date.now()}`,
        name: formData.name,
        address: formData.address,
        primaryContact: formData.contact,
        servicesCount: 0
      };
      setSites(prev => [...prev, newSite]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this site?")) {
      setSites(prev => prev.filter(s => s.id !== id));
      if (selectedSiteId === id) setSelectedSiteId(null);
    }
  };

  const filteredSites = sites.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.primaryContact.toLowerCase().includes(q)
    );
  });

  if (selectedSite) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="pl-0 text-gray-500 dark:text-slate-400 hover:text-bt-indigo transition-colors" onClick={() => setSelectedSiteId(null)}>
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Sites
          </Button>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => handleOpenModal(selectedSite)}>
              <PencilIcon className="h-4 w-4 mr-2" /> Edit Site
            </Button>
            <Button variant="primary">Add Service to Site</Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <h1 className="text-4xl font-extrabold text-bt-text dark:text-white tracking-tight mb-2 flex items-center gap-3">
               {selectedSite.name}
               <StatusChip status="Active" />
             </h1>
             <p className="text-gray-500 dark:text-slate-400 text-lg flex items-center">
               <MapPinIcon className="h-5 w-5 mr-2 text-bt-indigo" />
               {selectedSite.address}
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-soft">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 border-b border-gray-50 dark:border-slate-800 pb-4">Active Services at this Site</h3>
              <div className="space-y-4">
                {[
                  { name: 'Business Fibre 900', provider: 'BT Business', speed: '900 Mbps', icon: SignalIcon },
                  { name: 'SD-WAN Gateway', provider: 'Cisco Meraki', speed: 'MX68 Appliance', icon: ShieldCheckIcon },
                ].map((svc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 hover:border-bt-indigo transition-all group">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-bt-indigo dark:text-bt-indigoLight shadow-sm group-hover:bg-bt-indigo group-hover:text-white transition-all">
                        <svc.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-bt-text dark:text-slate-200">{svc.name}</p>
                        <p className="text-xs text-gray-500">{svc.provider} • {svc.speed}</p>
                      </div>
                    </div>
                    <StatusChip status="Active" />
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-soft">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Site Manager</h4>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-bt-indigo/10 text-bt-indigo flex items-center justify-center font-bold">
                    {selectedSite.primaryContact.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-bt-text dark:text-slate-200">{selectedSite.primaryContact}</p>
                    <p className="text-xs text-gray-500">Primary Contact</p>
                  </div>
                </div>
              </Card>
              <Card className="border-0 shadow-soft">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-bt-indigo">{selectedSite.servicesCount}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Services</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">99.9%</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Uptime</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Card className="h-fit border-0 shadow-soft">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Recent Site Activity</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-bt-indigo/50 before:to-transparent">
              <div className="relative flex items-center justify-between pl-10">
                <div className="absolute left-0 h-8 w-8 rounded-full bg-bt-indigo text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                  <SignalIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-slate-200">Uptime Check Passed</p>
                  <p className="text-[10px] text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="relative flex items-center justify-between pl-10">
                <div className="absolute left-0 h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm z-10">
                  <PlusIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-slate-200">New Service Added</p>
                  <p className="text-[10px] text-gray-500">Last Week</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-bt-text dark:text-white tracking-tight">Sites</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage your business locations and their services.</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()} className="shadow-lg shadow-indigo-100">
          <PlusIcon className="h-5 w-5 mr-2 stroke-[3]"/> Add New Site
        </Button>
      </div>

      <Card noPadding className="overflow-hidden border-0 shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
            <thead className="bg-gray-50/50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Site Name</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Contact</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Services</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-bt-darkCard divide-y divide-gray-50 dark:divide-slate-800">
              {filteredSites.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-medium">No sites found.</td>
                </tr>
              ) : filteredSites.map(s => (
                <tr 
                  key={s.id} 
                  className="hover:bg-indigo-50/30 dark:hover:bg-slate-800 transition-all cursor-pointer group"
                  onClick={() => setSelectedSiteId(s.id)}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-bt-indigo/10 text-bt-indigo flex items-center justify-center mr-3 group-hover:bg-bt-indigo group-hover:text-white transition-all">
                        <BuildingOffice2Icon className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-bt-indigo dark:text-bt-indigoLight group-hover:underline">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-slate-400">
                    <div className="flex items-center"><MapPinIcon className="h-4 w-4 mr-2 text-gray-300"/>{s.address}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-slate-400">
                    <div className="flex items-center"><UserIcon className="h-4 w-4 mr-2 text-gray-300"/>{s.primaryContact}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                      {s.servicesCount} Active
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(s); }} 
                      className="text-gray-400 hover:text-bt-indigo dark:hover:text-bt-indigoLight p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all"
                    >
                      <PencilIcon className="h-5 w-5"/>
                    </button>
                    <button 
                      onClick={(e) => handleDelete(s.id, e)} 
                      className="text-gray-400 hover:text-bt-error p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all"
                    >
                      <TrashIcon className="h-5 w-5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative inline-block align-bottom bg-white dark:bg-bt-darkCard rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-lg sm:w-full animate-in zoom-in-95 duration-200">
              <div className="bg-bt-indigo px-6 py-4 flex justify-between items-center text-white">
                <h3 className="text-xl font-bold tracking-tight">{editingSite ? 'Edit Site' : 'Add New Site'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">
                  <PlusIcon className="h-7 w-7 rotate-45" />
                </button>
              </div>
              <div className="p-6 lg:p-8 space-y-6">
                <Input label="Site Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Manchester Branch" />
                <Input label="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Full address" />
                <Input label="Primary Contact" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="Contact Name" />
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                <Button variant="primary" className="px-8" onClick={handleSave}>Save Changes</Button>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};