import React from 'react';
import { CurrencySymbol } from '../types.ts';
import { CreditFactors, calculateCredit } from '../utils/finance.ts';
import { MoneyDisplay } from './MoneyDisplay.tsx';
import { Share2, Printer, BookmarkPlus, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface ExecutiveSummaryCardProps {
  price: number;
  downPayment: number;
  selectedTerm: number;
  factors: CreditFactors;
  currency: CurrencySymbol;
  onCopyWhatsApp: () => void;
  onPrint: () => void;
  onSaveHistory: () => void;
  onOpenEarlyPayoff: () => void;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  price,
  downPayment,
  selectedTerm,
  factors,
  currency,
  onCopyWhatsApp,
  onPrint,
  onSaveHistory,
  onOpenEarlyPayoff,
}) => {
  const calc = calculateCredit(price, downPayment, selectedTerm, factors);
  const is18M = selectedTerm === 18;
  const is20M = selectedTerm === 20;

  return (
    <section className="bg-slate-900/75 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-t-4 border-t-cyan-500 border-x border-b border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
            Plan Activo Seleccionado
          </span>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2 mt-0.5">
            <span>Financiamiento a {selectedTerm} Meses</span>
            {is20M && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5" /> 1% PROMO: 0.0600
              </span>
            )}
            {is18M && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5" /> 0.0787 OK
              </span>
            )}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Factor Aplicado</span>
          <span className="font-mono text-sm font-bold text-cyan-300 bg-cyan-950/70 px-2.5 py-1 rounded-lg border border-cyan-500/30 inline-block mt-0.5">
            × {calc.factor}
          </span>
        </div>
      </div>

      {/* Hero Cuota Mensual Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-transparent border border-cyan-500/40 mb-4 flex items-center justify-between shadow-lg shadow-cyan-500/5">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-cyan-300 block">
            Cuota Mensual Fija
          </span>
          <span className="text-xs text-slate-300">
            {selectedTerm} pagos mensuales de:
          </span>
        </div>
        <div className="text-right">
          <MoneyDisplay
            amount={calc.monthlyQuota}
            currency={currency}
            className="text-2xl sm:text-3xl font-extrabold text-cyan-300 tracking-tight"
          />
          <span className="text-[10px] text-slate-400 font-mono block">Sin comisiones ocultas</span>
        </div>
      </div>

      {/* Desglose Numérico Ejecutivo */}
      <div className="space-y-2.5 text-sm border-t border-slate-800/80 pt-4">
        <div className="flex justify-between text-slate-300">
          <span>Precio de Contado:</span>
          <MoneyDisplay
            amount={calc.price}
            currency={currency}
            className="font-semibold text-white"
          />
        </div>

        <div className="flex justify-between text-slate-300">
          <span>Prima Inicial:</span>
          <span className="text-cyan-400 flex items-center gap-0.5">
            <span>-</span>
            <MoneyDisplay
              amount={calc.downPayment}
              currency={currency}
              className="font-semibold text-cyan-400"
            />
          </span>
        </div>

        <div className="flex justify-between text-slate-300">
          <span>Capital Financiado:</span>
          <MoneyDisplay
            amount={calc.financedAmount}
            currency={currency}
            className="font-semibold text-white"
          />
        </div>

        <div className="flex justify-between text-slate-300">
          <span className="flex items-center gap-1.5">
            <span>Intereses del Plazo:</span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 bg-slate-800 text-sky-300 rounded">
              (+{calc.interestPercent.toFixed(2)}%)
            </span>
          </span>
          <span className="text-sky-300 flex items-center gap-0.5">
            <span>+</span>
            <MoneyDisplay
              amount={calc.totalInterest}
              currency={currency}
              className="font-semibold text-sky-300"
            />
          </span>
        </div>

        <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
          <span>Total Financiado (Cuotas):</span>
          <MoneyDisplay
            amount={calc.totalFinanced}
            currency={currency}
            className="text-cyan-300 font-bold"
          />
        </div>

        <div className="flex justify-between text-xs text-slate-400 pt-1">
          <span>Costo Total Final (Prima + Cuotas):</span>
          <MoneyDisplay
            amount={calc.grandTotal}
            currency={currency}
            className="font-semibold text-slate-200"
          />
        </div>
      </div>

      {/* Indicadores de Tasa Financiera Profesional */}
      <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>TNA Implícita: <strong className="text-slate-200">{calc.annualNominalRate.toFixed(1)}%</strong></span>
        </div>
        <div className="text-slate-400">
          <span>TEA / TIR: <strong className="text-cyan-400">{calc.effectiveAnnualRate.toFixed(1)}%</strong></span>
        </div>
      </div>

      {/* Botón Destacado para Abrir Ventana de Liquidación Anticipada */}
      <button
        type="button"
        onClick={onOpenEarlyPayoff}
        className="w-full mt-4 flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/70 hover:from-cyan-900/80 hover:to-blue-900/80 border border-cyan-500/40 text-white transition-all shadow-md group cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4" />
          </span>
          <div className="text-left">
            <span className="text-xs font-bold block text-white">
              Simulador de Liquidación Anticipada
            </span>
            <span className="text-[11px] text-slate-400 block">
              ¿Cuánto ahorra el cliente si cancela antes?
            </span>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
          Simular Ventana →
        </span>
      </button>

      {/* Botones de Acción */}
      <div className="grid grid-cols-3 gap-2.5 mt-4 no-print">
        <button
          type="button"
          onClick={onCopyWhatsApp}
          className="col-span-3 sm:col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={onPrint}
          className="col-span-3 sm:col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-white" />
          <span>Imprimir / PDF</span>
        </button>

        <button
          type="button"
          onClick={onSaveHistory}
          className="col-span-3 sm:col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
          title="Guardar cotización actual para comparar"
        >
          <BookmarkPlus className="w-3.5 h-3.5 text-sky-400" />
          <span>Guardar</span>
        </button>
      </div>
    </section>
  );
};
