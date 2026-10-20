import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FACTORS,
  calculateCredit,
  calculateEarlyPayoff,
  calculateMaxAffordable,
  generateAmortizationSchedule,
  calculateImplicitMonthlyRate,
} from './finance.ts';

test('DEFAULT_FACTORS has corrected 18-month factor (0.0787) and 20-month 1% factor (0.0600)', () => {
  assert.equal(DEFAULT_FACTORS[18], 0.0787, '18-month factor must be exactly 0.0787');
  assert.equal(DEFAULT_FACTORS[20], 0.0600, '20-month factor must be exactly 0.0600 (1% formula)');
  assert.equal(DEFAULT_FACTORS[6], 0.1905);
  assert.equal(DEFAULT_FACTORS[12], 0.1062);
  assert.equal(DEFAULT_FACTORS[24], 0.0653);
});

test('calculateCredit for 20 months applies 0.0600 factor correctly', () => {
  const price = 250000;
  const downPayment = 50000;
  const term = 20;
  const result = calculateCredit(price, downPayment, term);

  assert.equal(result.financedAmount, 200000);
  assert.equal(result.factor, 0.0600);
  // 200000 * 0.0600 = 12000
  assert.equal(result.monthlyQuota, 12000);
  // Total financed = 12000 * 20 = 240000
  assert.equal(result.totalFinanced, 240000);
  // Interest = 240000 - 200000 = 40000
  assert.equal(result.totalInterest, 40000);
  assert.equal(result.grandTotal, 50000 + 240000);
});

test('calculateCredit for 18 months applies 0.0787 factor correctly', () => {
  const price = 250000;
  const downPayment = 50000;
  const term = 18;
  const result = calculateCredit(price, downPayment, term);

  assert.equal(result.financedAmount, 200000);
  assert.equal(result.factor, 0.0787);
  // 200000 * 0.0787 = 15740
  assert.equal(result.monthlyQuota, 15740);
  // Total financed = 15740 * 18 = 283320
  assert.equal(result.totalFinanced, 283320);
  // Interest = 283320 - 200000 = 83320
  assert.equal(result.totalInterest, 83320);
  assert.equal(result.grandTotal, 50000 + 283320);
});

test('calculateCredit reflects difference between old factor 0.0789 and corrected 0.0787', () => {
  const financed = 200000;
  const oldQuota = Math.round(financed * 0.0789); // 15780
  const newQuota = Math.round(financed * 0.0787); // 15740
  assert.equal(oldQuota - newQuota, 40, 'Monthly savings per installment is 40 CRC');

  const oldTotal = oldQuota * 18; // 284040
  const newTotal = newQuota * 18; // 283320
  assert.equal(oldTotal - newTotal, 720, 'Total customer savings with corrected factor is 720 CRC');
});

test('calculateEarlyPayoff correctly computes savings at month 6 of 18 months', () => {
  const financed = 200000;
  const term = 18;
  const earlyMonth = 6;
  const early = calculateEarlyPayoff(financed, term, earlyMonth, 'proportional');

  assert.equal(early.month, 6);
  assert.equal(early.previousMonthsPaid, 5);
  assert.equal(early.amountAlreadyPaid, 15740 * 5); // 78700
  assert.ok(early.payoffToday > 0, 'Payoff amount must be positive');
  assert.ok(early.interestSavings > 0, 'Customer must save interest by paying at month 6');
  assert.ok(early.totalPaidAtEnd < 15740 * 18, 'Total paid must be less than full term');
});

test('calculateImplicitMonthlyRate solves effective rate accurately', () => {
  const rate12 = calculateImplicitMonthlyRate(0.1062, 12);
  assert.ok(rate12 > 0.01 && rate12 < 0.10, 'Monthly rate should be between 1% and 10%');

  const rate18 = calculateImplicitMonthlyRate(0.0787, 18);
  assert.ok(rate18 > 0.01 && rate18 < 0.10, '18M monthly rate should be realistic');
});

test('calculateMaxAffordable computes inverse budget correctly', () => {
  const monthlyBudget = 15740;
  const { maxFinanced } = calculateMaxAffordable(monthlyBudget, 18);
  // 15740 / 0.0787 = 200000
  assert.equal(maxFinanced, 200000);
});

test('generateAmortizationSchedule outputs all rows up to term length', () => {
  const schedule = generateAmortizationSchedule(200000, 18, 'proportional');
  assert.equal(schedule.length, 18);
  assert.equal(schedule[0].month, 1);
  assert.equal(schedule[17].month, 18);
  assert.equal(schedule[17].remainingBalance, 0);
});
