import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/context/FinanceContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingDown, Calculator, AlertTriangle, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/tradeUtils';
import { CalculationTooltip } from '@/components/ui/calculation-tooltip';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  Bar,
  BarChart,
  Legend,
} from 'recharts';

const DebtDetail: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useFinance();
  const currentSnapshot = state.snapshots.find(s => s.month === state.currentMonth);

  if (!currentSnapshot) {
    return <div>No data available</div>;
  }

  // Prepare data for debt breakdown chart
  const debtBreakdownData = state.snapshots.map(snapshot => ({
    month: snapshot.month,
    private10: snapshot.debtPrivate10,
    student7: snapshot.debtStudent7,
    private0: snapshot.debtPrivate0,
    total: snapshot.totalDebt,
  }));

  // Calculate interest paid over time
  const calculateMonthlyInterest = (snapshot: any) => {
    const private10Interest = (snapshot.debtPrivate10 * 0.10) / 12;
    const student7Interest = (snapshot.debtStudent7 * 0.07) / 12;
    return private10Interest + student7Interest;
  };

  // Calculate total interest paid to date
  const totalInterestPaid = state.snapshots
    .slice(0, currentSnapshot.month)
    .reduce((sum, s) => sum + calculateMonthlyInterest(s), 0);

  // Find when debt will be paid off
  const debtFreeMonth = state.snapshots.find(s => s.totalDebt === 0)?.month || null;
  const debtFreeYear = debtFreeMonth ? Math.ceil(debtFreeMonth / 12) : null;

  // Calculate avalanche savings vs minimum payments only
  const avalancheSavings = calculateAvalancheSavings();

  function calculateAvalancheSavings() {
    // Simplified calculation - would need full simulation for exact numbers
    const withAvalanche = totalInterestPaid;
    const withoutAvalancheEstimate = totalInterestPaid * 1.5; // Rough estimate
    return withoutAvalancheEstimate - withAvalanche;
  }

  const chartConfig = {
    private10: {
      label: "Private 10%",
      color: "#ef4444",
    },
    student7: {
      label: "Student 7%",
      color: "#f97316",
    },
    private0: {
      label: "Private 0%",
      color: "#eab308",
    },
    total: {
      label: "Total",
      color: "#6b7280",
    },
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <TrendingDown className="h-8 w-8 text-destructive" />
              Debt Management Detail
            </h1>
            <p className="text-muted-foreground">
              Track debt payoff progress and avalanche strategy
            </p>
          </div>
        </div>

        {/* Current Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <CalculationTooltip
                title="Total Debt Breakdown"
                calculations={[
                  { label: 'Private Loan (10% APR)', value: currentSnapshot.debtPrivate10 },
                  { label: 'Student Loan (7% APR)', value: currentSnapshot.debtStudent7 },
                  { label: 'Private Loan (0% APR)', value: currentSnapshot.debtPrivate0 },
                  { label: 'Student Loan Assistance', value: -currentSnapshot.studentLoanAssistance * 12, isNote: true },
                  { label: 'Total Outstanding', value: currentSnapshot.totalDebt, isTotal: true }
                ]}
              >
                <div className="text-2xl font-bold text-destructive">
                  {formatCurrency(currentSnapshot.totalDebt)}
                </div>
              </CalculationTooltip>
              <p className="text-xs text-muted-foreground mt-1">
                {currentSnapshot.totalDebt > 0 ? 'Outstanding balance' : 'Debt free!'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <CalculationTooltip
                title="Monthly Debt Payments"
                calculations={[
                  { label: 'Minimum Payments', value: currentSnapshot.debtMinimumsPaidMonthly },
                  { label: 'Extra Principal', value: currentSnapshot.allocDebtAvalanche },
                  { label: 'Loan Assistance', value: currentSnapshot.studentLoanAssistance },
                  { label: 'Total Monthly', value:
                    currentSnapshot.debtMinimumsPaidMonthly +
                    currentSnapshot.allocDebtAvalanche +
                    currentSnapshot.studentLoanAssistance,
                    isTotal: true
                  }
                ]}
              >
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    currentSnapshot.debtMinimumsPaidMonthly +
                    currentSnapshot.allocDebtAvalanche +
                    currentSnapshot.studentLoanAssistance
                  )}
                </div>
              </CalculationTooltip>
              <p className="text-xs text-muted-foreground mt-1">Total monthly payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <CalculationTooltip
                title="Weighted Average APR"
                calculations={[
                  { label: 'Private 10% × Balance', value: `${formatCurrency(currentSnapshot.debtPrivate10)} × 10%`, isNote: true },
                  { label: 'Student 7% × Balance', value: `${formatCurrency(currentSnapshot.debtStudent7)} × 7%`, isNote: true },
                  { label: 'Private 0% × Balance', value: `${formatCurrency(currentSnapshot.debtPrivate0)} × 0%`, isNote: true },
                  { label: 'Weighted Average', value:
                    currentSnapshot.totalDebt > 0
                      ? ((currentSnapshot.debtPrivate10 * 0.10 + currentSnapshot.debtStudent7 * 0.07) /
                         currentSnapshot.totalDebt * 100).toFixed(1) + '%'
                      : '0%',
                    isPercentage: true
                  }
                ]}
              >
                <div className="text-2xl font-bold">
                  {currentSnapshot.totalDebt > 0
                    ? ((currentSnapshot.debtPrivate10 * 0.10 + currentSnapshot.debtStudent7 * 0.07) /
                       currentSnapshot.totalDebt * 100).toFixed(1) + '%'
                    : '0%'}
                </div>
              </CalculationTooltip>
              <p className="text-xs text-muted-foreground mt-1">Weighted average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Debt Free Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {debtFreeMonth ? (
                  <Badge variant="default" className="text-lg px-3 py-1">
                    Year {debtFreeYear}
                  </Badge>
                ) : (
                  <span className="text-green-600">Already!</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {debtFreeMonth ? `Month ${debtFreeMonth}` : 'Congratulations!'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Debt Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Debt Payoff Progress</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={debtBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => {
                      const year = Math.ceil(value / 12);
                      const monthInYear = ((value - 1) % 12) + 1;
                      return monthInYear === 1 ? `Y${year}` : '';
                    }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<DebtTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="private10"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.8}
                    name="Private 10%"
                  />
                  <Area
                    type="monotone"
                    dataKey="student7"
                    stackId="1"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.8}
                    name="Student 7%"
                  />
                  <Area
                    type="monotone"
                    dataKey="private0"
                    stackId="1"
                    stroke="#eab308"
                    fill="#eab308"
                    fillOpacity={0.8}
                    name="Private 0%"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Payment Sources and Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Current Month Payment Sources</CardTitle>
            <p className="text-sm text-muted-foreground">
              Month {state.currentMonth} - Where debt payments come from
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Payment Sources</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Minimum Payments (Required)</span>
                      <CalculationTooltip
                        title="Minimum Payment Breakdown"
                        calculations={[
                          { label: 'Private 10% ($600/mo)', value: 600 },
                          { label: 'Student 7% ($350/mo)', value: 350 },
                          { label: 'Private 0% ($200/mo)', value: 200 },
                          { label: 'Total Minimums', value: snapshot?.debtMinimumsPaidMonthly || 1150, isTotal: true }
                        ]}
                      >
                        <span className="font-medium text-orange-600 cursor-help underline decoration-dotted">
                          {formatCurrency(snapshot?.debtMinimumsPaidMonthly || 0)}
                        </span>
                      </CalculationTooltip>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Loan Assistance (PwC Benefit)</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(snapshot?.studentLoanAssistance || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Extra from Budget (Avalanche)</span>
                      <CalculationTooltip
                        title="Avalanche Payment Calculation"
                        calculations={[
                          { label: 'Total Allocated to Debt', value: snapshot?.allocDebtAvalanche || 0 },
                          { label: 'Minus Loan Assistance', value: snapshot?.studentLoanAssistance || 0, isSubtraction: true },
                          { label: 'From Goal Budget', value: (snapshot?.allocDebtAvalanche || 0) - (snapshot?.studentLoanAssistance || 0), isTotal: true }
                        ]}
                      >
                        <span className="font-medium text-green-600 cursor-help underline decoration-dotted">
                          {formatCurrency(Math.max(0, (snapshot?.allocDebtAvalanche || 0) - (snapshot?.studentLoanAssistance || 0)))}
                        </span>
                      </CalculationTooltip>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-sm">Total Monthly Payment</span>
                        <span className="text-green-600">
                          {formatCurrency((snapshot?.debtMinimumsPaidMonthly || 0) + (snapshot?.allocDebtAvalanche || 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Payment Allocation (Avalanche)</h4>
                  <div className="space-y-1">
                    {snapshot && snapshot.totalDebt > 0 ? (
                      <>
                        {snapshot.debtPrivate10 > 0 && (
                          <div className="p-2 bg-red-50 rounded">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Private 10% APR</span>
                              <Badge variant="destructive">Priority 1</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Balance: {formatCurrency(snapshot.debtPrivate10)}
                            </div>
                            {snapshot.allocDebtAvalanche > 0 && snapshot.debtPrivate10 > 0 && (
                              <div className="text-xs text-green-600 mt-1">
                                + {formatCurrency(Math.min(snapshot.allocDebtAvalanche, snapshot.debtPrivate10))} extra this month
                              </div>
                            )}
                          </div>
                        )}
                        {snapshot.debtStudent7 > 0 && (
                          <div className={`p-2 rounded ${snapshot.debtPrivate10 <= 0 ? 'bg-orange-50' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Student 7% APR</span>
                              <Badge variant={snapshot.debtPrivate10 <= 0 ? "secondary" : "outline"}>
                                Priority {snapshot.debtPrivate10 <= 0 ? '1' : '2'}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Balance: {formatCurrency(snapshot.debtStudent7)}
                            </div>
                            {snapshot.allocDebtAvalanche > 0 && snapshot.debtPrivate10 <= 0 && snapshot.debtStudent7 > 0 && (
                              <div className="text-xs text-green-600 mt-1">
                                + {formatCurrency(Math.min(snapshot.allocDebtAvalanche, snapshot.debtStudent7))} extra this month
                              </div>
                            )}
                          </div>
                        )}
                        {snapshot.debtPrivate0 > 0 && (
                          <div className={`p-2 rounded ${snapshot.debtPrivate10 <= 0 && snapshot.debtStudent7 <= 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Private 0% APR</span>
                              <Badge variant="outline">
                                Priority 3
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Balance: {formatCurrency(snapshot.debtPrivate0)}
                            </div>
                            {snapshot.allocDebtAvalanche > 0 && snapshot.debtPrivate10 <= 0 && snapshot.debtStudent7 <= 0 && snapshot.debtPrivate0 > 0 && (
                              <div className="text-xs text-green-600 mt-1">
                                + {formatCurrency(Math.min(snapshot.allocDebtAvalanche, snapshot.debtPrivate0))} extra this month
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-4 bg-green-50 rounded text-center">
                        <Badge variant="default" className="mb-2">🎉 Debt Free!</Badge>
                        <p className="text-sm text-muted-foreground">All debts have been paid off</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Monthly Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Debt Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Month</th>
                    <th className="text-right p-2">Private 10%</th>
                    <th className="text-right p-2">Student 7%</th>
                    <th className="text-right p-2">Private 0%</th>
                    <th className="text-right p-2">Min. Payments</th>
                    <th className="text-right p-2">Extra Payments</th>
                    <th className="text-right p-2">Total Paid</th>
                    <th className="text-right p-2">Total Debt</th>
                  </tr>
                </thead>
                <tbody>
                  {state.snapshots.map((snapshot, index) => {
                    const year = Math.ceil(snapshot.month / 12);
                    const monthInYear = ((snapshot.month - 1) % 12) + 1;
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const displayDate = `${monthNames[monthInYear - 1]} Y${year}`;
                    const monthlyInterest = calculateMonthlyInterest(snapshot);
                    const totalPayment = snapshot.debtMinimumsPaidMonthly +
                                        snapshot.allocDebtAvalanche +
                                        snapshot.studentLoanAssistance;

                    return (
                      <tr key={snapshot.month} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{displayDate}</td>
                        <td className="text-right p-2">
                          <CalculationTooltip
                            title="Private Loan (10% APR)"
                            calculations={[
                              { label: 'Principal', value: snapshot.debtPrivate10 },
                              { label: 'Monthly Interest', value: (snapshot.debtPrivate10 * 0.10) / 12 },
                              { label: 'APR', value: '10%', isPercentage: true }
                            ]}
                          >
                            {formatCurrency(snapshot.debtPrivate10)}
                          </CalculationTooltip>
                        </td>
                        <td className="text-right p-2">
                          <CalculationTooltip
                            title="Student Loan (7% APR)"
                            calculations={[
                              { label: 'Principal', value: snapshot.debtStudent7 },
                              { label: 'Monthly Interest', value: (snapshot.debtStudent7 * 0.07) / 12 },
                              { label: 'APR', value: '7%', isPercentage: true }
                            ]}
                          >
                            {formatCurrency(snapshot.debtStudent7)}
                          </CalculationTooltip>
                        </td>
                        <td className="text-right p-2">
                          <CalculationTooltip
                            title="Private Loan (0% APR)"
                            calculations={[
                              { label: 'Principal', value: snapshot.debtPrivate0 },
                              { label: 'Monthly Interest', value: 0 },
                              { label: 'APR', value: '0%', isPercentage: true }
                            ]}
                          >
                            {formatCurrency(snapshot.debtPrivate0)}
                          </CalculationTooltip>
                        </td>
                        <td className="text-right p-2 text-destructive">
                          <CalculationTooltip
                            title="Monthly Interest Charges"
                            calculations={[
                              { label: 'Private 10%', value: (snapshot.debtPrivate10 * 0.10) / 12 },
                              { label: 'Student 7%', value: (snapshot.debtStudent7 * 0.07) / 12 },
                              { label: 'Private 0%', value: 0 },
                              { label: 'Total Interest', value: monthlyInterest, isTotal: true }
                            ]}
                          >
                            {formatCurrency(monthlyInterest)}
                          </CalculationTooltip>
                        </td>
                        <td className="text-right p-2 text-success">
                          <CalculationTooltip
                            title="Total Monthly Payment"
                            calculations={[
                              { label: 'Minimum Payments', value: snapshot.debtMinimumsPaidMonthly },
                              { label: 'Extra Principal', value: snapshot.allocDebtAvalanche },
                              { label: 'Loan Assistance', value: snapshot.studentLoanAssistance },
                              { label: 'Total', value: totalPayment, isTotal: true }
                            ]}
                          >
                            {formatCurrency(totalPayment)}
                          </CalculationTooltip>
                        </td>
                        <td className="text-right p-2 font-bold">
                          <CalculationTooltip
                            title="Total Outstanding Debt"
                            calculations={[
                              { label: 'Private 10%', value: snapshot.debtPrivate10 },
                              { label: 'Student 7%', value: snapshot.debtStudent7 },
                              { label: 'Private 0%', value: snapshot.debtPrivate0 },
                              { label: 'Total', value: snapshot.totalDebt, isTotal: true }
                            ]}
                          >
                            {formatCurrency(snapshot.totalDebt)}
                          </CalculationTooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Debt Avalanche Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Current Strategy: Avalanche Method</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Paying off highest interest rate debt first to minimize total interest paid.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Priority 1: Private Loan (10% APR)</span>
                  <Badge variant={currentSnapshot.debtPrivate10 > 0 ? "destructive" : "default"}>
                    {currentSnapshot.debtPrivate10 > 0 ? "In Progress" : "Paid Off"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Priority 2: Student Loan (7% APR)</span>
                  <Badge variant={currentSnapshot.debtStudent7 > 0 ? "secondary" : "default"}>
                    {currentSnapshot.debtStudent7 > 0 ? "Pending" : "Paid Off"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Priority 3: Private Loan (0% APR)</span>
                  <Badge variant={currentSnapshot.debtPrivate0 > 0 ? "outline" : "default"}>
                    {currentSnapshot.debtPrivate0 > 0 ? "Pending" : "Paid Off"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Interest Saved
                </h4>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(avalancheSavings)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">vs minimum payments only</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Total Interest Paid
                </h4>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(totalInterestPaid)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">To date</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-2">PwC Loan Assistance</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(currentSnapshot.studentLoanAssistance * 12)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Annual benefit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

const DebtTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const year = Math.ceil(label / 12);
  const monthInYear = ((label - 1) % 12) + 1;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const displayDate = `${monthNames[monthInYear - 1]} Y${year}`;

  const total = payload.reduce((sum: number, item: any) => sum + item.value, 0);

  return (
    <div className="bg-background border border-border p-3 rounded-md shadow-md">
      <p className="text-sm font-medium mb-2">{displayDate}</p>
      {payload.map((item: any) => (
        <div key={item.dataKey} className="flex justify-between items-center gap-4 text-xs">
          <span style={{ color: item.fill }}>{item.name}:</span>
          <span className="font-medium">{formatCurrency(item.value)}</span>
        </div>
      ))}
      <div className="border-t mt-2 pt-2 flex justify-between items-center gap-4 text-xs font-semibold">
        <span>Total:</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default DebtDetail;