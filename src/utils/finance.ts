/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Financial calculation engine for ROES Naranjo.
 * Contains corrected 18-month factor (0.0787) and professional credit formulas.
 */

export interface CreditFactors {
  6: number;
  12: number;
  18: number;
  20: number; // 20 meses al 1% con factor oficial 0.0600
  24: number;
  [key: number]: number;
}

/**
 * Factores oficiales del Almacén ROES Naranjo.
 * NOTA CRÍTICA:
 * - 18 meses: 0.0787 (fórmula exacta corregida).
 * - 20 meses: 0.0600 (fórmula especial al 1% de interés mensual).
 */
export const DEFAULT_FACTORS: CreditFactors = {
  6: 0.1905,
  12: 0.1062,
  18: 0.0787, // << FACTOR EXACTO CORREGIDO: 0.0787
  20: 0.0600, // << NUEVO PLAZO 20 MESES (1%): 0.0600
  24: 0.0653,
};

export const AVAILABLE_TERMS = [6, 12, 18, 20, 24] as const;
export type TermMonths = 6 | 12 | 18 | 20 | 24 | number;

export type EarlyPayoffMode = 'proportional' | 'bracket' | 'french';

export interface CreditCalculation {
  price: number;
  downPayment: number;
  downPaymentPercent: number;
  financedAmount: number;
  termMonths: number;
  factor: number;
  monthlyQuota: number;
  totalFinanced: number;
  totalInterest: number;
  grandTotal: number;
  interestPercent: number;
  annualNominalRate: number; // Tasa nominal anual aproximada
  effectiveAnnualRate: number; // Tasa efectiva anual (TIR anualizada)
}

export interface EarlyPayoffResult {
  month: number;
  termMonths: number;
  monthlyQuota: number;
  previousMonthsPaid: number;
  amountAlreadyPaid: number;
  payoffToday: number;
  totalPaidAtEnd: number;
  interestSavings: number;
  savingsPercent: number;
  mode: EarlyPayoffMode;
}

export interface AmortizationRow {
  month: number;
  quota: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  accumulatedPaid: number;
  payoffToClose: number;
  savingsIfClosed: number;
}

/**
 * Calcula la tasa periódica mensual implícita del factor usando el método de Newton-Raphson.
 * factor = r / (1 - (1 + r)^(-n))
 */
export function calculateImplicitMonthlyRate(factor: number, n: number): number {
  if (factor <= 0 || n <= 0) return 0;
  // Si factor * n <= 1, no hay interés positivo
  if (factor * n <= 1) return 0;

  let r = (factor * n - 1) / (n / 2); // Estimación inicial
  for (let i = 0; i < 40; i++) {
    const pow = Math.pow(1 + r, -n);
    const f = r / (1 - pow) - factor;
    if (Math.abs(f) < 1e-9) break;
    const df = (1 - pow - n * r * Math.pow(1 + r, -n - 1)) / Math.pow(1 - pow, 2);
    if (df === 0) break;
    r = r - f / df;
    if (r <= 0) r = 0.001;
  }
  return r;
}

/**
 * Realiza el cálculo financiero completo para una cotización de crédito.
 */
export function calculateCredit(
  price: number,
  downPayment: number,
  termMonths: number,
  customFactors?: Partial<CreditFactors>
): CreditCalculation {
  const safePrice = Math.max(0, Math.round(price));
  const safeDown = Math.min(safePrice, Math.max(0, Math.round(downPayment)));
  const financedAmount = Math.max(0, safePrice - safeDown);

  const factor = customFactors?.[termMonths] ?? DEFAULT_FACTORS[termMonths] ?? 0.1062;

  const monthlyQuota = Math.round(financedAmount * factor);
  const totalFinanced = monthlyQuota * termMonths;
  const totalInterest = Math.max(0, totalFinanced - financedAmount);
  const grandTotal = safeDown + totalFinanced;

  const downPaymentPercent = safePrice > 0 ? (safeDown / safePrice) * 100 : 0;
  const interestPercent = financedAmount > 0 ? (totalInterest / financedAmount) * 100 : 0;

  const monthlyRate = calculateImplicitMonthlyRate(factor, termMonths);
  const annualNominalRate = monthlyRate * 12 * 100;
  const effectiveAnnualRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

  return {
    price: safePrice,
    downPayment: safeDown,
    downPaymentPercent,
    financedAmount,
    termMonths,
    factor,
    monthlyQuota,
    totalFinanced,
    totalInterest,
    grandTotal,
    interestPercent,
    annualNominalRate,
    effectiveAnnualRate,
  };
}

/**
 * Calcula la liquidación anticipada en un mes M (1 <= M <= term).
 */
