import React from 'react';
import { clsx } from 'clsx';

// --- BUTTONS ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'pink' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', fullWidth = false, className, ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";
  
  const variants = {
    primary: "bg-bt-indigo text-white hover:bg-bt-indigoHover hover:shadow-md focus:ring-bt-indigo border border-bt-indigo dark:border-bt-indigoLight",
    secondary: "bg-white text-bt-indigo border border-gray-200 hover:bg-indigo-50 hover:border-bt-indigo focus:ring-bt-indigo shadow-sm dark:bg-bt-darkCard dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800",
    pink: "bg-bt-indigo text-white hover:bg-bt-indigoHover hover:shadow-md focus:ring-bt-indigo",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-none focus:ring-gray-300 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
    danger: "bg-white text-bt-error border border-bt-error hover:bg-red-50 focus:ring-bt-error dark:bg-slate-900",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button 
      className={clsx(baseStyles, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
};

// --- CARD ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; noPadding?: boolean }> = ({ children, className, noPadding = false }) => (
  <div className={clsx("bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden dark:bg-bt-darkCard dark:border-slate-800", className)}>
    <div className={clsx(!noPadding && "p-6")}>
      {children}
    </div>
  </div>
);

// --- CHIP ---
export const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  let colorClass = "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  
  switch (status.toLowerCase()) {
    case 'approved':
    case 'active':
    case 'paid':
    case 'resolved':
    case 'open':
    case 'closed':
    case 'completed':
    case 'converted':
    case 'job done':
      colorClass = "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      break;
    case 'draft':
    case 'pending':
    case 'processing':
    case 'new':
    case 'submitted':
    case 'checking credit':
    case 'checking site':
      colorClass = "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      break;
    case 'awaiting approval':
    case 'awaiting supplier approval':
    case 'awaiting customer approval':
    case 'survey':
    case 'engineer scheduled':
    case 'installation':
    case 'part-paid':
    case 'in progress':
    case 'inventory check':
    case 'field agent assign':
    case 'infra procurement':
      colorClass = "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      break;
    case 'expired':
    case 'cancelled':
    case 'overdue':
    case 'suspended':
    case 'critical':
      colorClass = "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      break;
  }

  return (
    <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-tighter", colorClass)}>
      {status}
    </span>
  );
};

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-slate-300">{label}</label>}
    <input
      className={clsx(
        "block w-full rounded-lg border-gray-300 shadow-sm focus:border-bt-indigo focus:ring-bt-indigo sm:text-sm px-4 py-3 border bg-white text-gray-900 transition-all placeholder:text-gray-400 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-gray-500",
        error ? "border-bt-error focus:border-bt-error focus:ring-bt-error" : "hover:border-bt-indigo/40 focus:ring-2",
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-bt-error font-medium">{error}</p>}
  </div>
);

// --- SELECT ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-slate-300">{label}</label>}
    <div className="relative">
      <select
        className={clsx(
          "block w-full rounded-lg border-gray-300 shadow-sm focus:border-bt-indigo focus:ring-bt-indigo sm:text-sm px-4 py-3 border bg-white text-gray-900 cursor-pointer appearance-none transition-all outline-none hover:border-bt-indigo/40 focus:ring-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:border-bt-indigo",
          className
        )}
        {...props}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);
