import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FinancialScenario } from '@/utils/financialEngine';
import { Briefcase } from 'lucide-react';

export const ScenarioSummary: React.FC = () => {
  const [scenario, setScenario] = useState<FinancialScenario | null>(null);

  useEffect(() => {
    // Load scenario from localStorage
    try {
      const stored = localStorage.getItem('financialScenario');
      if (stored) {
        setScenario(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading scenario:', error);
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!scenario) {
    return (
      <Card className="mb-6 bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">No Financial Plan Yet</CardTitle>
          <CardDescription className="text-white/80">
            Complete the setup to create your personalized financial plan
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalDebt = scenario.initialDebts.reduce((sum, debt) => sum + debt.balance, 0);

  return (
    <Card className="mb-6 bg-black/40 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Your Financial Plan</CardTitle>
        <CardDescription className="text-white/80">
          {scenario.employment ?
            `${scenario.employment.position} at ${scenario.employment.firm} • ${scenario.employment.location}` :
            `${scenario.planningHorizon}-month financial plan in ${scenario.location}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenario.employment && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-white/80 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Employment
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/80">Firm:</span>
                  <Badge variant="secondary" className="bg-white/20 text-white">{scenario.employment.firm}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/80">Position:</span>
                  <span className="font-medium text-white">{scenario.employment.position}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/80">Years at firm:</span>
                  <span className="font-medium text-white">{scenario.employment.yearsAtFirm}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/80">Location:</span>
                  <span className="font-medium text-white">{scenario.employment.location}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-white/80">Income Projection</h3>
            <div className="space-y-2 text-sm">
              {scenario.incomeByYear.map((income, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-white/80">Year {idx + 1}:</span>
                  <span className="font-medium text-white">{formatCurrency(income)}</span>
                </div>
              ))}
            </div>
          </div>

          {scenario.initialDebts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-white/80">Initial Debts</h3>
              <div className="space-y-2 text-sm">
                {scenario.initialDebts.map((debt, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-white/80">{debt.name}:</span>
                    <span className="font-medium text-red-400">{formatCurrency(debt.balance)}</span>
                  </div>
                ))}
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white/80">Total Debt:</span>
                    <span className="text-red-400">{formatCurrency(totalDebt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-white/80">Financial Goals</h3>
            <div className="space-y-2 text-sm">
              {scenario.earnestMoneyTarget > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/80">Earnest Money:</span>
                  <span className="font-medium text-white">{formatCurrency(scenario.earnestMoneyTarget)}</span>
                </div>
              )}
              {scenario.efStarterTarget > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/80">EF Starter:</span>
                  <span className="font-medium text-white">{formatCurrency(scenario.efStarterTarget)}</span>
                </div>
              )}
              {scenario.downPaymentTarget > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/80">Down Payment:</span>
                  <span className="font-medium text-white">{formatCurrency(scenario.downPaymentTarget)}</span>
                </div>
              )}
              {scenario.efFinalTarget > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/80">EF Final:</span>
                  <span className="font-medium text-white">{formatCurrency(scenario.efFinalTarget)}</span>
                </div>
              )}
              {scenario.vacationFundTarget > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/80">Vacation Fund:</span>
                  <span className="font-medium text-white">{formatCurrency(scenario.vacationFundTarget)}</span>
                </div>
              )}
              {scenario.charityTarget > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/80">Charity Fund:</span>
                  <span className="font-medium text-white">{formatCurrency(scenario.charityTarget)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};