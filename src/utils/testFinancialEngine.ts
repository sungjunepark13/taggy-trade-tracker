import { FinancialEngine } from './financialEngine';

// Test the financial engine with the provided scenario
export function testFinancialEngine() {
  console.log('Running Financial Engine Test...\n');

  const engine = new FinancialEngine();
  const snapshots = engine.simulate();
  const reconciliation = engine.getAnnualReconciliation();

  // Test key milestones
  console.log('=== KEY MILESTONES ===');
  const milestoneMonths: { [key: string]: number | null } = {
    'Earnest $15k reached': null,
    'EF $5k starter reached': null,
    'All debts paid off': null,
    'Down Payment $50k reached': null,
    'EF $20k final reached': null,
    '401k rate increased to 15%': null,
  };

  snapshots.forEach(snapshot => {
    if (snapshot.milestone) {
      const milestones = snapshot.milestone.split(', ');
      milestones.forEach(m => {
        if (milestoneMonths[m] === null) {
          milestoneMonths[m] = snapshot.month;
        }
      });
    }
  });

  Object.entries(milestoneMonths).forEach(([milestone, month]) => {
    console.log(`${milestone}: ${month ? `Month ${month}` : 'Not reached'}`);
  });

  // Test specific months
  console.log('\n=== SAMPLE MONTH DETAILS ===');
  const testMonths = [1, 12, 24, 36, 48, 60];

  testMonths.forEach(month => {
    const snapshot = snapshots[month - 1];
    if (snapshot) {
      console.log(`\nMonth ${month} (Year ${snapshot.year}):`);
      console.log(`  Annual Gross: $${snapshot.annualGross.toLocaleString()}`);
      console.log(`  401k Rate: ${(snapshot.employee401kRate * 100).toFixed(0)}%`);
      console.log(`  Net Take Home: $${snapshot.netTakeHomeMonthly.toFixed(2)}/mo`);
      console.log(`  Total Debt: $${snapshot.totalDebt.toLocaleString()}`);
      console.log(`  Emergency Fund: $${snapshot.emergencyFund.toFixed(0)}`);
      console.log(`  Down Payment: $${snapshot.downPayment.toFixed(0)}`);
      console.log(`  Retirement Total: $${snapshot.retirementBalanceTotal.toFixed(0)}`);
      console.log(`  Goal Budget: $${snapshot.goalBudgetDynamicMonthly.toFixed(2)}`);
      if (snapshot.primaryAllocLabel) {
        console.log(`  Active Goals: ${snapshot.primaryAllocLabel}`);
      }
    }
  });

  // Test reconciliation
  console.log('\n=== ANNUAL RECONCILIATION ===');
  reconciliation.forEach(({ year, data }) => {
    console.log(`\nYear ${year}:`);
    console.log(`  Gross Income: $${data.annualGross.toLocaleString()}`);
    console.log(`  Net Take Home: $${data.netTakeHome.toFixed(2)}`);
    console.log(`  Total Used: $${data.totalUsed.toFixed(2)}`);
    console.log(`  Difference: $${data.difference.toFixed(2)}`);
    console.log(`  Status: ${data.checkPassed ? '✓ PASSED' : '✗ FAILED'}`);
  });

  // Final state
  console.log('\n=== FINAL STATE (Month 60) ===');
  const finalSnapshot = snapshots[59];
  if (finalSnapshot) {
    console.log(`Total Debt Remaining: $${finalSnapshot.totalDebt.toFixed(2)}`);
    console.log(`Emergency Fund: $${finalSnapshot.emergencyFund.toFixed(2)}`);
    console.log(`Down Payment Saved: $${finalSnapshot.downPayment.toFixed(2)}`);
    console.log(`Earnest Money: $${finalSnapshot.earnest.toFixed(2)}`);
    console.log(`Total Retirement: $${finalSnapshot.retirementBalanceTotal.toFixed(2)}`);
    console.log(`  - Base (401k): $${finalSnapshot.retirementBalanceBase.toFixed(2)}`);
    console.log(`  - Extra: $${finalSnapshot.retirementBalanceExtra.toFixed(2)}`);
  }

  // Calculate total interest paid on debts
  console.log('\n=== DEBT ANALYSIS ===');
  const initialDebt = 140000; // $50k + $40k + $50k
  let totalPayments = 0;
  snapshots.forEach(s => {
    totalPayments += s.debtMinimumsPaidMonthly + s.allocDebtAvalanche;
  });
  const totalInterest = totalPayments - initialDebt;
  console.log(`Initial Total Debt: $${initialDebt.toLocaleString()}`);
  console.log(`Total Payments Made: $${totalPayments.toFixed(2)}`);
  console.log(`Total Interest Paid: $${totalInterest.toFixed(2)}`);

  // Verify all reconciliations pass
  const allPassed = reconciliation.every(r => r.data.checkPassed);
  console.log(`\n=== TEST RESULT ===`);
  console.log(`All reconciliations passed: ${allPassed ? '✓ YES' : '✗ NO'}`);

  return {
    snapshots,
    reconciliation,
    testPassed: allPassed
  };
}

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
  (window as any).testFinancialEngine = testFinancialEngine;
  console.log('Test function available: Run testFinancialEngine() in console');
}