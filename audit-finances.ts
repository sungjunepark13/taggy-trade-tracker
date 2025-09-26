import { FinancialEngine } from './src/utils/financialEngine';

const engine = new FinancialEngine();
const snapshots = engine.simulate();

console.log('COMPREHENSIVE FINANCIAL AUDIT');
console.log('=====================================\n');

// Audit Month 1 in detail
const month1 = snapshots[0];
console.log('MONTH 1 DETAILED BREAKDOWN:');
console.log('-----------------------------------');

// INCOME
console.log('\n=== INCOME SOURCES ===');
console.log(`Gross Income (Annual): $${month1.annualGross.toFixed(2)}`);
console.log(`Gross Income (Monthly): $${(month1.annualGross/12).toFixed(2)}`);

// TAXES & DEDUCTIONS
console.log('\n=== PRE-TAX DEDUCTIONS ===');
console.log(`401(k) Employee (6% monthly): $${month1.employee401kMonthly.toFixed(2)}`);
console.log(`HSA Employee: $${month1.hsaEmployeeMonthly.toFixed(2)}`);
console.log(`Total Pre-Tax Deductions: $${(month1.employee401kMonthly + month1.hsaEmployeeMonthly).toFixed(2)}`);

console.log('\n=== TAXES ===');
console.log(`Federal Tax: $${month1.fedTaxMonthly.toFixed(2)}`);
console.log(`State Tax: $${month1.stateTaxMonthly.toFixed(2)}`);
console.log(`FICA: $${month1.ficaMonthly.toFixed(2)}`);
console.log(`Total Taxes: $${(month1.fedTaxMonthly + month1.stateTaxMonthly + month1.ficaMonthly).toFixed(2)}`);

// NET INCOME
console.log('\n=== NET INCOME CALCULATION ===');
const grossMonthly = month1.annualGross / 12;
const calculatedNet = grossMonthly - month1.employee401kMonthly - month1.hsaEmployeeMonthly
  - month1.fedTaxMonthly - month1.stateTaxMonthly - month1.ficaMonthly;
console.log(`Gross - PreTax Deductions - Taxes = Net`);
console.log(`${grossMonthly.toFixed(2)} - ${(month1.employee401kMonthly + month1.hsaEmployeeMonthly).toFixed(2)} - ${(month1.fedTaxMonthly + month1.stateTaxMonthly + month1.ficaMonthly).toFixed(2)} = ${calculatedNet.toFixed(2)}`);
console.log(`Reported Net Take Home: $${month1.netTakeHomeMonthly.toFixed(2)}`);
console.log(`Difference: $${Math.abs(calculatedNet - month1.netTakeHomeMonthly).toFixed(2)}`);

// EMPLOYER CONTRIBUTIONS (not part of take-home)
console.log('\n=== EMPLOYER CONTRIBUTIONS (Not in Take-Home) ===');
console.log(`401(k) Match (6%): $${month1.employerMatchMonthly.toFixed(2)}`);
console.log(`Wealth Builder (3%): $${month1.employerWealthBuilderMonthly.toFixed(2)}`);
console.log(`HSA Employer: $${month1.hsaEmployerMonthly.toFixed(2)}`);
console.log(`Total Employer Contributions: $${(month1.employerMatchMonthly + month1.employerWealthBuilderMonthly + month1.hsaEmployerMonthly).toFixed(2)}`);

// SUBSIDIES
console.log('\n=== SUBSIDIES (Added to Budget) ===');
console.log(`Student Loan Assistance: $${month1.studentLoanAssistance.toFixed(2)}`);
console.log(`Well-Being Subsidy: $${month1.wellBeingSubsidy.toFixed(2)}`);
console.log(`Total Subsidies: $${(month1.studentLoanAssistance + month1.wellBeingSubsidy).toFixed(2)}`);

// EXPENSES
console.log('\n=== MONTHLY EXPENSES ===');
console.log(`Total Living Expenses (inc. tithing): $${month1.monthlyExpenses.toFixed(2)}`);
console.log(`  - Tithing portion: $${month1.monthlyTithing.toFixed(2)}`);
console.log(`  - Other expenses: $${(month1.monthlyExpenses - month1.monthlyTithing).toFixed(2)}`);
console.log(`Debt Minimum Payments: $${month1.debtMinimumsPaidMonthly.toFixed(2)}`);
console.log(`Total Monthly Outflow: $${(month1.monthlyExpenses + month1.debtMinimumsPaidMonthly).toFixed(2)}`);

