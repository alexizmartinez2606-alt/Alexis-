/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CurrencySymbol } from '../types.ts';
import { CreditFactors, AVAILABLE_TERMS, calculateCredit } from '../utils/finance.ts';
import { MoneyDisplay } from './MoneyDisplay.tsx';
import { CalendarCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface TermsComparatorProps {
  price: number;
  downPayment: number;
  selectedTerm: number;
  factors: CreditFactors;
  currency: CurrencySymbol;
  onSelectTerm: (term: number) => void;
}

export const TermsComparator: React.FC<TermsComparatorProps> = ({
  price,
  downPayment,
  selectedTerm,
  factors,
  currency,
  onSelectTerm,
}) => {
  return (
    <section className="bg-slate-900/75 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <CalendarCheck className="w-4 h-4" />
            </span>
            2. Seleccione el Plazo de Financiamiento
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare las cuotas mensuales. Haga clic en una tarjeta para activar el plan de crédito.
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-lg self-start sm:self-auto flex items-center gap-1.5">
          <span>Cuota = Saldo × Factor</span>
        </span>
      </div>

      {/* Grid de Plazos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {AVAILABLE_TERMS.map((term) => {
          const calc = calculateCredit(price, downPayment, term, factors);
          const isSelected = selectedTerm === term;
          const is18M = term === 18;
          const is20M = term === 20;

          return (
            <button
              type="button"
              key={term}
              onClick={() => onSelectTerm(term)}
              className={`text-left p-4 rounded-2xl transition-all duration-200 border relative overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              {/* Highlight badge for 20M with 1% formula 0.0600 */}
              {is20M && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 via-indigo-600 to-cyan-500 text-white font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-bl-xl shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-200" />
                  1% PROMO: 0.0600
                </div>
              )}

              {/* Highlight badge for 18M with corrected factor 0.0787 */}
              {is18M && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-teal-400 text-slate-950 font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-bl-xl shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  EXACTO: 0.0787
                </div>
              )}

              {/* Top Row: Term Name & Factor */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-extrabold ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {term}M
                  </span>
                  <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {term} Meses
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-800">
                  Factor: <strong className={is20M ? 'text-blue-400' : is18M ? 'text-cyan-400' : 'text-slate-200'}>{calc.factor}</strong>
                </span>
              </div>

              {/* Monthly Payment */}
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Cuota Mensual:</span>
                <MoneyDisplay
                  amount={calc.monthlyQuota}
                  currency={currency}
                  className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                    isSelected ? 'text-cyan-300' : 'text-white'
                  }`}
                />
              </div>

              {/* Total & Interest */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  Total:{' '}
                  <MoneyDisplay
                    amount={calc.totalFinanced}
                    currency={currency}
                    className="font-bold text-slate-200"
                  />
                </span>
                <span className="text-cyan-400/90 flex items-center gap-0.5">
                  <span>Int: +</span>
                  <MoneyDisplay
                    amount={calc.totalInterest}
                    currency={currency}
                    className="font-semibold text-cyan-400"
                  />
                </span>
              </div>

              {/* Footnotes */}
              {is20M && (
                <div className="mt-2 pt-1.5 text-[10px] text-blue-300 font-mono flex items-center justify-between border-t border-blue-900/40">
                  <span>Fórmula 1% mensual</span>
                  <span className="font-bold text-cyan-300">Factor 0.0600</span>
                </div>
              )}
              {is18M && (
                <div className="mt-2 pt-1.5 text-[10px] text-cyan-300 font-mono flex items-center justify-between border-t border-cyan-900/40">
                  <span>Fórmula oficial corregida</span>
                  <span className="font-bold text-emerald-400">Factor 0.0787</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
