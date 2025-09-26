import { FinancialEngine } from './src/utils/financialEngine';

const engine = new FinancialEngine();
const snapshots = engine.simulate();

// Check trust fund values at key months
const checkMonths = [12, 24, 36, 48, 60];

console.log('Trust Fund Progression:');
console.log('=======================');

checkMonths.forEach(month => {
  const snapshot = snapshots[month - 1];
  if (snapshot) {
    console.log(`Month ${month}: $${snapshot.trustFund.toFixed(2)}`);
  }
});

// Check final value at month 60
const finalSnapshot = snapshots[59]; // Month 60 (0-indexed)
const targetReached = finalSnapshot && finalSnapshot.trustFund >= 50000;

console.log('\n=======================');
console.log(`Target: $50,000`);
console.log(`Actual at Month 60: $${finalSnapshot ? finalSnapshot.trustFund.toFixed(2) : 'N/A'}`);
console.log(`Target Reached: ${targetReached ? 'YES ✓' : 'NO ✗'}`);

// Also check house fund impact
console.log('\nHouse Fund at Month 60: $' + (finalSnapshot ? finalSnapshot.downPayment.toFixed(2) : 'N/A'));