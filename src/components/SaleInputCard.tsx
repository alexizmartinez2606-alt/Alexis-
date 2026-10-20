/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CurrencySymbol } from '../types.ts';
import { ColonIcon, MoneyDisplay } from './MoneyDisplay.tsx';
import { ShoppingBag, User, Barcode, DollarSign, Percent } from 'lucide-react';

interface SaleInputCardProps {
  clientName: string;
  productName: string;
  price: number;
  downPayment: number;
  currency: CurrencySymbol;
  onClientNameChange: (v: string) => void;
  onProductNameChange: (v: string) => void;
  onPriceChange: (v: number) => void;
  onDownPaymentChange: (v: number) => void;
}

export const SaleInputCard: React.FC<SaleInputCardProps> = ({
  clientName,
  productName,
  price,
  downPayment,
  currency,
  onClientNameChange,
  onProductNameChange,
  onPriceChange,
  onDownPaymentChange,
}) => {
  const financedAmount = Math.max(0, price - downPayment);
  const downPaymentPercent = price > 0 ? ((downPayment / price) * 100).toFixed(1) : '0.0';

  const quickAmounts = currency === '₡' 
    ? [100000, 250000, 450000, 750000, 1200000] 
    : [200, 500, 900, 1500, 2500];

  const handlePriceInput = (val: string) => {
    const num = Math.max(0, parseFloat(val) || 0);
    onPriceChange(num);
    if (downPayment > num) {
      onDownPaymentChange(num);
    }
  };

  const handleDownPaymentInput = (val: string) => {
    const num = Math.max(0, parseFloat(val) || 0);
    const clamped = Math.min(price, num);
    onDownPaymentChange(clamped);
  };

  const setDownPercent = (pct: number) => {
    const calculated = Math.round(price * (pct / 100));
    onDownPaymentChange(calculated);
  };

  return (
    <section className="bg-slate-900/75 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <ShoppingBag className="w-4 h-4" />
          </span>
          1. Datos de la Venta
        </h2>
        <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          Almacén Central
        </span>
      </div>

      <div className="space-y-4">
        {/* Cliente / Artículo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="clientNameInput" className="block text-xs font-medium text-slate-400 mb-1">
              Cliente (Opcional)
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="clientNameInput"
                type="text"
                value={clientName}
                onChange={(e) => onClientNameChange(e.target.value)}
                placeholder="Nombre del cliente"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="productNameInput" className="block text-xs font-medium text-slate-400 mb-1">
              Artículo / Modelo
            </label>
            <div className="relative">
              <Barcode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="productNameInput"
                type="text"
                value={productName}
                onChange={(e) => onProductNameChange(e.target.value)}
                placeholder="Ej: Refrigeradora Samsung / Smart TV"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Valor del Producto (Contado) */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="productPriceInput" className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
              Valor del Producto (Contado)
            </label>
            <span className="text-[11px] text-slate-400">Precio con IVA</span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-4 text-xl font-bold text-cyan-400 flex items-center justify-center">
              {currency === '₡' ? <ColonIcon className="w-5 h-5" /> : '$'}
            </span>
            <input
              id="productPriceInput"
              type="number"
              min="0"
              step="1000"
              value={price || ''}
              onChange={(e) => handlePriceInput(e.target.value)}
              placeholder="0"
              className="w-full pl-12 pr-4 py-3 bg-slate-950 border-2 border-slate-700 focus:border-cyan-400 rounded-xl text-xl sm:text-2xl font-mono font-extrabold text-white focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Botones rápidos de montos */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  onPriceChange(amt);
                  if (downPayment > amt) {
                    onDownPaymentChange(Math.round(amt * 0.2));
                  }
                }}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition ${
                  price === amt
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80'
                }`}
              >
                {amt.toLocaleString('en-US')}
              </button>
            ))}
          </div>
        </div>

        {/* Prima / Enganche */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="downPaymentInput" className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-sky-400" />
              Prima / Enganche Inicial
            </label>
            <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {downPaymentPercent}%
            </span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-4 text-xl font-bold text-sky-400 flex items-center justify-center">
              {currency === '₡' ? <ColonIcon className="w-5 h-5" /> : '$'}
            </span>
            <input
              id="downPaymentInput"
              type="number"
              min="0"
              max={price}
              step="1000"
              value={downPayment || ''}
              onChange={(e) => handleDownPaymentInput(e.target.value)}
              placeholder="0"
              className="w-full pl-12 pr-4 py-3 bg-slate-950 border-2 border-slate-700 focus:border-cyan-400 rounded-xl text-xl sm:text-2xl font-mono font-extrabold text-white focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Botones de Porcentaje de Prima */}
          <div className="grid grid-cols-6 gap-1.5 mt-2.5">
            {[0, 10, 15, 20, 30, 50].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setDownPercent(pct)}
                className="py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-800/90 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40 text-slate-300 border border-slate-700 transition"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Saldo Neto a Financiar Highlight */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/40 flex items-center justify-between shadow-lg shadow-cyan-500/10">
          <div>
            <span className="text-xs font-semibold text-slate-300 block">Saldo Neto a Financiar</span>
            <span className="text-[11px] text-slate-400 font-mono">(Valor Contado - Prima)</span>
          </div>
          <div className="text-right">
            <MoneyDisplay
              amount={financedAmount}
              currency={currency}
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
