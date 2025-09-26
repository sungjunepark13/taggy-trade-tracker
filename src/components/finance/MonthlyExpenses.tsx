import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/utils/tradeUtils';
import { CalculationTooltip } from '@/components/ui/calculation-tooltip';

const MonthlyExpenses: React.FC = () => {
  const { state, getCurrentSnapshot } = useFinance();
  const [isExpanded, setIsExpanded] = useState(false);
  const snapshot = getCurrentSnapshot();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          Monthly Expenses
          {snapshot && (
            <span className="text-xs text-muted-foreground ml-2">
              (Year {Math.ceil(state.currentMonth / 12)}, Income: {formatCurrency(snapshot.annualGross)})
            </span>
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpanded}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {isExpanded && snapshot && (
        <CardContent className="space-y-3">
          {/* Detailed Expense Breakdown */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Housing & Utilities</h4>
            <div className="pl-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Rent (2BR)</span>
                <span className="font-medium">{formatCurrency(2000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Parking (2 spaces)</span>
                <span className="font-medium">{formatCurrency(200)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Renter's Insurance</span>
                <span className="font-medium">{formatCurrency(30)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Electricity</span>
                <span className="font-medium">{formatCurrency(170)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Natural Gas</span>
                <span className="font-medium">{formatCurrency(70)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Water/Sewer/Trash</span>
                <span className="font-medium">{formatCurrency(90)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Internet</span>
                <span className="font-medium">{formatCurrency(70)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Mobile Phones (2 lines)</span>
                <span className="font-medium">{formatCurrency(120)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Subscriptions</span>
                <CalculationTooltip
                  title="Monthly Subscriptions"
                  calculations={[
                    { label: 'Developer Tools', value: 300 },
                    { label: 'Streaming Services', value: 50 },
                    { label: 'Total', value: 350, isTotal: true }
                  ]}
                >
                  <span className="font-medium cursor-help underline decoration-dotted">
                    {formatCurrency(350)}
                  </span>
                </CalculationTooltip>
              </div>
            </div>
            <div className="flex justify-between font-medium text-sm pt-1">
              <span>Housing & Utilities Total</span>
              <span>{formatCurrency(3100)}</span>
            </div>
          </div>

          <div className="border-t pt-2"></div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Transportation (2 Cars)</h4>
            <div className="pl-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Auto Insurance (2 cars)</span>
                <span className="font-medium">{formatCurrency(600)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Gas (2 cars)</span>
                <span className="font-medium">{formatCurrency(300)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Maintenance/Repairs</span>
                <span className="font-medium">{formatCurrency(140)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Registration & Emissions</span>
                <span className="font-medium">{formatCurrency(8)}</span>
              </div>
            </div>
            <div className="flex justify-between font-medium text-sm pt-1">
              <span>Transportation Total</span>
              <span>{formatCurrency(1048)}</span>
            </div>
          </div>

          <div className="border-t pt-2"></div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Food & Living</h4>
            <div className="pl-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Eating Out</span>
                <span className="font-medium">{formatCurrency(600)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Groceries</span>
                <span className="font-medium">{formatCurrency(400)}</span>
              </div>
            </div>
            <div className="flex justify-between font-medium text-sm pt-1">
              <span>Food & Living Total</span>
              <span>{formatCurrency(1000)}</span>
            </div>
          </div>

          <div className="border-t pt-2"></div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Charitable Giving</h4>
            <div className="pl-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Tithing (10% of gross)</span>
                <CalculationTooltip
                  title="Monthly Tithing"
                  calculations={[
                    { label: 'Annual Base Salary', value: snapshot.annualGross - 15200 },
                    { label: 'Monthly Gross', value: (snapshot.annualGross - 15200) / 12 },
                    { label: '10% Tithing', value: snapshot.monthlyTithing, isTotal: true }
                  ]}
                >
                  <span className="font-medium cursor-help underline decoration-dotted">
                    {formatCurrency(snapshot.monthlyTithing)}
                  </span>
                </CalculationTooltip>
              </div>
            </div>
            <div className="flex justify-between items-center font-medium text-sm pt-1">
              <span>Charitable Total</span>
              <div className="flex items-center gap-2">
                <span>{formatCurrency(snapshot.monthlyTithing)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = '/tithing';
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t pt-3"></div>

          {/* Summary Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Monthly Cash Flow</h4>
            {state.monthlyExpenses.map((expense, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{expense.label}</span>
                <span
                  className={`text-sm font-medium ${
                    expense.amount > 0 ? 'text-success' : 'text-destructive'
                  }`}
                >
                {snapshot && expense.label === 'Net Take Home' ? (
                  <CalculationTooltip
                    title="Net Take Home Calculation"
                    calculations={[
                      { label: 'Monthly Gross', value: snapshot.annualGross / 12 },
                      { label: '401k', value: snapshot.employee401kMonthly, isSubtraction: true },
                      { label: 'Fed Tax', value: snapshot.fedTaxMonthly, isSubtraction: true },
                      { label: 'State Tax', value: snapshot.stateTaxMonthly, isSubtraction: true },
                      { label: 'FICA', value: snapshot.ficaMonthly, isSubtraction: true },
                      { label: 'Net', value: snapshot.netTakeHomeMonthly, isTotal: true }
                    ]}
                  >
                    {formatCurrency(Math.abs(expense.amount))}
                  </CalculationTooltip>
                ) : snapshot && expense.label === 'Available for Goals' ? (
                  <CalculationTooltip
                    title="Budget Available for Goals"
                    calculations={[
                      { label: 'Net Take Home', value: snapshot.netTakeHomeMonthly },
                      { label: 'Living Expenses', value: snapshot.monthlyExpenses, isSubtraction: true },
                      { label: 'Debt Minimums', value: snapshot.debtMinimumsPaidMonthly, isSubtraction: true },
                      { label: 'Available', value: snapshot.goalBudgetDynamicMonthly, isTotal: true }
                    ]}
                  >
                    {formatCurrency(Math.abs(expense.amount))}
                  </CalculationTooltip>
                ) : (
                  formatCurrency(Math.abs(expense.amount))
                )}
              </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center font-medium">
              <span>Total Living Expenses</span>
              <span className="text-destructive">
                {formatCurrency(snapshot.monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center font-medium mt-1">
              <span>Debt Payments</span>
              <span className="text-destructive">
                {formatCurrency(snapshot.debtMinimumsPaidMonthly)}
              </span>
            </div>
            <div className="flex justify-between items-center font-bold mt-2 pt-2 border-t">
              <span>Available for Savings & Goals</span>
              <span className={snapshot.goalBudgetDynamicMonthly > 0 ? 'text-success' : 'text-destructive'}>
                {snapshot ? (
                  <CalculationTooltip
                    title="Budget Available for Goals"
                    calculations={[
                      { label: 'Net Take Home', value: snapshot.netTakeHomeMonthly },
                      { label: 'Living Expenses', value: snapshot.monthlyExpenses, isSubtraction: true },
                      { label: 'Debt Minimums', value: snapshot.debtMinimumsPaidMonthly, isSubtraction: true },
                      { label: 'Available', value: snapshot.goalBudgetDynamicMonthly, isTotal: true }
                    ]}
                  >
                    {formatCurrency(snapshot.goalBudgetDynamicMonthly)}
                  </CalculationTooltip>
                ) : (
                  formatCurrency(0)
                )}
              </span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default MonthlyExpenses;