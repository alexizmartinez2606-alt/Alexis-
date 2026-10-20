/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CreditFactors, EarlyPayoffMode } from './utils/finance.ts';

export type CurrencySymbol = '₡' | '$';

export interface AppState {
  currency: CurrencySymbol;
  clientName: string;
  productName: string;
  price: number;
  downPayment: number;
  selectedTerm: number;
  earlyMonth: number;
  earlyMode: EarlyPayoffMode;
  factors: CreditFactors;
}

export interface QuoteHistoryItem {
  id: string;
  timestamp: string;
  clientName: string;
  productName: string;
  price: number;
  downPayment: number;
  selectedTerm: number;
  monthlyQuota: number;
  currency: CurrencySymbol;
}
