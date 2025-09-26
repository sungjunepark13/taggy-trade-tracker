import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/tradeUtils';
import { CalculationTooltip } from '@/components/ui/calculation-tooltip';
import { useFinance } from '@/context/FinanceContext';

interface AccountCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  accountKey: string;
  className?: string;
}

const getAccountCalculations = (accountKey: string, snapshot: any, value: number) => {
  switch (accountKey) {
    case 'retirement401':
      return [
        { label: 'Employee 401(k)', value: snapshot.employee401k },
        { label: 'Employer Match', value: snapshot.employerMatch },
        { label: 'Wealth Builder', value: snapshot.employerWealthBuilder },
        { label: 'HSA Balance', value: snapshot.hsaBalance },
        { label: 'Total', value: snapshot.retirementBalanceTotal, isTotal: true }
      ];
    case 'debt':
      return [
        { label: 'Private Loan (10%)', value: snapshot.debtPrivate10 },
        { label: 'Student Loan (7%)', value: snapshot.debtStudent7 },
        { label: 'Private Loan (0%)', value: snapshot.debtPrivate0 },
        { label: 'Total', value: snapshot.totalDebt, isTotal: true }
      ];
    case 'emergencyFund':
      return [
        { label: 'Current Balance', value: snapshot.emergencyFund },
        { label: 'Target', value: 20000 },
        { label: 'Remaining', value: Math.max(0, 20000 - snapshot.emergencyFund) }
      ];
    case 'checking':
      return [
        { label: 'Earnest Money', value: snapshot.earnest },
        { label: 'Target', value: 15000 },
        { label: 'Remaining', value: Math.max(0, 15000 - snapshot.earnest) }
      ];
    case 'house':
      return [
        { label: 'Down Payment Saved', value: snapshot.downPayment },
        { label: 'Target', value: 75000 },
        { label: 'Remaining', value: Math.max(0, 75000 - snapshot.downPayment) }
      ];
    case 'vacationFund':
      return [
        { label: 'Current Balance', value: snapshot.vacationFund },
        { label: 'Target', value: 5000 },
        { label: 'Well-being Subsidy', value: snapshot.wellBeingSubsidy },
        { label: 'Progress', value: `${(snapshot.vacationFund / 5000 * 100).toFixed(1)}%`, isPercentage: true }
      ];
    case 'trustFund':
      return [
        { label: 'Current Balance', value: snapshot.trustFund },
        { label: '5-Year Target', value: 50000 },
        { label: 'Monthly Goal', value: 833 },
        { label: 'Progress', value: `${(snapshot.trustFund / 50000 * 100).toFixed(1)}%`, isPercentage: true }
      ];
    default:
      return [{ label: 'Value', value }];
  }
};

const AccountCard: React.FC<AccountCardProps> = ({
  title,
  value,
  icon: Icon,
  accountKey,
  className,
}) => {
  const navigate = useNavigate();
  const { state } = useFinance();
  const currentSnapshot = state.snapshots.find(s => s.month === state.currentMonth);

  const handleClick = () => {
    navigate(`/account/${accountKey}`);
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currentSnapshot ? (
            <CalculationTooltip
              title={`${title} Breakdown`}
              calculations={getAccountCalculations(accountKey, currentSnapshot, value)}
            >
              {formatCurrency(value)}
            </CalculationTooltip>
          ) : (
            formatCurrency(value)
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;