import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFinance } from '@/context/FinanceContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalculationTooltip } from '@/components/ui/calculation-tooltip';

export const FinancialDetails: React.FC = () => {
  const { state, getCurrentSnapshot } = useFinance();
  const snapshot = getCurrentSnapshot();

  if (!snapshot) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(0)}%`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Month</TabsTrigger>
          <TabsTrigger value="taxes">Tax Breakdown</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Month {snapshot.month} - Year {snapshot.year}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Income & Taxes</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Annual Gross:</span>
                      <CalculationTooltip
                        title="Annual Gross Income"
                        calculations={[
                          { label: 'Base Salaries (Combined)', value: snapshot.annualGross - 15200 },
                          { label: 'Big 4 Benefits Value', value: 15200 },
                          { label: 'Total Compensation', value: snapshot.annualGross, isTotal: true }
                        ]}
                      >
                        <span className="font-medium">{formatCurrency(snapshot.annualGross)}</span>
                      </CalculationTooltip>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">401k Rate:</span>
                      <Badge variant="secondary">{formatPercentage(snapshot.employee401kRate)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Net Take Home:</span>
                      <CalculationTooltip
                        title="Monthly Net Take Home"
                        calculations={[
                          { label: 'Monthly Gross', value: snapshot.annualGross / 12 },
                          { label: '401k Contribution', value: snapshot.employee401kMonthly, isSubtraction: true },
                          { label: 'HSA Contribution', value: snapshot.hsaEmployeeMonthly, isSubtraction: true },
                          { label: 'Federal Tax', value: snapshot.fedTaxMonthly, isSubtraction: true },
                          { label: 'State Tax', value: snapshot.stateTaxMonthly, isSubtraction: true },
                          { label: 'FICA', value: snapshot.ficaMonthly, isSubtraction: true },
                          { label: 'Net Take Home', value: snapshot.netTakeHomeMonthly, isTotal: true }
                        ]}
                      >
                        <span className="font-medium text-green-600">
                          {formatCurrency(snapshot.netTakeHomeMonthly)}/mo
                        </span>
                      </CalculationTooltip>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Balances</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Debt:</span>
                      <CalculationTooltip
                        title="Total Debt Breakdown"
                        calculations={[
                          { label: 'Private Loan (10% APR)', value: snapshot.debtPrivate10 },
                          { label: 'Student Loan (7% APR)', value: snapshot.debtStudent7 },
                          { label: 'Private Loan (0% APR)', value: snapshot.debtPrivate0 },
                          { label: 'Loan Assistance Applied', value: -snapshot.studentLoanAssistance * 12, isNote: true },
                          { label: 'Total Debt', value: snapshot.totalDebt, isTotal: true }
                        ]}
                      >
                        <span className="font-medium text-red-600">
                          {formatCurrency(snapshot.totalDebt)}
                        </span>
                      </CalculationTooltip>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Emergency Fund:</span>
                      <span className="font-medium">{formatCurrency(snapshot.emergencyFund)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Retirement:</span>
                      <CalculationTooltip
                        title="Total Retirement Balance"
                        calculations={[
                          { label: 'Employee 401(k)', value: snapshot.employee401k },
                          { label: 'Employer Match', value: snapshot.employerMatch },
                          { label: 'Wealth Builder', value: snapshot.employerWealthBuilder },
                          { label: 'HSA Balance', value: snapshot.hsaBalance },
                          { label: 'Extra Contributions', value: snapshot.retirementBalanceExtra },
                          { label: 'Total', value: snapshot.retirementBalanceTotal, isTotal: true }
                        ]}
                      >
                        <span className="font-medium text-blue-600">
                          {formatCurrency(snapshot.retirementBalanceTotal)}
                        </span>
                      </CalculationTooltip>
                    </div>
                  </div>
                </div>
              </div>

              {snapshot.milestone && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Milestones This Month</h3>
                  <div className="flex flex-wrap gap-2">
                    {snapshot.milestone.split(', ').map((m, i) => (
                      <Badge key={i} variant="default" className="bg-green-600">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Net Take Home</TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(snapshot.netTakeHomeMonthly)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fixed Expenses</TableCell>
                    <TableCell className="text-right text-red-600">
                      -{formatCurrency(snapshot.monthlyExpenses)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Debt Minimums</TableCell>
                    <TableCell className="text-right text-red-600">
                      -{formatCurrency(snapshot.debtMinimumsPaidMonthly)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-semibold border-t">
                    <TableCell>Goal Budget Available</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(snapshot.goalBudgetDynamicMonthly)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debt Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Private Loan (10% APR)</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(snapshot.debtPrivate10)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Student Loan (7% APR)</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(snapshot.debtStudent7)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Private Loan (0% APR)</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(snapshot.debtPrivate0)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-semibold border-t">
                    <TableCell>Total Debt</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(snapshot.totalDebt)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>2025 Tax Calculations (MFJ)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Accurate federal and Georgia state tax calculations for tax year 2025
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Federal Income Tax</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Annual Gross Income</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(snapshot.annualGross)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>401(k) Contribution</TableCell>
                          <TableCell className="text-right text-red-600">
                            -{formatCurrency(snapshot.employee401kMonthly * 12)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Standard Deduction (MFJ)</TableCell>
                          <TableCell className="text-right text-red-600">
                            -{formatCurrency(29200)}
                          </TableCell>
                        </TableRow>
                        <TableRow className="font-semibold border-t">
                          <TableCell>Federal Taxable Income</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(Math.max(0, snapshot.annualGross - (snapshot.employee401kMonthly * 12) - 29200))}
                          </TableCell>
                        </TableRow>
                        <TableRow className="font-semibold">
                          <TableCell>Federal Tax (Annual)</TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(snapshot.fedTaxMonthly * 12)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Georgia State Tax</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Annual Gross Income</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(snapshot.annualGross)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>401(k) Contribution</TableCell>
                          <TableCell className="text-right text-red-600">
                            -{formatCurrency(snapshot.employee401kMonthly * 12)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>GA Standard Deduction</TableCell>
                          <TableCell className="text-right text-red-600">
                            -{formatCurrency(24000)}
                          </TableCell>
                        </TableRow>
                        <TableRow className="font-semibold border-t">
                          <TableCell>GA Taxable Income</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(Math.max(0, snapshot.annualGross - (snapshot.employee401kMonthly * 12) - 24000))}
                          </TableCell>
                        </TableRow>
                        <TableRow className="font-semibold">
                          <TableCell>GA Tax (5.19% flat)</TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(snapshot.stateTaxMonthly * 12)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm mb-3">FICA Taxes (2025)</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Social Security (6.2% on first $176,100)</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Math.min(snapshot.annualGross, 176100) * 0.062)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Medicare (1.45% on all wages)</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(snapshot.annualGross * 0.0145)}
                        </TableCell>
                      </TableRow>
                      {snapshot.annualGross > 250000 && (
                        <TableRow>
                          <TableCell>Additional Medicare (0.9% over $250,000)</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency((snapshot.annualGross - 250000) * 0.009)}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow className="font-semibold border-t">
                        <TableCell>Total FICA (Annual)</TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(snapshot.ficaMonthly * 12)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm mb-3">Monthly Tax Summary</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Gross Monthly Income</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(snapshot.annualGross / 12)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Employee 401(k)</TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(snapshot.employee401kMonthly)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Federal Tax</TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(snapshot.fedTaxMonthly)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Georgia State Tax</TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(snapshot.stateTaxMonthly)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>FICA Taxes</TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(snapshot.ficaMonthly)}
                        </TableCell>
                      </TableRow>
                      <TableRow className="font-semibold border-t bg-muted/50">
                        <TableCell>Net Take Home</TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(snapshot.netTakeHomeMonthly)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">2025 Tax Information</h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Filing Status: Married Filing Jointly (MFJ)</li>
                    <li>Federal Standard Deduction: $29,200</li>
                    <li>Georgia Standard Deduction: $24,000</li>
                    <li>Georgia Tax Rate: 5.19% (flat)</li>
                    <li>Social Security Wage Base: $176,100</li>
                    <li>Additional Medicare Tax: 0.9% on income over $250,000</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Budget Allocations - Month {snapshot.month}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="font-medium">Available Goal Budget:</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(snapshot.goalBudgetDynamicMonthly)}
                  </span>
                </div>
                {(snapshot.allocTrustFund + snapshot.allocVacation + snapshot.allocEarnest +
                  snapshot.allocEFStarter + snapshot.allocDebtAvalanche + snapshot.allocDownPayment +
                  snapshot.allocEFFinal) > snapshot.goalBudgetDynamicMonthly && (
                  <div className="text-sm text-orange-500">
                    ⚠️ Total allocations exceed budget by {formatCurrency(
                      (snapshot.allocTrustFund + snapshot.allocVacation + snapshot.allocEarnest +
                       snapshot.allocEFStarter + snapshot.allocDebtAvalanche + snapshot.allocDownPayment +
                       snapshot.allocEFFinal) - snapshot.goalBudgetDynamicMonthly
                    )}
                  </div>
                )}
                {snapshot.primaryAllocLabel && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active Goals:</span>
                    <Badge variant="outline">{snapshot.primaryAllocLabel}</Badge>
                  </div>
                )}
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Allocation</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshot.allocTrustFund > 0 && (
                    <TableRow>
                      <TableCell>
                        Children's Trust Fund
                        {snapshot.allocTrustFund > 833.33 && (
                          <Badge variant="destructive" className="ml-2">Over Budget</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(snapshot.allocTrustFund)}
                      </TableCell>
                    </TableRow>
                  )}
                  {snapshot.allocVacation > 0 && (
                    <TableRow>
                      <TableCell>Vacation Fund</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(snapshot.allocVacation)}
                      </TableCell>
                    </TableRow>
                  )}
                  {snapshot.allocEarnest > 0 && (
                    <TableRow>
                      <TableCell>Earnest Money</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(snapshot.allocEarnest)}
                      </TableCell>
                    </TableRow>
                  )}
                  {snapshot.allocEFStarter > 0 && (
                    <TableRow>
                      <TableCell>Emergency Fund (Starter)</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(snapshot.allocEFStarter)}
                      </TableCell>
                    </TableRow>
                  )}
                  {snapshot.allocDebtAvalanche > 0 && (
                    <TableRow>
                      <TableCell>Debt Avalanche</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(snapshot.allocDebtAvalanche)}
                      </TableCell>
                    </TableRow>
                  )}
                  {snapshot.allocDownPayment > 0 && (
                    <TableRow>
                      <TableCell>Down Payment</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(snapshot.allocDownPayment)}
                      </TableCell>
                    </TableRow>
                  )}
                  {snapshot.allocEFFinal > 0 && (
                    <TableRow>
                      <TableCell>Emergency Fund (Final)</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(snapshot.allocEFFinal)}
                      </TableCell>
                    </TableRow>
                  )}
                  {snapshot.allocRetirementExtra > 0 && (
                    <TableRow>
                      <TableCell>Extra Retirement</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(snapshot.allocRetirementExtra)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Earnest Money</span>
                    <span className="text-sm">{formatCurrency(snapshot.earnest)} / $15,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (snapshot.earnest / 15000) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Emergency Fund</span>
                    <span className="text-sm">{formatCurrency(snapshot.emergencyFund)} / $20,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (snapshot.emergencyFund / 20000) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Children's Trust Fund</span>
                    <span className="text-sm">{formatCurrency(snapshot.trustFund)} / $50,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (snapshot.trustFund / 50000) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Vacation Fund</span>
                    <span className="text-sm">{formatCurrency(snapshot.vacationFund)} / $5,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (snapshot.vacationFund / 5000) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">House Down Payment</span>
                    <span className="text-sm">{formatCurrency(snapshot.downPayment)} / $75,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (snapshot.downPayment / 75000) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Debt Payoff</span>
                    <span className="text-sm">{formatCurrency(140000 - snapshot.totalDebt)} / $140,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, ((140000 - snapshot.totalDebt) / 140000) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation">
          <Card>
            <CardHeader>
              <CardTitle>Annual Reconciliation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Verifies that all cash flows balance correctly for each year
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Gross Income</TableHead>
                    <TableHead className="text-right">Net Take Home</TableHead>
                    <TableHead className="text-right">Total Used</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.reconciliation.map(({ year, data }) => (
                    <TableRow key={year}>
                      <TableCell>Year {year}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(data.annualGross)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(data.netTakeHome)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(data.totalUsed)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(data.difference)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={data.checkPassed ? "default" : "destructive"}>
                          {data.checkPassed ? "✓ Balanced" : "Error"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Reconciliation Summary</h4>
                <p className="text-sm text-muted-foreground">
                  All years should show a difference close to $0, confirming that:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside mt-2">
                  <li>Net income equals expenses + debt payments + goal allocations</li>
                  <li>Tax calculations are accurate</li>
                  <li>All cash flows are properly accounted for</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};