export function calculateEarlyPayoff(
  financedAmount: number,
  termMonths: number,
  month: number,
  mode: EarlyPayoffMode = 'proportional',
  customFactors?: Partial<CreditFactors>
): EarlyPayoffResult {
  const safeTerm = Math.max(1, termMonths);
  const safeMonth = Math.min(safeTerm, Math.max(1, month));
  const factor = customFactors?.[safeTerm] ?? DEFAULT_FACTORS[safeTerm] ?? 0.1062;

  const monthlyQuota = Math.round(financedAmount * factor);
  const totalOriginalFinanced = monthlyQuota * safeTerm;
  const totalOriginalInterest = Math.max(0, totalOriginalFinanced - financedAmount);

  const previousMonthsPaid = safeMonth - 1;
  const amountAlreadyPaid = monthlyQuota * previousMonthsPaid;

  let totalRequiredForEarlyClose = 0;

  if (safeMonth === safeTerm) {
    // Si es el último mes, se cancela la deuda completa normal
    totalRequiredForEarlyClose = totalOriginalFinanced;
  } else if (mode === 'proportional') {
    // Modalidad 1: Interés Devengado Proporcional (Regla habitual de Almacén)
    // El cliente solo paga los intereses correspondientes a los meses que usó el dinero
    const earnedInterest = Math.round(totalOriginalInterest * (safeMonth / safeTerm));
    totalRequiredForEarlyClose = financedAmount + earnedInterest;
  } else if (mode === 'bracket') {
    // Modalidad 2: Ajuste al factor de tramo de ROES
    let bracketTerm = 6;
    if (safeMonth <= 6) bracketTerm = 6;
    else if (safeMonth <= 12) bracketTerm = 12;
    else if (safeMonth <= 18) bracketTerm = 18;
    else if (safeMonth <= 20) bracketTerm = 20;
    else bracketTerm = 24;

    const bracketFactor = customFactors?.[bracketTerm] ?? DEFAULT_FACTORS[bracketTerm] ?? factor;
    const bracketTotal = Math.round(financedAmount * bracketFactor * bracketTerm);
    const bracketInterest = Math.max(0, bracketTotal - financedAmount);
    const earnedBracketInterest = Math.round(bracketInterest * (safeMonth / bracketTerm));
    totalRequiredForEarlyClose = financedAmount + earnedBracketInterest;
  } else {
    // Modalidad 3: Amortización Francesa estricta (Saldo Insoluto de Capital)
    const r = calculateImplicitMonthlyRate(factor, safeTerm);
    if (r <= 0) {
      totalRequiredForEarlyClose = Math.round(financedAmount * (safeMonth / safeTerm));
    } else {
      let balance = financedAmount;
      for (let m = 1; m < safeMonth; m++) {
        const intPart = balance * r;
        const prinPart = monthlyQuota - intPart;
        balance = Math.max(0, balance - prinPart);
      }
      // En el mes M se abona el saldo restante más los intereses de ese último mes
      totalRequiredForEarlyClose = amountAlreadyPaid + Math.round(balance);
    }
  }

  // Pago que debe desembolsar hoy en el mes M
  const payoffToday = Math.max(0, totalRequiredForEarlyClose - amountAlreadyPaid);
  // Ahorro total en intereses con respecto a llegar al vencimiento final
  const interestSavings = Math.max(0, totalOriginalFinanced - totalRequiredForEarlyClose);
  const savingsPercent = totalOriginalFinanced > 0 ? (interestSavings / totalOriginalFinanced) * 100 : 0;

  return {
    month: safeMonth,
    termMonths: safeTerm,
    monthlyQuota,
    previousMonthsPaid,
    amountAlreadyPaid,
    payoffToday,
    totalPaidAtEnd: amountAlreadyPaid + payoffToday,
    interestSavings,
    savingsPercent,
    mode,
  };
}

/**
 * Genera la tabla completa de amortización y liquidación mes por mes.
 */
export function generateAmortizationSchedule(
  financedAmount: number,
  termMonths: number,
  mode: EarlyPayoffMode = 'proportional',
  customFactors?: Partial<CreditFactors>
): AmortizationRow[] {
  const factor = customFactors?.[termMonths] ?? DEFAULT_FACTORS[termMonths] ?? 0.1062;
  const monthlyQuota = Math.round(financedAmount * factor);
  const r = calculateImplicitMonthlyRate(factor, termMonths);

  let currentBalance = financedAmount;
  const rows: AmortizationRow[] = [];

  for (let m = 1; m <= termMonths; m++) {
    const interestPart = Math.round(currentBalance * r);
    const principalPart = m === termMonths ? currentBalance : Math.min(currentBalance, Math.max(0, monthlyQuota - interestPart));
    currentBalance = Math.max(0, currentBalance - principalPart);

    const early = calculateEarlyPayoff(financedAmount, termMonths, m, mode, customFactors);

    rows.push({
      month: m,
      quota: monthlyQuota,
      principal: principalPart,
      interest: interestPart,
      remainingBalance: currentBalance,
      accumulatedPaid: early.amountAlreadyPaid,
      payoffToClose: early.payoffToday,
      savingsIfClosed: early.interestSavings,
    });
  }

  return rows;
}

/**
 * Calcula la capacidad máxima de compra / financiamiento a partir de un presupuesto de cuota mensual deseado.
 */
export function calculateMaxAffordable(
  monthlyBudget: number,
  termMonths: number,
  downPayment: number = 0,
  customFactors?: Partial<CreditFactors>
): { maxFinanced: number; maxPrice: number } {
  const factor = customFactors?.[termMonths] ?? DEFAULT_FACTORS[termMonths] ?? 0.1062;
  if (factor <= 0) return { maxFinanced: 0, maxPrice: downPayment };

  const maxFinanced = Math.round(monthlyBudget / factor);
  const maxPrice = maxFinanced + Math.max(0, downPayment);

  return { maxFinanced, maxPrice };
}

/**
 * Formatea cantidades numéricas con moneda (₡ CRC o $ USD) para texto plano (WhatsApp/Export).
 */
export function formatCurrency(amount: number, currency: string = '₡'): string {
  const rounded = Math.round(amount || 0);
  const formatted = rounded.toLocaleString('en-US');
  return `${currency}${formatted}`;
}
