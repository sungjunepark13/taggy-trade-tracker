import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/context/FinanceContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Church, TrendingUp, FileText, Calculator } from 'lucide-react';
import { formatCurrency } from '@/utils/tradeUtils';
import { CalculationTooltip } from '@/components/ui/calculation-tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const TithingDetail: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useFinance();
  const currentSnapshot = state.snapshots.find(s => s.month === state.currentMonth);

  if (!currentSnapshot) {
    return <div>No data available</div>;
  }

  // Calculate annual summaries for tax deduction purposes
  const getAnnualTithingSummary = () => {
    const annualData: {
      year: number;
      totalTithing: number;
      standardDeduction: number;
      itemizedBenefit: boolean;
      taxSavings: number;
    }[] = [];

    for (let year = 1; year <= 5; year++) {
      const yearSnapshots = state.snapshots.filter(s => s.year === year);
      if (yearSnapshots.length === 0) continue;

      const totalTithing = yearSnapshots.reduce((sum, s) => sum + s.monthlyTithing, 0);
      const annualGross = yearSnapshots[0].annualGross;
      const standardDeductionMFJ = 29200; // 2024 MFJ standard deduction

      // Other itemized deductions (state/local taxes capped at $10k)
      const saltDeduction = 10000; // State and Local Tax cap
      const mortgageInterest = 0; // No mortgage yet
      const totalItemized = totalTithing + saltDeduction + mortgageInterest;

      const itemizedBenefit = totalItemized > standardDeductionMFJ;

      // Calculate marginal tax rate for this income level
      const marginalRate = annualGross > 201050 ? 0.24 :
                          annualGross > 94300 ? 0.22 : 0.12;

      const taxSavings = itemizedBenefit ?
        (totalItemized - standardDeductionMFJ) * marginalRate : 0;

      annualData.push({
        year,
        totalTithing,
        standardDeduction: standardDeductionMFJ,
        itemizedBenefit,
        taxSavings
      });
    }

    return annualData;
  };

  const annualSummary = getAnnualTithingSummary();
  const currentYear = Math.ceil(currentSnapshot.month / 12);
  const currentYearData = annualSummary.find(d => d.year === currentYear);

  // Calculate carryforward strategy
  const totalCarryforward = currentSnapshot.tithingCarryforward;
  const potentialSavings = totalCarryforward * 0.22; // Assuming 22% bracket

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
              <Church className="h-8 w-8" />
              Tithing & Charitable Giving
            </h1>
            <p className="text-muted-foreground">
              Track charitable contributions and tax deduction optimization
            </p>
          </div>
        </div>

        {/* Current Month Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Tithing</CardTitle>
            </CardHeader>
            <CardContent>
              <CalculationTooltip
                title="Monthly Tithing Calculation"
                calculations={[
                  { label: 'Annual Base Salary', value: currentSnapshot.annualGross - 15200 },
                  { label: 'Monthly Gross', value: (currentSnapshot.annualGross - 15200) / 12 },
                  { label: '10% Tithing', value: currentSnapshot.monthlyTithing, isTotal: true }
                ]}
              >
                <div className="text-2xl font-bold">
                  {formatCurrency(currentSnapshot.monthlyTithing)}
                </div>
              </CalculationTooltip>
              <p className="text-xs text-muted-foreground mt-1">10% of gross income</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Year-to-Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(currentSnapshot.tithingYTD)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Year {currentYear} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Carryforward Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <CalculationTooltip
                title="Carryforward Strategy"
                calculations={[
                  { label: 'Total Carried Forward', value: totalCarryforward },
                  { label: 'Potential Tax Savings (22%)', value: potentialSavings },
                  { label: 'Note', value: 'Accumulate for itemized deduction', isNote: true }
                ]}
              >
                <div className="text-2xl font-bold">
                  {formatCurrency(totalCarryforward)}
                </div>
              </CalculationTooltip>
              <p className="text-xs text-muted-foreground mt-1">For future itemization</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tax Benefit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentYearData?.itemizedBenefit ? (
                  <span className="text-green-600">
                    {formatCurrency(currentYearData.taxSavings)}
                  </span>
                ) : (
                  <Badge variant="secondary">Standard Deduction</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentYearData?.itemizedBenefit ? 'Itemizing saves money' : 'Using standard deduction'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tax Strategy Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tax Optimization Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Carryforward Strategy</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Since your charitable giving alone doesn't exceed the standard deduction ($29,200 for MFJ),
                consider these strategies:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>
                    <strong>Bunching Strategy:</strong> Accumulate 2-3 years of tithing and donate in a single year
                    to exceed the standard deduction threshold.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>
                    <strong>Future Home Purchase:</strong> Once you have mortgage interest (~$15-20k/year),
                    combined with tithing and SALT, you'll naturally exceed the standard deduction.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>
                    <strong>Donor-Advised Fund:</strong> Contribute multiple years at once for immediate tax benefit
                    while maintaining annual giving schedule to your church.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Current Year Analysis</h4>
              {currentYearData && (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Annual Tithing:</span>
                    <span className="font-medium">{formatCurrency(currentYearData.totalTithing)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SALT Deduction (capped):</span>
                    <span className="font-medium">{formatCurrency(10000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Itemized:</span>
                    <span className="font-medium">{formatCurrency(currentYearData.totalTithing + 10000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard Deduction:</span>
                    <span className="font-medium">{formatCurrency(currentYearData.standardDeduction)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Benefit:</span>
                    <span className={currentYearData.itemizedBenefit ? 'text-green-600' : 'text-amber-600'}>
                      {currentYearData.itemizedBenefit
                        ? `Save ${formatCurrency(currentYearData.taxSavings)}`
                        : `Need ${formatCurrency(currentYearData.standardDeduction - currentYearData.totalTithing - 10000)} more`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Annual Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              5-Year Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Annual Tithing</TableHead>
                  <TableHead className="text-right">Total Itemized</TableHead>
                  <TableHead className="text-right">Standard Deduction</TableHead>
                  <TableHead className="text-right">Tax Strategy</TableHead>
                  <TableHead className="text-right">Tax Savings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {annualSummary.map((yearData) => (
                  <TableRow key={yearData.year}>
                    <TableCell className="font-medium">Year {yearData.year}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(yearData.totalTithing)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(yearData.totalTithing + 10000)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(yearData.standardDeduction)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={yearData.itemizedBenefit ? 'default' : 'secondary'}>
                        {yearData.itemizedBenefit ? 'Itemize' : 'Standard'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {yearData.itemizedBenefit ? (
                        <span className="text-green-600 font-medium">
                          {formatCurrency(yearData.taxSavings)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Record Keeping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Important: Keep all donation receipts and documentation for tax purposes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Required Documentation</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Written acknowledgment for gifts over $250</li>
                    <li>• Bank records or receipts for all donations</li>
                    <li>• Dated contribution statements from church</li>
                    <li>• Form 8283 for non-cash donations over $500</li>
                  </ul>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Best Practices</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Use checks or electronic transfers for tracking</li>
                    <li>• Request annual giving statement in January</li>
                    <li>• Keep records for 7 years (IRS requirement)</li>
                    <li>• Consider tax-advantaged giving methods</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TithingDetail;