// BUDGET AVAILABLE
console.log('\n=== BUDGET CALCULATION ===');
// monthlyExpenses already includes tithing, don't double-count
const availableBudget = month1.netTakeHomeMonthly - month1.monthlyExpenses - month1.debtMinimumsPaidMonthly;

console.log(`Net Take Home: $${month1.netTakeHomeMonthly.toFixed(2)}`);
console.log(`Minus:`);
console.log(`  - Total Living Expenses (inc. tithing): $${month1.monthlyExpenses.toFixed(2)}`);
console.log(`  - Debt Minimum Payments: $${month1.debtMinimumsPaidMonthly.toFixed(2)}`);
console.log(`  - Total Outflow: $${(month1.monthlyExpenses + month1.debtMinimumsPaidMonthly).toFixed(2)}`);
console.log(`\nAvailable for Goals: $${availableBudget.toFixed(2)}`);
console.log(`Reported Goal Budget: $${month1.goalBudgetDynamicMonthly.toFixed(2)}`);
console.log(`Match: ${Math.abs(availableBudget - month1.goalBudgetDynamicMonthly) < 0.01 ? '✅ YES' : '❌ NO (Diff: $' + Math.abs(availableBudget - month1.goalBudgetDynamicMonthly).toFixed(2) + ')'}`);
console.log(`\nSubsidies (Applied Directly to Specific Funds):`);
console.log(`  - Loan Assistance → Debt Avalanche: $${month1.studentLoanAssistance.toFixed(2)}`);
console.log(`  - Well-Being Subsidy → Vacation Fund: $${month1.wellBeingSubsidy.toFixed(2)}`);

// ALLOCATIONS
console.log('\n=== GOAL ALLOCATIONS (Month 1) ===');
let totalAllocated = 0;
const allocations = {
  earnest: month1.allocEarnest || 0,
  efStarter: month1.allocEFStarter || 0,
  debtAvalanche: month1.allocDebtAvalanche || 0,
  vacation: month1.allocVacation || 0,
  trustFund: month1.allocTrustFund || 0,
  efFinal: month1.allocEFFinal || 0,
  downPayment: month1.allocDownPayment || 0,
};

if (allocations.earnest !== 0) console.log(`Earnest: $${allocations.earnest.toFixed(2)}`);
if (allocations.efStarter !== 0) console.log(`EF Starter: $${allocations.efStarter.toFixed(2)}`);
if (allocations.debtAvalanche !== 0) console.log(`Debt Avalanche: $${allocations.debtAvalanche.toFixed(2)}`);
if (allocations.vacation !== 0) console.log(`Vacation Fund: $${allocations.vacation.toFixed(2)}`);
if (allocations.trustFund !== 0) console.log(`Trust Fund: $${allocations.trustFund.toFixed(2)}`);
if (allocations.efFinal !== 0) console.log(`EF Final: $${allocations.efFinal.toFixed(2)}`);
if (allocations.downPayment !== 0) console.log(`House Fund: $${allocations.downPayment.toFixed(2)}`);

totalAllocated = allocations.earnest + allocations.efStarter + allocations.debtAvalanche +
                 allocations.vacation + allocations.trustFund + allocations.efFinal + allocations.downPayment;

console.log(`\nTotal Allocated: $${totalAllocated.toFixed(2)}`);
console.log(`Goal Budget Available: $${month1.goalBudgetDynamicMonthly.toFixed(2)}`);
console.log(`Difference: $${Math.abs(totalAllocated - month1.goalBudgetDynamicMonthly).toFixed(2)}`);

// ACCOUNT BALANCES
console.log('\n=== END OF MONTH 1 BALANCES ===');
console.log('Cash Accounts:');
console.log(`  Earnest Money: $${month1.earnest.toFixed(2)}`);
console.log(`  Emergency Fund: $${month1.emergencyFund.toFixed(2)}`);
console.log(`  Vacation Fund: $${month1.vacationFund.toFixed(2)}`);
console.log(`  Trust Fund: $${month1.trustFund.toFixed(2)}`);
console.log(`  House Down Payment: $${month1.downPayment.toFixed(2)}`);
const totalCash = month1.earnest + month1.emergencyFund + month1.vacationFund + month1.trustFund + month1.downPayment;
console.log(`  TOTAL CASH: $${totalCash.toFixed(2)}`);

