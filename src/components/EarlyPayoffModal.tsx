/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CurrencySymbol } from '../types.ts';
import { CreditFactors, EarlyPayoffMode } from '../utils/finance.ts';
import { EarlyPayoffSimulator } from './EarlyPayoffSimulator.tsx';
import { X, Zap } from 'lucide-react';

interface EarlyPayoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  downPayment: number;
  selectedTerm: number;
  earlyMonth: number;
  earlyMode: EarlyPayoffMode;
  factors: CreditFactors;
  currency: CurrencySymbol;
  onEarlyMonthChange: (m: number) => void;
  onEarlyModeChange: (mode: EarlyPayoffMode) => void;
}

export const EarlyPayoffModal: React.FC<EarlyPayoffModalProps> = ({
  isOpen,
  onClose,
  price,
  downPayment,
  selectedTerm,
  earlyMonth,
  earlyMode,
  factors,
  currency,
  onEarlyMonthChange,
  onEarlyModeChange,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto no-print animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="earlyPayoffModalTitle"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 id="earlyPayoffModalTitle" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Simulador de Liquidación Anticipada
                <span className="text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Plazo {selectedTerm}M
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Calcula el ahorro en intereses y el monto para cancelar la totalidad de la deuda hoy.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            aria-label="Cerrar simulador de liquidación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 pr-1 pb-2">
          <EarlyPayoffSimulator
            price={price}
            downPayment={downPayment}
            selectedTerm={selectedTerm}
            earlyMonth={earlyMonth}
            earlyMode={earlyMode}
            factors={factors}
            currency={currency}
            onEarlyMonthChange={onEarlyMonthChange}
            onEarlyModeChange={onEarlyModeChange}
          />
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition active:scale-95"
          >
            Listo / Volver a la Calculadora
          </button>
        </div>
      </div>
    </div>
  );
};
