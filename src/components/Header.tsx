/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CurrencySymbol } from '../types.ts';
import { Sliders, RotateCcw, Calculator, FileText, History, Zap } from 'lucide-react';

interface HeaderProps {
  currency: CurrencySymbol;
  onSetCurrency: (c: CurrencySymbol) => void;
  onOpenFactorsModal: () => void;
  onOpenBudgetModal: () => void;
  onOpenFormalQuote: () => void;
  onOpenHistory: () => void;
  onOpenEarlyPayoff: () => void;
  historyCount: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onSetCurrency,
  onOpenFactorsModal,
  onOpenBudgetModal,
  onOpenFormalQuote,
  onOpenHistory,
  onOpenEarlyPayoff,
  historyCount,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-cyan-950/60 px-4 py-3 sm:px-6 no-print shadow-lg shadow-cyan-950/30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Store Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center h-11 px-2.5 py-1 rounded-xl bg-white border border-cyan-400/40 shadow-lg shadow-cyan-500/20 shrink-0">
            <img
              src="/assets/aistudio/483524441_975702678073452_1420984083717816495_n_582065ce.jpg"
              alt="Logo Oficial Almacén ROES"
              className="h-8 sm:h-9 w-auto object-contain rounded"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 font-extrabold">
                  ROES NARANJO
                </span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                FIN-TECH PRO v2.6
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Sistema Financiero • 18M: <strong className="text-cyan-400 font-mono">0.0787</strong> • 20M (1%): <strong className="text-blue-400 font-mono">0.0600</strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onSetCurrency('₡')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                currency === '₡'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Seleccionar Colones (CRC)"
            >
              ₡ CRC
            </button>
            <button
              type="button"
              onClick={() => onSetCurrency('$')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                currency === '$'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Seleccionar Dólares (USD)"
            >
              $ USD
            </button>
          </div>

          {/* Liquidación Anticipada Modal Button */}
          <button
            type="button"
            onClick={onOpenEarlyPayoff}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/70 to-blue-950/70 hover:from-cyan-900/80 hover:to-blue-900/80 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-500/10 cursor-pointer"
            title="Abrir ventana de liquidación anticipada y tabla de amortización"
            aria-label="Abrir liquidación anticipada"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Liquidación</span>
          </button>

          {/* Presupuesto Inverso */}
          <button
            type="button"
            onClick={onOpenBudgetModal}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Calcular cuánto puede comprar con su cuota disponible"
            aria-label="Abrir calculadora inversa de presupuesto"
          >
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Presupuesto</span>
          </button>

          {/* Historial */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-all flex items-center gap-1.5 relative cursor-pointer"
            title="Ver cotizaciones guardadas"
            aria-label="Ver historial de cotizaciones"
          >
            <History className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden lg:inline">Historial</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-[10px] font-mono font-bold text-white flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Factores del Almacén */}
          <button
            type="button"
            onClick={onOpenFactorsModal}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Configurar y verificar factores oficiales"
            aria-label="Abrir configuración de factores"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Factores</span>
          </button>

          {/* Proforma Formal */}
          <button
            type="button"
            onClick={onOpenFormalQuote}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Ver proforma formal de crédito"
            aria-label="Abrir proforma formal de crédito"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Proforma</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/40 transition-all cursor-pointer"
            title="Limpiar calculadora"
            aria-label="Limpiar calculadora"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