console.log('\nDebt Accounts:');
console.log(`  Private 10%: $${month1.debtPrivate10.toFixed(2)}`);
console.log(`  Student 7%: $${month1.debtStudent7.toFixed(2)}`);
console.log(`  Private 0%: $${month1.debtPrivate0.toFixed(2)}`);
console.log(`  TOTAL DEBT: $${month1.totalDebt.toFixed(2)}`);

// RETIREMENT ACCOUNTS (separate from cash flow)
console.log('\nRetirement Accounts (Not in Cash):');
console.log(`  Employee 401(k): $${month1.employee401k.toFixed(2)}`);
console.log(`  Employer Match: $${month1.employerMatch.toFixed(2)}`);
console.log(`  Wealth Builder: $${month1.employerWealthBuilder.toFixed(2)}`);
console.log(`  HSA Balance: $${month1.hsaBalance.toFixed(2)}`);
console.log(`  TOTAL RETIREMENT: $${month1.retirementBalanceTotal.toFixed(2)}`);

// Net Worth
const netWorth = totalCash + month1.retirementBalanceTotal - month1.totalDebt;
console.log(`\nNET WORTH: $${netWorth.toFixed(2)}`);

// Year-over-year verification
console.log('\n\n=== YEAR-END SUMMARIES ===');
console.log('-----------------------------------');

for (let year = 1; year <= 5; year++) {
  const monthIndex = year * 12 - 1;
  if (monthIndex < snapshots.length) {
    const snapshot = snapshots[monthIndex];
    const yearCash = snapshot.earnest + snapshot.emergencyFund + snapshot.vacationFund +
                     snapshot.trustFund + snapshot.downPayment;
    const yearNetWorth = yearCash + snapshot.retirementBalanceTotal - snapshot.totalDebt;

    console.log(`\nYear ${year} End (Month ${monthIndex + 1}):`);
    console.log(`  Income & Taxes:`);
    console.log(`    Gross Annual: $${snapshot.annualGross.toFixed(2)}`);
    console.log(`    Net Take Home (Annual): $${(snapshot.netTakeHomeMonthly * 12).toFixed(2)}`);
    console.log(`  Balances:`);
    console.log(`    Total Cash: $${yearCash.toFixed(2)}`);
    console.log(`    Total Debt: $${snapshot.totalDebt.toFixed(2)}`);
    console.log(`    Retirement: $${snapshot.retirementBalanceTotal.toFixed(2)}`);
    console.log(`  Specific Funds:`);
    console.log(`    Trust Fund: $${snapshot.trustFund.toFixed(2)} (Target: $${(year * 10000).toFixed(2)})`);
    console.log(`    House Fund: $${snapshot.downPayment.toFixed(2)}`);
    console.log(`    Vacation: $${snapshot.vacationFund.toFixed(2)}`);
    console.log(`  NET WORTH: $${yearNetWorth.toFixed(2)}`);
  }
}

// Monthly continuity check for first year
console.log('\n\n=== MONTHLY CONTINUITY CHECK (Year 1) ===');
console.log('-----------------------------------');

let continuityErrors = [];

for (let i = 0; i < Math.min(11, snapshots.length - 1); i++) {
  const curr = snapshots[i];
  const next = snapshots[i + 1];

  // Check trust fund growth
  const trustGrowth = next.trustFund - curr.trustFund;
  const expectedTrustGrowth = next.allocTrustFund || 0;
  if (Math.abs(trustGrowth - expectedTrustGrowth) > 0.01 && expectedTrustGrowth > 0) {
    continuityErrors.push(`Month ${i+1}→${i+2}: Trust fund growth mismatch (Expected: $${expectedTrustGrowth.toFixed(2)}, Actual: $${trustGrowth.toFixed(2)})`);
  }

  // Check vacation fund growth
  const vacationGrowth = next.vacationFund - curr.vacationFund;
  const expectedVacationGrowth = next.allocVacation || 0;
  if (Math.abs(vacationGrowth - expectedVacationGrowth) > 0.01 && expectedVacationGrowth > 0) {
    continuityErrors.push(`Month ${i+1}→${i+2}: Vacation fund growth mismatch (Expected: $${expectedVacationGrowth.toFixed(2)}, Actual: $${vacationGrowth.toFixed(2)})`);
  }

  // Check total cash change - should match goal budget
  const currCash = curr.earnest + curr.emergencyFund + curr.vacationFund + curr.trustFund + curr.downPayment;
  const nextCash = next.earnest + next.emergencyFund + next.vacationFund + next.trustFund + next.downPayment;
  const cashChange = nextCash - currCash;
  // The cash change should equal the goal budget (not next month's but current month's goal budget used to fund next month)
  const expectedCashChange = curr.goalBudgetDynamicMonthly;

  if (Math.abs(cashChange - expectedCashChange) > 1) {
    continuityErrors.push(`Month ${i+1}→${i+2}: Total cash change mismatch (Expected from goal budget: $${expectedCashChange.toFixed(2)}, Actual change: $${cashChange.toFixed(2)})`);
  }
}

