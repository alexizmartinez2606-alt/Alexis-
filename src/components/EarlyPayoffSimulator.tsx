/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CurrencySymbol } from '../types.ts';
import {
  CreditFactors,
  EarlyPayoffMode,
  calculateEarlyPayoff,
  generateAmortizationSchedule,
} from '../utils/finance.ts';
import { MoneyDisplay } from './MoneyDisplay.tsx';
import {
  Zap,
  PiggyBank,
  ChevronDown,
  Info,
  Minus,
  Plus,
  Table,
  CheckCircle,
} from 'lucide-react';

interface EarlyPayoffSimulatorProps {
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

export const EarlyPayoffSimulator: React.FC<EarlyPayoffSimulatorProps> = ({
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
  const [showTable, setShowTable] = useState(false);
  const financedAmount = Math.max(0, price - downPayment);

  const clampedMonth = Math.min(selectedTerm, Math.max(1, earlyMonth));
  const earlyResult = calculateEarlyPayoff(
    financedAmount,
    selectedTerm,
    clampedMonth,
    earlyMode,
    factors
  );

  const schedule = generateAmortizationSchedule(
    financedAmount,
    selectedTerm,
    earlyMode,
    factors
  );

  const stepMonth = (delta: number) => {
    const next = Math.min(selectedTerm, Math.max(1, clampedMonth + delta));
    onEarlyMonthChange(next);
  };

  const getModeDescription = () => {
    switch (earlyMode) {
      case 'proportional':
        return 'Interés Devengado (Recomendado Almacén): El cliente solo abona el capital más los intereses devengados hasta el mes de liquidación. Se condona el 100% de los intereses de las cuotas futuras.';
      case 'bracket':
        return 'Ajuste de Tramo ROES: Si liquidó dentro del período de un plazo menor (ej. 6 o 12 meses), se recalcula la operación bajo el factor oficial de ese tramo más favorable.';
      case 'french':
        return 'Amortización Francesa (Saldo Insoluto): Desglose bancario estricto de capital e intereses por cuota; el cliente cancela el saldo vivo del capital restante a la fecha.';
    }
  };

  return (
    <section className="bg-slate-900/75 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-cyan-500/30 shadow-xl relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono font-semibold mb-1.5">
            <Zap className="w-3.5 h-3.5" /> SIMULADOR DE LIQUIDACIÓN ANTICIPADA
          </div>
          <h2 className="text-lg font-extrabold text-white">
            ¿Qué pasa si el cliente cancela antes de tiempo?
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Muestra el ahorro real y el pago total requerido si liquida el crédito en cualquier mes previo al plazo final.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex flex-wrap self-start sm:self-auto gap-1">
          <button
            type="button"
            onClick={() => onEarlyModeChange('proportional')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              earlyMode === 'proportional'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interés Devengado
          </button>
          <button
            type="button"
            onClick={() => onEarlyModeChange('bracket')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              earlyMode === 'bracket'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ajuste Tramo
          </button>
          <button
            type="button"
            onClick={() => onEarlyModeChange('french')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              earlyMode === 'french'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Saldo Insoluto
          </button>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="mb-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>{getModeDescription()}</span>
      </div>

      {/* Month Selection Slider & Stepper */}
      <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Mes de Cancelación Anticipada:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => stepMonth(-1)}
              disabled={clampedMonth <= 1}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center border border-slate-700 transition"
              aria-label="Restar un mes"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono font-extrabold text-sm shadow-md shadow-cyan-500/20">
              Mes {clampedMonth} de {selectedTerm}
            </span>
            <button
              type="button"
              onClick={() => stepMonth(1)}
              disabled={clampedMonth >= selectedTerm}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center border border-slate-700 transition"
              aria-label="Sumar un mes"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={selectedTerm}
          value={clampedMonth}
          onChange={(e) => onEarlyMonthChange(parseInt(e.target.value) || 1)}
          className="tech-slider my-2"
          aria-label="Seleccionar mes de cancelación anticipada"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
          <span>Mes 1 (Inicio)</span>
          <span>Mes {Math.round(selectedTerm / 2)} (Mitad)</span>
          <span>Mes {selectedTerm} (Vencimiento)</span>
        </div>
      </div>

      {/* 3 Metric Cards for Payoff */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
        {/* Abonado previo */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-xs text-slate-400 block">
            {earlyResult.previousMonthsPaid === 0
              ? 'Abonado antes del Mes 1'
              : `Abonado (Meses 1 al ${earlyResult.previousMonthsPaid})`}
          </span>
          <div className="mt-1">
            <MoneyDisplay
              amount={earlyResult.amountAlreadyPaid}
              currency={currency}
              className="text-xl font-bold text-white block"
            />
          </div>
          <span className="text-[11px] text-slate-500 font-mono block mt-1">
            {earlyResult.previousMonthsPaid} cuota(s) pagadas
          </span>
        </div>

        {/* Monto para Liquidar HOY */}
        <div className="p-4 rounded-2xl bg-cyan-950/40 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/10">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block">
            Pago para Liquidar en Mes {clampedMonth}
          </span>
          <div className="mt-1">
            <MoneyDisplay
              amount={earlyResult.payoffToday}
              currency={currency}
              className="text-2xl font-extrabold text-cyan-400 block"
            />
          </div>
          <span className="text-[11px] text-cyan-200/80 block mt-1">
            Finiquito total de la deuda
          </span>
        </div>

        {/* Ahorro Total */}
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <PiggyBank className="w-3.5 h-3.5" /> Ahorro en Intereses
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              -{earlyResult.savingsPercent.toFixed(1)}%
            </span>
          </div>
          <div className="mt-1">
            <MoneyDisplay
              amount={earlyResult.interestSavings}
              currency={currency}
              className="text-2xl font-extrabold text-emerald-400 block"
            />
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-1">
            <span>Total crédito:</span>
            <MoneyDisplay
              amount={earlyResult.totalPaidAtEnd}
              currency={currency}
              className="text-slate-300 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Botón Desplegable para Tabla de Amortización */}
      <div>
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-300 transition-all no-print"
          aria-expanded={showTable}
        >
          <span className="flex items-center gap-2">
            <Table className="w-4 h-4 text-cyan-400" />
            <span>Ver Tabla Detallada de Pagos y Liquidación Mes a Mes</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              showTable ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showTable && (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90 max-h-96">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Mes</th>
                  <th className="py-2.5 px-3">Cuota</th>
                  <th className="py-2.5 px-3">Abonado Acum.</th>
                  <th className="py-2.5 px-3 text-cyan-400">Total Liquidación</th>
                  <th className="py-2.5 px-3 text-emerald-400 text-right">Ahorro Cliente</th>
                  <th className="py-2.5 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                {schedule.map((row) => {
                  const isSelected = row.month === clampedMonth;
                  return (
                    <tr
                      key={row.month}
                      onClick={() => onEarlyMonthChange(row.month)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/20 text-white font-bold'
                          : 'hover:bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-3 flex items-center gap-1.5">
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>Mes {row.month}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <MoneyDisplay amount={row.quota} currency={currency} />
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        <MoneyDisplay amount={row.accumulatedPaid} currency={currency} />
                      </td>
                      <td className="py-2.5 px-3 text-cyan-400 font-bold">
                        <MoneyDisplay amount={row.payoffToClose} currency={currency} />
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400 text-right font-bold">
                        {row.savingsIfClosed > 0 ? (
                          <MoneyDisplay amount={row.savingsIfClosed} currency={currency} />
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEarlyMonthChange(row.month);
                          }}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {isSelected ? 'Activo' : 'Simular'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
