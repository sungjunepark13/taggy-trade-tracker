import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/context/FinanceContext';
import { Download } from 'lucide-react';

export const DataExport: React.FC = () => {
  const { state } = useFinance();

  const exportToCSV = () => {
    const snapshots = state.snapshots;

    // Create CSV headers
    const headers = [
      'Month',
      'Year',
      'Annual Gross',
      '401k Rate',
      '401k Monthly',
      'Employer Match',
      'Fed Tax Monthly',
      'State Tax Monthly',
      'FICA Monthly',
      'Net Take Home Monthly',
      'Fixed Expenses',
      'Debt Minimums',
      'Goal Budget',
      'Alloc Earnest',
      'Alloc EF Starter',
      'Alloc Debt Avalanche',
      'Alloc Down Payment',
      'Alloc EF Final',
      'Alloc Retirement Extra',
      'Earnest Balance',
      'Emergency Fund Balance',
      'Down Payment Balance',
      'Debt Private 10%',
      'Debt Student 7%',
      'Debt Private 0%',
      'Total Debt',
      'Retirement Base',
      'Retirement Extra',
      'Retirement Total',
      'Primary Allocation',
      'Milestone'
    ].join(',');

    // Create CSV rows
    const rows = snapshots.map(s => [
      s.month,
      s.year,
      s.annualGross,
      s.employee401kRate,
      s.employee401kMonthly.toFixed(2),
      s.employerMatchMonthly.toFixed(2),
      s.fedTaxMonthly.toFixed(2),
      s.stateTaxMonthly.toFixed(2),
      s.ficaMonthly.toFixed(2),
      s.netTakeHomeMonthly.toFixed(2),
      s.monthlyExpenses.toFixed(2),
      s.debtMinimumsPaidMonthly.toFixed(2),
      s.goalBudgetDynamicMonthly.toFixed(2),
      s.allocEarnest.toFixed(2),
      s.allocEFStarter.toFixed(2),
      s.allocDebtAvalanche.toFixed(2),
      s.allocDownPayment.toFixed(2),
      s.allocEFFinal.toFixed(2),
      s.allocRetirementExtra.toFixed(2),
      s.earnest.toFixed(2),
      s.emergencyFund.toFixed(2),
      s.downPayment.toFixed(2),
      s.debtPrivate10.toFixed(2),
      s.debtStudent7.toFixed(2),
      s.debtPrivate0.toFixed(2),
      s.totalDebt.toFixed(2),
      s.retirementBalanceBase.toFixed(2),
      s.retirementBalanceExtra.toFixed(2),
      s.retirementBalanceTotal.toFixed(2),
      `"${s.primaryAllocLabel}"`,
      `"${s.milestone}"`
    ].join(','));

    const csv = [headers, ...rows].join('\n');

    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_plan_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportReconciliation = () => {
    const reconciliation = state.reconciliation;

    // Create CSV for reconciliation
    const headers = [
      'Year',
      'Annual Gross',
      'Employee 401k',
      'Employer Match',
      'Federal Tax',
      'State Tax',
      'FICA',
      'Net Take Home',
      'Expenses',
      'Debt Minimums',
      'Goal Budget Used',
      'Total Used',
      'Difference',
      'Check Passed'
    ].join(',');

    const rows = reconciliation.map(({ year, data }) => [
      year,
      data.annualGross.toFixed(2),
      data.employee401k.toFixed(2),
      data.employerMatch.toFixed(2),
      data.fedTax.toFixed(2),
      data.stateTax.toFixed(2),
      data.fica.toFixed(2),
      data.netTakeHome.toFixed(2),
      data.expenses.toFixed(2),
      data.debtMinimums.toFixed(2),
      data.goalBudgetUsed.toFixed(2),
      data.totalUsed.toFixed(2),
      data.difference.toFixed(2),
      data.checkPassed ? 'Yes' : 'No'
    ].join(','));

    const csv = [headers, ...rows].join('\n');

    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reconciliation_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Monthly Data (CSV)
        </Button>
        <Button onClick={exportReconciliation} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Reconciliation (CSV)
        </Button>
      </CardContent>
    </Card>
  );
};