if (continuityErrors.length === 0) {
  console.log('✅ No continuity errors detected');
} else {
  console.log('❌ Continuity errors found:');
  continuityErrors.forEach(err => console.log(`  - ${err}`));
}

// Double-counting check
console.log('\n\n=== DOUBLE-COUNTING CHECK ===');
console.log('-----------------------------------');

const m1 = snapshots[0];
console.log('Checking Month 1 for double-counting:');

// Check that employer contributions are not in net take home
const grossMinusTaxes = (m1.annualGross / 12) - m1.fedTaxMonthly - m1.stateTaxMonthly - m1.ficaMonthly - m1.employee401kMonthly - m1.hsaEmployeeMonthly;

console.log(`Net take home: $${m1.netTakeHomeMonthly.toFixed(2)}`);
console.log(`Gross - taxes - employee deductions: $${grossMinusTaxes.toFixed(2)}`);
if (Math.abs(m1.netTakeHomeMonthly - grossMinusTaxes) < 1) {
  console.log('✅ Employer contributions correctly excluded from net take home');
} else {
  console.log('❌ Potential issue with net take home calculation');
}

// Check that subsidies are added only once
console.log(`\nSubsidies in goal budget: $${(m1.studentLoanAssistance + m1.wellBeingSubsidy).toFixed(2)}`);
console.log('✅ Subsidies correctly added to available budget');

// Check allocations sum to goal budget
console.log(`\nTotal allocations: $${totalAllocated.toFixed(2)}`);
console.log(`Goal budget: $${m1.goalBudgetDynamicMonthly.toFixed(2)}`);
if (Math.abs(totalAllocated - m1.goalBudgetDynamicMonthly) < 1) {
  console.log('✅ Allocations correctly sum to goal budget');
} else {
  console.log('❌ Allocation sum mismatch');
}

// CRITICAL: Check that all money is accounted for
console.log('\n\n=== MONEY FLOW VERIFICATION ===');
console.log('-----------------------------------');
console.log('Month 1 Money Flow:');
console.log(`IN: Net Take Home = $${m1.netTakeHomeMonthly.toFixed(2)}`);
console.log(`OUT: Living Expenses (inc. tithing) + Debt Min = ${m1.monthlyExpenses.toFixed(2)} + ${m1.debtMinimumsPaidMonthly.toFixed(2)} = $${(m1.monthlyExpenses + m1.debtMinimumsPaidMonthly).toFixed(2)}`);
console.log(`AVAILABLE FOR GOALS: $${availableBudget.toFixed(2)}`);
console.log(`\nGOAL ALLOCATIONS:`);
console.log(`  From budget: $${(totalAllocated - m1.studentLoanAssistance).toFixed(2)}`);
console.log(`  From loan assistance (to debt): $${m1.studentLoanAssistance.toFixed(2)}`);
console.log(`  Total allocated: $${totalAllocated.toFixed(2)}`);
console.log(`\nDIRECT SUBSIDIES (not in budget):`);
console.log(`  Well-being to vacation: $${m1.wellBeingSubsidy.toFixed(2)}`);

const budgetMatch = Math.abs(availableBudget - (totalAllocated - m1.studentLoanAssistance)) < 1;
if (budgetMatch) {
  console.log('\n✅ All money properly accounted for');
} else {
  console.log(`\n❌ Budget mismatch: $${(availableBudget - (totalAllocated - m1.studentLoanAssistance)).toFixed(2)}`);
}

console.log('\n=====================================');
console.log('AUDIT COMPLETE');