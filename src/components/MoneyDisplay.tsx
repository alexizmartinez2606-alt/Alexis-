/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CurrencySymbol } from '../types.ts';

interface MoneyDisplayProps {
  amount: number;
  currency: CurrencySymbol;
  className?: string;
  symbolClassName?: string;
}

/**
 * Componente de visualización monetaria profesional.
 * Garantiza renderizado nítido del símbolo de Colón Costarricense (₡) o Dólar ($)
 * sin fallos de glyph/tofu ni fuentes incompletas en Linux/Chromium.
 */
export const ColonIcon: React.FC<{ className?: string }> = ({ className = 'w-[0.85em] h-[0.85em]' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block align-baseline mb-[0.1em] ${className}`}
    aria-hidden="true"
  >
    {/* Arco del Colón (C) */}
    <path d="M17.5 7A7 7 0 1 0 17.5 17" />
    {/* Dos barras diagonales paralelas que cruzan el Colón */}
    <line x1="8.5" y1="21" x2="15.5" y2="3" />
    <line x1="12" y1="21" x2="19" y2="3" />
  </svg>
);

export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  amount,
  currency,
  className = '',
  symbolClassName = '',
}) => {
  const rounded = Math.round(amount || 0);
  const formattedNumber = rounded.toLocaleString('en-US');

  return (
    <span className={`inline-flex items-center gap-1 font-mono ${className}`}>
      {currency === '₡' ? (
        <span className={`inline-flex items-center justify-center shrink-0 ${symbolClassName}`} title="Colones (CRC)">
          <ColonIcon className="w-[0.9em] h-[0.9em]" />
        </span>
      ) : (
        <span className={`font-mono font-bold shrink-0 ${symbolClassName}`}>$</span>
      )}
      <span>{formattedNumber}</span>
    </span>
  );
};
