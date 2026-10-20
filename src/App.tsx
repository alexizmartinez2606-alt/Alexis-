/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CurrencySymbol, QuoteHistoryItem } from './types.ts';
import {
  CreditFactors,
  DEFAULT_FACTORS,
  EarlyPayoffMode,
  calculateCredit,
  calculateEarlyPayoff,
  formatCurrency,
} from './utils/finance.ts';

import { Header } from './components/Header.tsx';
import { SaleInputCard } from './components/SaleInputCard.tsx';
import { TermsComparator } from './components/TermsComparator.tsx';
import { ExecutiveSummaryCard } from './components/ExecutiveSummaryCard.tsx';
import { EarlyPayoffModal } from './components/EarlyPayoffModal.tsx';
import { FactorsModal } from './components/FactorsModal.tsx';
import { ReverseBudgetModal } from './components/ReverseBudgetModal.tsx';
import { FormalQuotePrintModal } from './components/FormalQuotePrintModal.tsx';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { Toast } from './components/Toast.tsx';

const FACTORS_STORAGE_KEY = 'roes_credit_factors_v3';
const HISTORY_STORAGE_KEY = 'roes_credit_history_v3';

export default function App() {
  const [currency, setCurrency] = useState<CurrencySymbol>('₡');
  const [clientName, setClientName] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [price, setPrice] = useState<number>(250000);
  const [downPayment, setDownPayment] = useState<number>(50000);
  const [selectedTerm, setSelectedTerm] = useState<number>(12);
  const [earlyMonth, setEarlyMonth] = useState<number>(6);
  const [earlyMode, setEarlyMode] = useState<EarlyPayoffMode>('proportional');

  // Load factors from localStorage or fallback to DEFAULT_FACTORS with 18M (0.0787) and 20M (0.0600)
  const [factors, setFactors] = useState<CreditFactors>(() => {
    try {
      const saved = localStorage.getItem(FACTORS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[18] === 0.0789) {
          parsed[18] = 0.0787;
        }
        if (!parsed[20]) {
          parsed[20] = 0.0600;
        }
        return { ...DEFAULT_FACTORS, ...parsed };
      }
    } catch {
      // Fallback
    }
    return { ...DEFAULT_FACTORS };
  });

  // History state
  const [history, setHistory] = useState<QuoteHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Modals state
  const [isEarlyPayoffOpen, setIsEarlyPayoffOpen] = useState(false);
  const [isFactorsModalOpen, setIsFactorsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isFormalQuoteOpen, setIsFormalQuoteOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: '',
    message: '',
  });

  const showToast = (title: string, message: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  // Sync factors to storage
  const handleSaveFactors = (newFactors: CreditFactors) => {
    setFactors(newFactors);
    try {
      localStorage.setItem(FACTORS_STORAGE_KEY, JSON.stringify(newFactors));
    } catch {
      // Ignore storage error
    }
    showToast('Factores Guardados', 'Factores oficiales actualizados con éxito.');
  };

  // Handle term select
  const handleSelectTerm = (term: number) => {
    setSelectedTerm(term);
    if (earlyMonth >= term) {
      setEarlyMonth(Math.max(1, Math.floor(term / 2)));
    }
  };

  // Copy quote for WhatsApp
  const handleCopyWhatsApp = () => {
    const financed = Math.max(0, price - downPayment);
    const calc = calculateCredit(price, downPayment, selectedTerm, factors);
    const early = calculateEarlyPayoff(financed, selectedTerm, earlyMonth, earlyMode, factors);

    const lines: string[] = [];
    lines.push('🔷 *ALMACÉN ROES NARANJO*');
    lines.push('*Cotización Oficial de Crédito*');
    lines.push('────────────────────');
    if (clientName.trim()) lines.push(`👤 *Cliente:* ${clientName.trim()}`);
    if (productName.trim()) lines.push(`📦 *Artículo:* ${productName.trim()}`);
    lines.push(`💰 *Precio de Contado:* ${formatCurrency(price, currency)}`);
    lines.push(`💵 *Prima Inicial:* ${formatCurrency(downPayment, currency)}`);
    lines.push(`📊 *Saldo a Financiar:* ${formatCurrency(financed, currency)}`);
    lines.push('────────────────────');
    lines.push(`✅ *PLAN SELECCIONADO: ${selectedTerm} MESES*`);
    lines.push(`💳 *Cuota Mensual Fija:* *${formatCurrency(calc.monthlyQuota, currency)}*`);
    lines.push(
      `📈 *Factor Aplicado:* ${calc.factor}${
        selectedTerm === 20 ? ' (Fórmula 1% Especial)' : selectedTerm === 18 ? ' (Fórmula Exacta)' : ''
      }`
    );
    lines.push(`💵 *Total en Cuotas:* ${formatCurrency(calc.totalFinanced, currency)}`);
    lines.push('────────────────────');
    lines.push(`⚡ *Opción de Cancelación Anticipada en Mes ${earlyMonth}:*`);
    lines.push(`• Abonado previo: ${formatCurrency(early.amountAlreadyPaid, currency)}`);
    lines.push(`• Monto para finiquitar en Mes ${earlyMonth}: *${formatCurrency(early.payoffToday, currency)}*`);
    lines.push(`• *Ahorro cliente en intereses:* *${formatCurrency(early.interestSavings, currency)}*`);
    lines.push('────────────────────');
    lines.push('_Opciones en otros plazos disponibles:_');
    [6, 12, 18, 20, 24].forEach((t) => {
      if (t !== selectedTerm) {
        const altCalc = calculateCredit(price, downPayment, t, factors);
        lines.push(`• A ${t} meses: ${formatCurrency(altCalc.monthlyQuota, currency)} /mes (Factor ${altCalc.factor})`);
      }
    });

    const fullText = lines.join('\n');

    // Clipboard copy with robust fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(
        () => showToast('¡Cotización Copiada!', 'Texto listo para pegar en WhatsApp.'),
        () => fallbackCopy(fullText)
      );
    } else {
      fallbackCopy(fullText);
    }
  };

  const fallbackCopy = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('¡Cotización Copiada!', 'Texto listo para pegar en WhatsApp.');
  };

  // Save to quote history
  const handleSaveHistory = () => {
    const calc = calculateCredit(price, downPayment, selectedTerm, factors);
    const now = new Date();
    const newItem: QuoteHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
      clientName: clientName.trim(),
      productName: productName.trim(),
      price,
      downPayment,
      selectedTerm,
      monthlyQuota: calc.monthlyQuota,
      currency,
    };

    const updated = [newItem, ...history.slice(0, 19)];
    setHistory(updated);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    showToast('Guardado en Historial', 'Cotización almacenada para rápida consulta.');
  };

  const handleLoadHistoryItem = (item: QuoteHistoryItem) => {
    setClientName(item.clientName);
    setProductName(item.productName);
    setPrice(item.price);
    setDownPayment(item.downPayment);
    setSelectedTerm(item.selectedTerm);
    setCurrency(item.currency);
    showToast('Cotización Cargada', 'Datos aplicados en el simulador.');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const filtered = history.filter((h) => h.id !== id);
    setHistory(filtered);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // Ignore
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore
    }
    showToast('Historial Vaciado', 'Se han eliminado los registros temporales.');
  };

  // Reset entire calculator
  const handleReset = () => {
    setClientName('');
    setProductName('');
    setPrice(250000);
    setDownPayment(50000);
    setSelectedTerm(12);
    setEarlyMonth(6);
    setEarlyMode('proportional');
    showToast('Calculadora Reiniciada', 'Valores restaurados por defecto.');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-cyan-500 selection:text-white pb-12">
      {/* Top Navigation with Official ROES Logo */}
      <Header
        currency={currency}
        onSetCurrency={setCurrency}
        onOpenFactorsModal={() => setIsFactorsModalOpen(true)}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenFormalQuote={() => setIsFormalQuoteOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenEarlyPayoff={() => setIsEarlyPayoffOpen(true)}
        historyCount={history.length}
        onReset={handleReset}
      />

      {/* Main Content: Clean, High-Aesthetic Two-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 Cols): Sale Data & Term Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Datos de la Venta */}
            <SaleInputCard
              clientName={clientName}
              productName={productName}
              price={price}
              downPayment={downPayment}
              currency={currency}
              onClientNameChange={setClientName}
              onProductNameChange={setProductName}
              onPriceChange={setPrice}
              onDownPaymentChange={setDownPayment}
            />

            {/* 2. Selector Comparativo de Plazos (6, 12, 18, 20, 24 Meses) */}
            <TermsComparator
              price={price}
              downPayment={downPayment}
              selectedTerm={selectedTerm}
              factors={factors}
              currency={currency}
              onSelectTerm={handleSelectTerm}
            />
          </div>

          {/* Right Column (5 Cols): Active Plan Executive Summary */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            <ExecutiveSummaryCard
              price={price}
              downPayment={downPayment}
              selectedTerm={selectedTerm}
              factors={factors}
              currency={currency}
              onCopyWhatsApp={handleCopyWhatsApp}
              onPrint={() => setIsFormalQuoteOpen(true)}
              onSaveHistory={handleSaveHistory}
              onOpenEarlyPayoff={() => setIsEarlyPayoffOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Dedicated Early Payoff & Amortization Modal Window */}
      <EarlyPayoffModal
        isOpen={isEarlyPayoffOpen}
        onClose={() => setIsEarlyPayoffOpen(false)}
        price={price}
        downPayment={downPayment}
        selectedTerm={selectedTerm}
        earlyMonth={earlyMonth}
        earlyMode={earlyMode}
        factors={factors}
        currency={currency}
        onEarlyMonthChange={setEarlyMonth}
        onEarlyModeChange={setEarlyMode}
      />

      {/* Other Modals & Drawers */}
      <FactorsModal
        isOpen={isFactorsModalOpen}
        factors={factors}
        onClose={() => setIsFactorsModalOpen(false)}
        onSaveFactors={handleSaveFactors}
      />

      <ReverseBudgetModal
        isOpen={isBudgetModalOpen}
        currency={currency}
        factors={factors}
        onClose={() => setIsBudgetModalOpen(false)}
        onApplyCalculated={(newPrice, newDown, term) => {
          setPrice(newPrice);
          setDownPayment(newDown);
          handleSelectTerm(term);
          showToast('Presupuesto Aplicado', `Financiamiento a ${term} meses configurado.`);
        }}
      />

      <FormalQuotePrintModal
        isOpen={isFormalQuoteOpen}
        clientName={clientName}
        productName={productName}
        price={price}
        downPayment={downPayment}
        selectedTerm={selectedTerm}
        factors={factors}
        currency={currency}
        onClose={() => setIsFormalQuoteOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onLoadItem={handleLoadHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />

      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
      />
    </div>
  );
}
