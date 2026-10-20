/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QuoteHistoryItem } from '../types.ts';
import { MoneyDisplay } from './MoneyDisplay.tsx';
import { History, X, Trash2, ArrowUpRight } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  history: QuoteHistoryItem[];
  onClose: () => void;
  onLoadItem: (item: QuoteHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  history,
  onClose,
  onLoadItem,
  onDeleteItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm no-print animate-fade-in">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Historial de Cotizaciones ({history.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Cerrar historial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No hay cotizaciones guardadas aún.</p>
              <p className="text-xs text-slate-600 mt-1">
                Presione &quot;Guardar&quot; en el panel principal para conservar una propuesta.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {item.clientName || 'Cliente Particular'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.productName || 'Artículo sin especificar'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
                  <div>
                    <div className="text-slate-400 text-[10px] flex items-center gap-1">
                      <span>Plazo: {item.selectedTerm}M • Contado:</span>
                      <MoneyDisplay amount={item.price} currency={item.currency} />
                    </div>
                    <div className="text-cyan-400 font-bold flex items-center gap-1 mt-0.5">
                      <span>Cuota:</span>
                      <MoneyDisplay amount={item.monthlyQuota} currency={item.currency} />
                      <span>/mes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadItem(item);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                      title="Cargar esta cotización"
                    >
                      <span>Cargar</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Eliminar de historial"
                      aria-label="Eliminar cotización"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClearHistory}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs font-semibold border border-slate-700/80 transition flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar todo el historial</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
