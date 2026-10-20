/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ show, title, message }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 transition-all duration-300 no-print animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-orange-500/50 text-white shadow-2xl">
        <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold">{title}</p>
          <p className="text-[11px] text-slate-400">{message}</p>
        </div>
      </div>
    </div>
  );
};
