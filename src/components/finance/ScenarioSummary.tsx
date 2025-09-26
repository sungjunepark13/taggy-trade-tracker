import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ScenarioSummary: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Financial Planning Scenario</CardTitle>
        <CardDescription>
          5-year financial plan for a married couple in Atlanta, GA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Household</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">Filing Status:</span>
                <Badge variant="secondary">MFJ</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Ages:</span>
                <span className="font-medium">22M, 23F</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Location:</span>
                <span className="font-medium">Atlanta, GA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Horizon:</span>
                <span className="font-medium">60 months</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Income Growth</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Year 1:</span>
                <span className="font-medium">{formatCurrency(160000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Year 2:</span>
                <span className="font-medium">{formatCurrency(187200)}</span>
              </div>
              <div className="flex justify-between">
                <span>Year 3:</span>
                <span className="font-medium">{formatCurrency(219024)}</span>
              </div>
              <div className="flex justify-between">
                <span>Year 4:</span>
                <span className="font-medium">{formatCurrency(256258)}</span>
              </div>
              <div className="flex justify-between">
                <span>Year 5:</span>
                <span className="font-medium">{formatCurrency(300000)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Initial Debts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Private @ 10%:</span>
                <span className="font-medium text-red-600">{formatCurrency(50000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Student @ 7%:</span>
                <span className="font-medium text-red-600">{formatCurrency(40000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Private @ 0%:</span>
                <span className="font-medium text-red-600">{formatCurrency(50000)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Debt:</span>
                  <span className="text-red-600">{formatCurrency(140000)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Financial Goals</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Earnest Money:</span>
                <span className="font-medium">{formatCurrency(15000)}</span>
              </div>
              <div className="flex justify-between">
                <span>EF Starter:</span>
                <span className="font-medium">{formatCurrency(5000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Down Payment:</span>
                <span className="font-medium">{formatCurrency(50000)}</span>
              </div>
              <div className="flex justify-between">
                <span>EF Final:</span>
                <span className="font-medium">{formatCurrency(20000)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Tax Assumptions</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Federal (effective):</span>
                <span className="font-medium">17%</span>
              </div>
              <div className="flex justify-between">
                <span>State GA (effective):</span>
                <span className="font-medium">5%</span>
              </div>
              <div className="flex justify-between">
                <span>Social Security:</span>
                <span className="font-medium">6.2% (cap $170k)</span>
              </div>
              <div className="flex justify-between">
                <span>Medicare:</span>
                <span className="font-medium">1.45% + 0.9%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Retirement & Expenses</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>401k (early):</span>
                <span className="font-medium">6% + 4% match</span>
              </div>
              <div className="flex justify-between">
                <span>401k (after goals):</span>
                <span className="font-medium">15% + 4% match</span>
              </div>
              <div className="flex justify-between">
                <span>Fixed Expenses:</span>
                <span className="font-medium">{formatCurrency(6000)}/mo</span>
              </div>
              <div className="flex justify-between">
                <span>Return Rate:</span>
                <span className="font-medium">6% annual</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Goal Priority Order</h3>
          <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
            <li>Earnest Money ($15k)</li>
            <li>Emergency Fund Starter ($5k)</li>
            <li>Debt Avalanche (highest APR first: 10% → 7% → 0%)</li>
            <li>Down Payment ($50k)</li>
            <li>Emergency Fund Final ($20k)</li>
            <li>Extra Retirement (after all goals complete)</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-3">
            <span className="font-semibold">Note:</span> 401k contribution increases from 6% to 15%
            once all goals are complete (debt = $0, DP = $50k, EF = $20k)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};