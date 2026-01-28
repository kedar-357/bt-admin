import React, { useState } from 'react';
import { Button, Input } from '../components/ui';
import { clsx } from 'clsx';

export const AuthPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [step, setStep] = useState<'login' | 'register'>('login');
  const [regStep, setRegStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-bt-darkBg flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in duration-700">
         <div className="flex justify-center items-center space-x-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-bt-indigo text-white flex items-center justify-center shadow-lg transform -rotate-3">
              <div className="h-10 w-10 rounded-full bg-white text-bt-indigo flex items-center justify-center shadow-inner">
                <span className="font-bold text-lg leading-none tracking-tighter">BT</span>
              </div>
            </div>
            <span className="text-4xl font-bold tracking-tight text-bt-indigo dark:text-white antialiased">Business</span>
         </div>
         <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
           {step === 'login' ? 'Sign in to My Account' : 'Create your account'}
         </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-bt-darkCard py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-slate-800">
          {step === 'login' ? (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <Input label="Email address" type="email" placeholder="you@company.com" required />
              <Input label="Password" type="password" required />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-bt-indigo focus:ring-bt-indigo border-gray-300 rounded cursor-pointer dark:bg-slate-800 dark:border-slate-700" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-slate-400 cursor-pointer">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-bt-indigo dark:text-bt-indigoLight hover:underline">Forgot your password?</a>
                </div>
              </div>

              <Button type="submit" fullWidth variant="primary" size="lg" className="shadow-lg shadow-indigo-100 dark:shadow-none">Sign in</Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-800" /></div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-bt-darkCard text-gray-500 dark:text-slate-500">New to BT Business?</span>
                </div>
              </div>
              <Button type="button" fullWidth variant="secondary" onClick={() => setStep('register')}>Register now</Button>
            </form>
          ) : (
            <div className="space-y-6">
               <div className="flex items-center justify-between mb-8 px-2">
                  {[1, 2, 3].map(s => (
                     <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={clsx(
                          "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300", 
                          s <= regStep ? "bg-bt-indigo text-white border-bt-indigo shadow-md" : "bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-600 border-gray-200 dark:border-slate-700"
                        )}>
                           {s}
                        </div>
                        {s < 3 && <div className={clsx("h-1 flex-1 mx-2 rounded-full transition-colors duration-500", s < regStep ? "bg-bt-indigo" : "bg-gray-100 dark:bg-slate-800")} />}
                     </div>
                  ))}
               </div>

               <div className="min-h-[220px] animate-in slide-in-from-right duration-300">
                  {regStep === 1 && (
                      <div className="space-y-4">
                        <Input label="Business Email" type="email" placeholder="email@business.com" />
                        <Input label="BT Account Number" placeholder="e.g. GB12345678" />
                        <Button fullWidth variant="primary" onClick={() => setRegStep(2)}>Continue</Button>
                      </div>
                  )}
                  {regStep === 2 && (
                      <div className="space-y-6">
                        <div className="text-center">
                           <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">Verification code sent to your email.</p>
                           <Input className="text-center tracking-[1em] text-2xl font-bold" placeholder="000000" maxLength={6} />
                        </div>
                        <Button fullWidth variant="primary" onClick={() => setRegStep(3)}>Verify Code</Button>
                      </div>
                  )}
                  {regStep === 3 && (
                      <div className="space-y-4">
                        <Input label="Create Password" type="password" />
                        <Input label="Confirm Password" type="password" />
                        <Button fullWidth variant="primary" onClick={onLogin}>Create My Account</Button>
                      </div>
                  )}
               </div>
               <button onClick={() => setStep('login')} className="w-full text-center text-sm text-bt-indigo dark:text-bt-indigoLight font-semibold mt-4 hover:underline">Back to Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};