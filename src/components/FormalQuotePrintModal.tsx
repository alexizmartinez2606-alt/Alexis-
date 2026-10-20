/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CurrencySymbol } from '../types.ts';
import {
  CreditFactors,
  AVAILABLE_TERMS,
  calculateCredit,
} from '../utils/finance.ts';
import { MoneyDisplay } from './MoneyDisplay.tsx';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface FormalQuotePrintModalProps {
  isOpen: boolean;
  clientName: string;
  productName: string;
  price: number;
  downPayment: number;
  selectedTerm: number;
  factors: CreditFactors;
  currency: CurrencySymbol;
  onClose: () => void;
}

export const FormalQuotePrintModal: React.FC<FormalQuotePrintModalProps> = ({
  isOpen,
  clientName,
  productName,
  price,
  downPayment,
  selectedTerm,
  factors,
  currency,
  onClose,
}) => {
  if (!isOpen) return null;

  const activeCalc = calculateCredit(price, downPayment, selectedTerm, factors);
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const quoteNumber = `RN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto print:p-0 print:shadow-none print:max-w-none print:w-full">
        {/* Top Controls (Hidden on print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800">
              VISTA DE IMPRESIÓN / PDF
            </span>
            <span className="text-xs text-slate-500">Folio: {quoteNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
              aria-label="Cerrar proforma"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Proforma Body */}
        <div className="space-y-6">
          {/* Header Membretado */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/aistudio/483524441_975702678073452_1420984083717816495_n_582065ce.jpg"
                alt="Logo Almacén ROES Naranjo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                  ALMACÉN ROES NARANJO
                </h1>
                <p className="text-xs text-slate-600">
                  Departamento de Crédito y Cobro • Naranjo, Alajuela, Costa Rica
                </p>
                <p className="text-xs text-slate-500">
                  Tel: (+506) 2451-0000 • Correo: credito@roesnaranjo.com
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-lg border border-slate-300">
                COTIZACIÓN OFICIAL
              </span>
              <p className="text-xs text-slate-600 mt-1 font-mono">Fecha: {dateFormatted}</p>
              <p className="text-xs text-slate-500 font-mono">Cotización N°: {quoteNumber}</p>
            </div>
          </div>

          {/* Customer & Product Information */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-bold uppercase tracking-wider block">
                Cliente:
              </span>
              <span className="text-sm font-bold text-slate-900">
                {clientName || 'Cliente Particular / Mostrador'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase tracking-wider block">
                Artículo / Referencia:
              </span>
              <span className="text-sm font-bold text-slate-900">
                {productName || 'Artículo de Línea Blanca / Hogar'}
              </span>
            </div>
          </div>

          {/* Primary Financial Numbers */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                Precio Contado
              </span>
              <MoneyDisplay
                amount={price}
                currency={currency}
                className="text-lg font-bold text-slate-900"
              />
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                Prima Inicial
              </span>
              <MoneyDisplay
                amount={downPayment}
                currency={currency}
                className="text-lg font-bold text-blue-700"
              />
            </div>
            <div className="p-3 rounded-xl border-2 border-cyan-500 bg-cyan-50/50">
              <span className="text-[11px] text-cyan-900 uppercase font-bold block">
                Saldo a Financiar
              </span>
              <MoneyDisplay
                amount={activeCalc.financedAmount}
                currency={currency}
                className="text-lg font-extrabold text-cyan-700"
              />
            </div>
          </div>

          {/* Highlight Selected Plan */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-xs text-cyan-400 font-mono font-bold block">
                PLAN SELECCIONADO: {selectedTerm} MESES
              </span>
              <span className="text-xs text-slate-300">
                Factor oficial:{' '}
                <strong className="text-cyan-400 font-mono">{activeCalc.factor}</strong>
                {selectedTerm === 18 && ' (Fórmula exacta: 0.0787)'}
                {selectedTerm === 20 && ' (Fórmula 1% promo: 0.0600)'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Cuota Mensual Fija:</span>
              <MoneyDisplay
                amount={activeCalc.monthlyQuota}
                currency={currency}
                className="text-2xl font-extrabold text-cyan-400"
              />
            </div>
          </div>

          {/* Comparison Table across all terms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Comparativa de Opciones de Financiamiento Disponibles:
            </h4>
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-mono uppercase">
                <tr>
                  <th className="py-2 px-3 border border-slate-200">Plazo</th>
                  <th className="py-2 px-3 border border-slate-200">Factor</th>
                  <th className="py-2 px-3 border border-slate-200">Cuota Mensual</th>
                  <th className="py-2 px-3 border border-slate-200">Total en Cuotas</th>
                  <th className="py-2 px-3 border border-slate-200 text-right">Intereses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {AVAILABLE_TERMS.map((t) => {
                  const c = calculateCredit(price, downPayment, t, factors);
                  const isCurrent = t === selectedTerm;
                  return (
                    <tr key={t} className={isCurrent ? 'bg-cyan-50 font-bold text-slate-900' : ''}>
                      <td className="py-2 px-3 border border-slate-200 flex items-center gap-1.5">
                        {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />}
                        <span>{t} Meses</span>
                      </td>
                      <td className="py-2 px-3 border border-slate-200">
                        {c.factor} {t === 20 ? '(1% Promo)' : t === 18 ? '(Exacto)' : ''}
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-cyan-700 font-bold">
                        <MoneyDisplay amount={c.monthlyQuota} currency={currency} />
                      </td>
                      <td className="py-2 px-3 border border-slate-200">
                        <MoneyDisplay amount={c.totalFinanced} currency={currency} />
                      </td>
                      <td className="py-2 px-3 border border-slate-200 text-right text-slate-600">
                        <span>+</span>
                        <MoneyDisplay amount={c.totalInterest} currency={currency} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Terms & Conditions Note */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
            <p>
              <strong>Condiciones:</strong> Cotización válida por 15 días hábiles a partir de su emisión.
              Sujeto a aprobación crediticia habitual del almacén. Si el cliente decide cancelar o
              liquidar la operación antes del plazo estipulado, se le aplicará el cálculo de liquidación
              anticipada con condonación de intereses futuros de acuerdo a las políticas de Almacén ROES Naranjo.
            </p>
          </div>

          {/* Signature block */}
          <div className="grid grid-cols-2 gap-12 pt-8 text-center text-xs text-slate-600">
            <div>
              <div className="border-b border-slate-400 mb-1" />
              <span>Firma del Asesor de Ventas</span>
            </div>
            <div>
              <div className="border-b border-slate-400 mb-1" />
              <span>Firma de Aceptación del Cliente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
