import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/utils/tradeUtils';

const MonthlyExpenses: React.FC = () => {
  const { state } = useFinance();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Monthly Expenses</CardTitle>
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
      {isExpanded && (
        <CardContent className="space-y-2">
          {state.monthlyExpenses.map((expense, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{expense.label}</span>
              <span 
                className={`text-sm font-medium ${
                  expense.amount > 0 ? 'text-success' : 'text-muted-foreground'
                }`}
              >
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center font-medium">
              <span>Net Remaining</span>
              <span className="text-success">
                {formatCurrency(
                  state.monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
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