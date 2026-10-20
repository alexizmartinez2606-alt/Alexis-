/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CreditFactors, DEFAULT_FACTORS } from '../utils/finance.ts';
import { Sliders, X, RotateCcw, Check, Sparkles } from 'lucide-react';

interface FactorsModalProps {
  isOpen: boolean;
  factors: CreditFactors;
  onClose: () => void;
  onSaveFactors: (factors: CreditFactors) => void;
}

export const FactorsModal: React.FC<FactorsModalProps> = ({
  isOpen,
  factors,
  onClose,
  onSaveFactors,
}) => {
  const [tempFactors, setTempFactors] = useState<CreditFactors>({ ...factors });

  if (!isOpen) return null;

  const handleChange = (term: number, value: string) => {
    const num = parseFloat(value) || 0;
    setTempFactors((prev) => ({
      ...prev,
      [term]: num,
    }));
  };

  const handleRestore = () => {
    setTempFactors({ ...DEFAULT_FACTORS });
  };

  const handleSave = () => {
    onSaveFactors(tempFactors);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md no-print animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>Factores del Almacén ROES</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Cerrar modal de factores"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-3 mb-4 leading-relaxed">
          Estos factores definen la cuota mensual mediante la fórmula oficial:{' '}
          <code className="text-cyan-400 font-mono font-bold bg-slate-950 px-1 py-0.5 rounded border border-cyan-500/20">
            Cuota = Saldo × Factor
          </code>
          . Incluye el factor exacto de 18 meses (<strong className="text-cyan-300 font-mono">0.0787</strong>) y la fórmula especial de 20 meses al 1% (<strong className="text-blue-400 font-mono">0.0600</strong>).
        </p>

        {/* Inputs de Factores */}
        <div className="space-y-3 font-mono text-sm max-h-80 overflow-y-auto pr-1">
          {/* 6M */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-300 font-sans font-medium block">Plazo 6 Meses:</span>
              <span className="text-[10px] text-slate-500 font-mono">Factor base corto plazo</span>
            </div>
            <input
              type="number"
              step="0.0001"
              value={tempFactors[6] || ''}
              onChange={(e) => handleChange(6, e.target.value)}
              className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-right text-cyan-400 font-bold focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* 12M */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-300 font-sans font-medium block">Plazo 12 Meses:</span>
              <span className="text-[10px] text-slate-500 font-mono">Plazo estándar 1 año</span>
            </div>
            <input
              type="number"
              step="0.0001"
              value={tempFactors[12] || ''}
              onChange={(e) => handleChange(12, e.target.value)}
              className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-right text-cyan-400 font-bold focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* 18M - EXACTO */}
          <div className="flex items-center justify-between bg-cyan-950/20 p-3 rounded-xl border border-cyan-500/40 relative">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-sans font-bold block">Plazo 18 Meses:</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded font-extrabold">
                  <Sparkles className="w-2.5 h-2.5" /> EXACTO
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">
                Fórmula exacta: 0.0787
              </span>
            </div>
            <input
              type="number"
              step="0.0001"
              value={tempFactors[18] || ''}
              onChange={(e) => handleChange(18, e.target.value)}
              className="w-28 bg-slate-800 border-2 border-cyan-500 rounded-lg px-3 py-1.5 text-right text-cyan-400 font-bold focus:outline-none focus:border-cyan-400 shadow-inner"
            />
          </div>

          {/* 20M - 1% PROMO */}
          <div className="flex items-center justify-between bg-blue-950/30 p-3 rounded-xl border border-blue-500/50 relative">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-sans font-bold block">Plazo 20 Meses:</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-extrabold">
                  <Sparkles className="w-2.5 h-2.5" /> 1% PROMO
                </span>
              </div>
              <span className="text-[10px] text-blue-300 font-mono">
                Fórmula especial 1% interés: 0.0600
              </span>
            </div>
            <input
              type="number"
              step="0.0001"
              value={tempFactors[20] ?? 0.0600}
              onChange={(e) => handleChange(20, e.target.value)}
              className="w-28 bg-slate-800 border-2 border-blue-500 rounded-lg px-3 py-1.5 text-right text-blue-300 font-bold focus:outline-none focus:border-blue-400 shadow-inner"
            />
          </div>

          {/* 24M */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-300 font-sans font-medium block">Plazo 24 Meses:</span>
              <span className="text-[10px] text-slate-500 font-mono">Plazo extendido 2 años</span>
            </div>
            <input
              type="number"
              step="0.0001"
              value={tempFactors[24] || ''}
              onChange={(e) => handleChange(24, e.target.value)}
              className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-right text-cyan-400 font-bold focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleRestore}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Oficiales</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Factores</span>
          </button>
        </div>
      </div>
    </div>
  );
};
