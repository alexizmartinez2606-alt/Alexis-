/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CurrencySymbol } from '../types.ts';
import {
  CreditFactors,
  AVAILABLE_TERMS,
  calculateMaxAffordable,
} from '../utils/finance.ts';
import { ColonIcon, MoneyDisplay } from './MoneyDisplay.tsx';
import { Calculator, X, ArrowRight, Sparkles } from 'lucide-react';

interface ReverseBudgetModalProps {
  isOpen: boolean;
  currency: CurrencySymbol;
  factors: CreditFactors;
  onClose: () => void;
  onApplyCalculated: (price: number, downPayment: number, term: number) => void;
}

export const ReverseBudgetModal: React.FC<ReverseBudgetModalProps> = ({
  isOpen,
  currency,
  factors,
  onClose,
  onApplyCalculated,
}) => {
  const [budgetQuota, setBudgetQuota] = useState<number>(25000);
  const [availableDown, setAvailableDown] = useState<number>(20000);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md no-print animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Calculadora Inversa de Presupuesto
              </h3>
              <p className="text-xs text-slate-400">
                ¿Cuánto puede comprar el cliente según su cuota mensual?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Cerrar modal de presupuesto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-cyan-400 mb-1">
              Cuota Mensual Máxima
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-bold text-cyan-400 flex items-center justify-center">
                {currency === '₡' ? <ColonIcon className="w-4 h-4" /> : '$'}
              </span>
              <input
                type="number"
                min="1000"
                step="1000"
                value={budgetQuota || ''}
                onChange={(e) => setBudgetQuota(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-sky-400 mb-1">
              Prima Disponible (Opcional)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-bold text-sky-400 flex items-center justify-center">
                {currency === '₡' ? <ColonIcon className="w-4 h-4" /> : '$'}
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                value={availableDown || ''}
                onChange={(e) => setAvailableDown(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Results Matrix */}
        <div className="mt-5 space-y-2.5">
          <span className="text-xs font-bold uppercase text-slate-400 block">
            Capacidad Máxima de Compra por Plazo:
          </span>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {AVAILABLE_TERMS.map((term) => {
              const res = calculateMaxAffordable(budgetQuota, term, availableDown, factors);
              const is18M = term === 18;
              const is20M = term === 20;

              return (
                <div
                  key={term}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    is20M
                      ? 'bg-blue-950/20 border-blue-500/50 shadow-sm'
                      : is18M
                      ? 'bg-cyan-950/20 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold font-mono text-white">
                        {term} Meses
                      </span>
                      {is20M && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> 1% (0.0600)
                        </span>
                      )}
                      {is18M && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> 0.0787
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>Financia:</span>
                      <MoneyDisplay amount={res.maxFinanced} currency={currency} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Valor Artículo</span>
                      <MoneyDisplay
                        amount={res.maxPrice}
                        currency={currency}
                        className="text-base font-extrabold text-cyan-300"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onApplyCalculated(res.maxPrice, availableDown, term);
                        onClose();
                      }}
                      className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition active:scale-95 cursor-pointer shadow-md shadow-cyan-500/20"
                      title="Aplicar este monto a la calculadora principal"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
