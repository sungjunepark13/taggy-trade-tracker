import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFinance } from '@/context/FinanceContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Lightbulb, User } from 'lucide-react';
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
  Bar,
  BarChart,
} from 'recharts';

// Helper function to generate balance with calculation tooltip
const getBalanceWithTooltip = (accountKey: string, value: number, snapshot: any) => {
  if (!snapshot) {
    return formatCurrency(value);
  }

  let calculations: any[] = [];

  switch (accountKey) {
    case 'retirement401':
      calculations = [
        { label: 'Employee 401(k)', value: snapshot.employee401k },
        { label: 'Employer Match', value: snapshot.employerMatch },
        { label: 'Wealth Builder', value: snapshot.employerWealthBuilder },
        { label: 'HSA Balance', value: snapshot.hsaBalance },
        { label: 'Extra Contributions', value: snapshot.retirementBalanceExtra },
        { label: 'Total', value: snapshot.retirementBalanceTotal, isTotal: true }
      ];
      break;
    case 'debt':
      calculations = [
        { label: 'Private Loan (10% APR)', value: snapshot.debtPrivate10 },
        { label: 'Student Loan (7% APR)', value: snapshot.debtStudent7 },
        { label: 'Private Loan (0% APR)', value: snapshot.debtPrivate0 },
        { label: 'Total Debt', value: snapshot.totalDebt, isTotal: true }
      ];
      break;
    case 'emergencyFund':
      calculations = [
        { label: 'Emergency Fund Balance', value: snapshot.emergencyFund },
        { label: 'Target (Final)', value: 20000 },
        { label: 'Progress', value: (snapshot.emergencyFund / 20000 * 100).toFixed(1) + '%', isPercentage: true }
      ];
      break;
    case 'checking':
      calculations = [
        { label: 'Earnest Money', value: snapshot.earnest },
        { label: 'Target', value: 15000 },
        { label: 'Progress', value: (snapshot.earnest / 15000 * 100).toFixed(1) + '%', isPercentage: true }
      ];
      break;
    case 'house':
      calculations = [
        { label: 'Down Payment Saved', value: snapshot.downPayment },
        { label: 'Target', value: 75000 },
        { label: 'Progress', value: (snapshot.downPayment / 75000 * 100).toFixed(1) + '%', isPercentage: true }
      ];
      break;
    case 'vacationFund':
      calculations = [
        { label: 'Current Balance', value: snapshot.vacationFund },
        { label: 'Target', value: 5000 },
        { label: 'Well-being Subsidy (Monthly)', value: snapshot.wellBeingSubsidy },
        { label: 'Progress', value: `${(snapshot.vacationFund / 5000 * 100).toFixed(1)}%`, isPercentage: true }
      ];
      break;
    case 'trustFund':
      calculations = [
        { label: 'Current Balance', value: snapshot.trustFund },
        { label: '5-Year Target', value: 50000 },
        { label: 'Monthly Allocation', value: snapshot.allocTrustFund },
        { label: 'Progress', value: `${(snapshot.trustFund / 50000 * 100).toFixed(1)}%`, isPercentage: true }
      ];
      break;
    case 'miscellaneous':
      calculations = [
        { label: 'Vacation Fund', value: snapshot.vacationFund },
        { label: 'Charity Fund', value: snapshot.charityFund },
        { label: 'Well-being Subsidy', value: snapshot.wellBeingSubsidy },
        { label: 'Total Combined', value: snapshot.vacationFund + snapshot.charityFund, isTotal: true }
      ];
      break;
    case 'charityFund':
      calculations = [
        { label: 'Current Balance', value: snapshot.charityFund },
        { label: '5-Year Target', value: 50000 },
        { label: 'Monthly Goal', value: 833 },
        { label: 'Progress', value: (snapshot.charityFund / 50000 * 100).toFixed(1) + '%' }
      ];
      break;
    default:
      return formatCurrency(value);
  }

  return (
    <CalculationTooltip
      title="Balance Breakdown"
      calculations={calculations}
    >
      {formatCurrency(value)}
    </CalculationTooltip>
  );
};

const AccountDetail: React.FC = () => {
  const { accountKey } = useParams<{ accountKey: string }>();
  const navigate = useNavigate();
  const { state } = useFinance();

  if (!accountKey) {
    return <div>Invalid account</div>;
  }

  const accountInfo: Record<string, { 
    title: string; 
    description: string;
    strategy: string;
    tips: string[];
    about: string;
  }> = {
    debt: {
      title: 'Debt Management',
      description: 'Track your total outstanding debt including credit cards, loans, and other liabilities. The goal is to systematically reduce this balance through consistent payments while avoiding new debt accumulation.',
      strategy: 'Debt Avalanche Strategy: Focus on paying off high-interest debt first while making minimum payments on other debts. This approach saves the most money in interest over time. Consider debt consolidation if it offers lower interest rates, and create a strict budget to prevent new debt accumulation.',
      tips: [
        'Pay more than the minimum payment whenever possible',
        'Consider the debt avalanche method (highest interest first) or debt snowball (smallest balance first)',
        'Avoid taking on new debt while paying off existing balances',
        'Look into debt consolidation options for better interest rates',
        'Create an emergency fund to avoid future debt',
        'Track your debt-to-income ratio and aim to keep it below 36%'
      ],
      about: 'Debt management is crucial for financial health. High-interest debt can significantly impact your ability to build wealth. By systematically reducing debt, you free up money for savings and investments. The psychological benefit of becoming debt-free cannot be overstated - it provides peace of mind and financial flexibility for future opportunities.'
    },
    retirement401: {
      title: '401(k) & Big 4 Retirement Benefits',
      description: 'Combined retirement accounts including 401(k)s with employer matches, PwC Wealth Builder (3% automatic), Deloitte Cash Balance (3% automatic), and HSA accounts. Total employer contributions: ~$15,200/year.',
      strategy: 'Big 4 Benefits Optimization: Contributing 6% to 401(k) unlocks full matches (PwC: 1.5%, Deloitte: 3%). Plus automatic Wealth Builder & Cash Balance (6% combined). HSAs add $700/year from PwC. Student loan assistance ($1,200/year) and well-being subsidies ($1,000/year) free up more for savings.',
      tips: [
        'Always contribute 6% minimum to get full 401(k) matches',
        'PwC Wealth Builder: 3% automatic contribution (no action needed)',
        'Deloitte Cash Balance: 3% automatic contribution (no action needed)',
        'Choose High Deductible Health Plans for HSA eligibility',
        'HSA triple tax advantage: deductible, tax-free growth, tax-free withdrawals',
        'Apply for PwC student loan assistance ($100/month)',
        'Claim Deloitte well-being subsidy ($1,000/year)',
        'Combined employer contributions total ~$15,200/year'
      ],
      about: 'Big 4 firms offer exceptional retirement benefits beyond standard 401(k)s. PwC\'s Wealth Builder and Deloitte\'s Cash Balance Plan provide 6% combined automatic contributions requiring zero employee contribution. Add 401(k) matches (4.5% average), HSA contributions ($700), student loan assistance ($1,200), and well-being subsidies ($1,000), totaling over $15,000 in annual benefits. This creates a 127% ROI on your 6% 401(k) contributions.'
    },
    house: {
      title: 'Home Equity & Real Estate',
      description: 'The estimated market value of your primary residence. This typically appreciates over time and represents a significant portion of your net worth. Track improvements and market changes that affect value.',
      strategy: 'Home Equity Building Strategy: Focus on making extra principal payments to build equity faster. Consider home improvements that add value, particularly kitchen and bathroom renovations. Monitor local market trends and consider refinancing when rates are favorable.',
      tips: [
        'Make extra principal payments to build equity faster',
        'Invest in home improvements that add value (kitchen, bathrooms)',
        'Monitor local real estate market trends',
        'Consider refinancing when interest rates drop significantly',
        'Maintain your property to preserve and increase value',
        'Keep detailed records of home improvements for tax purposes'
      ],
      about: 'Real estate has historically been one of the best long-term investments for building wealth. Your home serves dual purposes - providing shelter and building equity. Unlike other investments, you can live in your real estate investment while it appreciates. Home equity can also be leveraged for other investments or major expenses through home equity loans or lines of credit.'
    },
    emergencyFund: {
      title: 'Emergency Fund',
      description: 'A savings buffer for unexpected expenses like medical bills, job loss, or major repairs. Financial experts recommend 3-6 months of living expenses in this readily accessible fund.',
      strategy: 'Emergency Fund Strategy: Start with a goal of $1,000, then build to 3-6 months of expenses. Keep funds in a high-yield savings account for easy access. Automate contributions to build the fund consistently. Only use for true emergencies, not planned expenses.',
      tips: [
        'Start with a mini emergency fund of $1,000',
        'Build to 3-6 months of living expenses gradually',
        'Keep funds in a high-yield savings account for liquidity',
        'Automate monthly contributions to build consistently',
        'Only use for true emergencies, not planned purchases',
        'Replenish immediately after using emergency funds'
      ],
      about: 'An emergency fund is your financial safety net and the foundation of financial security. It prevents you from going into debt when unexpected expenses arise and provides peace of mind. Having an emergency fund allows you to take calculated risks in other areas of your financial life, knowing you have a buffer for unforeseen circumstances.'
    },
    checking: {
      title: 'Checking Account & Cash Flow',
      description: 'Your primary liquid account for daily transactions, bill payments, and short-term cash management. This balance fluctuates with your income and spending patterns.',
      strategy: 'Cash Flow Management Strategy: Maintain 1-2 months of expenses in checking for smooth cash flow. Use budgeting tools to track income and expenses. Set up automatic bill payments to avoid late fees. Keep some buffer for unexpected expenses.',
      tips: [
        'Maintain 1-2 months of expenses for smooth cash flow',
        'Set up automatic bill payments to avoid late fees',
        'Use budgeting apps to track spending patterns',
        'Review monthly statements for unauthorized charges',
        'Keep a small buffer for unexpected expenses',
        'Consider high-yield checking accounts for better returns'
      ],
      about: 'Your checking account is the hub of your financial life. Proper cash flow management ensures you can meet your obligations while maximizing the money available for savings and investments. Good checking account management includes maintaining adequate balances, monitoring transactions, and optimizing the timing of income and expenses.'
    },
    vacationFund: {
      title: 'Vacation Fund',
      description: 'Dedicated savings for annual family vacations with a $5,000 target. This fund receives the Deloitte well-being subsidy of $1,000/year ($83.33/month) to help reach the goal faster.',
      strategy: 'Annual Reset Strategy: Build to $5,000 target for yearly vacations, then use for trip and restart. The well-being subsidy provides a consistent base, requiring only ~$333/month additional to reach the target within a year.',
      tips: [
        'Target: $5,000 for annual family vacation',
        'Well-being subsidy: $83.33/month automatic',
        'Additional needed: ~$333/month to reach goal',
        'Keep funds liquid in high-yield savings',
        'Plan trips in advance for better deals',
        'Consider travel rewards credit cards for additional savings'
      ],
      about: 'The vacation fund ensures work-life balance and creates lasting family memories. Regular vacations are essential for mental health, relationship building, and experiencing new cultures. The Deloitte well-being subsidy makes this goal more achievable, covering 20% of the annual target automatically.'
    },
    charityFund: {
      title: 'Charity Fund',
      description: 'Long-term charitable giving fund. Target of $50,000 over 5 years (~$833/month) to support causes we care about and make a positive impact in the community.',
      strategy: 'Strategic Giving Strategy: Contribute ~$833/month consistently to reach $50,000 in 5 years. Plan charitable contributions for maximum tax efficiency. Consider donor-advised funds for flexibility in timing donations.',
      tips: [
        '5-Year Target: $50,000',
        'Monthly Goal: $833',
        'Consider donor-advised funds for flexibility',
        'Plan donations for tax efficiency',
        'Research charities for maximum impact',
        'Track charitable receipts for tax deductions',
        'Consider matching gift programs from employers'
      ],
      about: 'The charity fund represents our commitment to giving back and making a positive impact in our community and beyond. This fund enables strategic charitable giving, supporting causes we care about while also providing tax benefits. It demonstrates our values and commitment to social responsibility.'
    },
    miscellaneous: {
      title: 'Vacation & Charity Funds',
      description: 'Combined savings for annual vacations ($5k target) and charitable giving ($50k target over 5 years). Vacation fund receives the well-being subsidy from Deloitte ($1,000/year).',
      strategy: 'Dual-Purpose Savings Strategy: Build vacation fund to $5k for annual family trips while systematically contributing ~$833/month to charity fund. The charity fund enables strategic giving to causes we care about.',
      tips: [
        'Vacation fund target: $5,000 for annual trips',
        'Charity fund target: $50,000 over 5 years (~$833/month)',
        'Well-being subsidy ($83.33/month) goes to vacation fund',
        'Consider donor-advised funds for flexible charitable giving',
        'Plan charitable contributions strategically for tax efficiency',
        'Keep vacation fund liquid for annual use'
      ],
      about: 'These funds serve two important personal purposes: creating memories through annual vacations and making a positive impact through charitable giving. The vacation fund ensures work-life balance and family bonding, while the charity fund enables us to support causes we believe in and give back to the community. The Deloitte well-being subsidy helps fund vacations, making this goal more achievable.'
    }
  };

  const account = accountInfo[accountKey];
  if (!account) {
    return <div>Invalid account</div>;
  }

  const currentValue = state.accountData.find(data => data.month === state.currentMonth)?.[accountKey as keyof typeof state.accountData[0]] || 0;
  const currentSnapshot = state.snapshots.find(s => s.month === state.currentMonth);

  // Calculate monthly changes
  const monthlyData = state.accountData.map((data, index) => {
    const currentValue = data[accountKey as keyof typeof data] as number;
    const previousValue = index > 0 ? state.accountData[index - 1][accountKey as keyof typeof data] as number : currentValue;
    const change = currentValue - previousValue;
    
    return {
      month: data.month,
      value: currentValue,
      change: change,
    };
  });

  const chartConfig = {
    value: {
      theme: {
        light: "#8B5CF6",
        dark: "#9b87f5"
      }
    },
    change: {
      theme: {
        light: "#10b981",
        dark: "#34d399"
      }
    }
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
            <h1 className="text-3xl font-bold tracking-tight">{account.title}</h1>
            <p className="text-muted-foreground mb-3">
              Current Balance: {getBalanceWithTooltip(accountKey, currentValue, currentSnapshot)}
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {account.description}
            </p>
          </div>
        </div>

        {/* Strategy, Tips, and About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {account.strategy}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {account.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {account.about}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Balance Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Balance Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                    <ChartTooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-value)"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name={account.title}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Monthly Changes */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Changes</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData.slice(1)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                      tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChangeTooltip />} />
                    <Bar
                      dataKey="change"
                      fill="var(--color-change)"
                      name="Monthly Change"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown Table - Special for Retirement */}
        {accountKey === 'retirement401' ? (
          <Card>
            <CardHeader>
              <CardTitle>Retirement Accounts Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Month</th>
                      <th className="text-right p-2">Employee 401(k)</th>
                      <th className="text-right p-2">Employer Match</th>
                      <th className="text-right p-2">Wealth Builder</th>
                      <th className="text-right p-2">HSA Balance</th>
                      <th className="text-right p-2">Extra Contrib</th>
                      <th className="text-right p-2">Total Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.snapshots.map((snapshot, index) => {
                      const year = Math.ceil(snapshot.month / 12);
                      const monthInYear = ((snapshot.month - 1) % 12) + 1;
                      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const displayDate = `${monthNames[monthInYear - 1]} Y${year}`;

                      return (
                        <tr key={snapshot.month} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{displayDate}</td>
                          <td className="text-right p-2">
                            <CalculationTooltip
                              title="Employee 401(k)"
                              calculations={[
                                { label: 'Monthly Contribution', value: snapshot.employee401kMonthly },
                                { label: 'Contribution Rate', value: (snapshot.employee401kRate * 100).toFixed(0) + '%', isPercentage: true },
                                { label: 'Growth Applied (6% annual)', value: snapshot.employee401k - (snapshot.employee401kMonthly * snapshot.month) },
                                { label: 'Total Balance', value: snapshot.employee401k, isTotal: true }
                              ]}
                            >
                              {formatCurrency(snapshot.employee401k)}
                            </CalculationTooltip>
                          </td>
                          <td className="text-right p-2">
                            <CalculationTooltip
                              title="Employer Match"
                              calculations={[
                                { label: 'Monthly Match', value: snapshot.employerMatchMonthly },
                                { label: 'Match Rate (PwC + Deloitte)', value: '4.5%', isPercentage: true },
                                { label: 'Total Accumulated', value: snapshot.employerMatch, isTotal: true }
                              ]}
                            >
                              {formatCurrency(snapshot.employerMatch)}
                            </CalculationTooltip>
                          </td>
                          <td className="text-right p-2">
                            <CalculationTooltip
                              title="Wealth Builder & Cash Balance"
                              calculations={[
                                { label: 'PwC Wealth Builder (3%)', value: snapshot.employerWealthBuilderMonthly / 2 },
                                { label: 'Deloitte Cash Balance (3%)', value: snapshot.employerWealthBuilderMonthly / 2 },
                                { label: 'Monthly Total', value: snapshot.employerWealthBuilderMonthly },
                                { label: 'Total Accumulated', value: snapshot.employerWealthBuilder, isTotal: true }
                              ]}
                            >
                              {formatCurrency(snapshot.employerWealthBuilder)}
                            </CalculationTooltip>
                          </td>
                          <td className="text-right p-2">
                            <CalculationTooltip
                              title="HSA Balance"
                              calculations={[
                                { label: 'Employee Contribution', value: snapshot.hsaEmployeeMonthly },
                                { label: 'Employer Contribution', value: snapshot.hsaEmployerMonthly },
                                { label: 'Monthly Total', value: snapshot.hsaEmployeeMonthly + snapshot.hsaEmployerMonthly },
                                { label: 'Total Balance', value: snapshot.hsaBalance, isTotal: true }
                              ]}
                            >
                              {formatCurrency(snapshot.hsaBalance)}
                            </CalculationTooltip>
                          </td>
                          <td className="text-right p-2">
                            <CalculationTooltip
                              title="Extra Retirement Savings"
                              calculations={[
                                { label: 'This Month', value: snapshot.allocRetirementExtra },
                                { label: 'Total Extra Savings', value: snapshot.retirementBalanceExtra, isTotal: true }
                              ]}
                            >
                              {formatCurrency(snapshot.retirementBalanceExtra)}
                            </CalculationTooltip>
                          </td>
                          <td className="text-right p-2 font-bold">
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
                              {formatCurrency(snapshot.retirementBalanceTotal)}
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
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Month</th>
                      <th className="text-right p-2">Balance</th>
                      <th className="text-right p-2">Change</th>
                      <th className="text-right p-2">% Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((data, index) => {
                      const percentChange = index > 0 ?
                        ((data.value - monthlyData[index - 1].value) / monthlyData[index - 1].value * 100) : 0;

                      const year = Math.ceil(data.month / 12);
                      const monthInYear = ((data.month - 1) % 12) + 1;
                      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const displayDate = `${monthNames[monthInYear - 1]} Y${year}`;

                      const monthSnapshot = state.snapshots.find(s => s.month === data.month);

                      return (
                        <tr key={data.month} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{displayDate}</td>
                          <td className="text-right p-2 font-medium">
                            {monthSnapshot ? getBalanceWithTooltip(accountKey, data.value, monthSnapshot) : formatCurrency(data.value)}
                          </td>
                          <td className={`text-right p-2 font-medium ${
                            data.change > 0 ? 'text-success' : data.change < 0 ? 'text-destructive' : 'text-muted-foreground'
                          }`}>
                            {index > 0 ? (
                              monthSnapshot ? (
                                <CalculationTooltip
                                  title="Monthly Change"
                                  calculations={[
                                    { label: 'Previous Balance', value: monthlyData[index - 1].value },
                                    { label: 'Current Balance', value: data.value },
                                    { label: 'Change', value: data.change, isTotal: true }
                                  ]}
                                >
                                  {formatCurrency(data.change)}
                                </CalculationTooltip>
                              ) : formatCurrency(data.change)
                            ) : '-'}
                          </td>
                          <td className={`text-right p-2 font-medium ${
                            percentChange > 0 ? 'text-success' : percentChange < 0 ? 'text-destructive' : 'text-muted-foreground'
                          }`}>
                            {index > 0 ? (
                              monthSnapshot && monthlyData[index - 1].value > 0 ? (
                                <CalculationTooltip
                                  title="Percentage Change"
                                  calculations={[
                                    { label: 'Change Amount', value: data.change },
                                    { label: 'Previous Balance', value: monthlyData[index - 1].value },
                                    { label: 'Calculation', value: `(${formatCurrency(data.change)} / ${formatCurrency(monthlyData[index - 1].value)}) × 100`, isNote: true }
                                  ]}
                                >
                                  {`${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`}
                                </CalculationTooltip>
                              ) : `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`
                            ) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-background border border-border p-3 rounded-md shadow-md">
      <p className="text-sm font-medium mb-1">{(() => {
        const year = Math.ceil(label / 12);
        const monthInYear = ((label - 1) % 12) + 1;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[monthInYear - 1]} Y${year}`;
      })()}</p>
      <p className="text-sm" style={{ color: payload[0].color }}>
        Balance: {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

const ChangeTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const change = payload[0].value;
  return (
    <div className="bg-background border border-border p-3 rounded-md shadow-md">
      <p className="text-sm font-medium mb-1">{(() => {
        const year = Math.ceil(label / 12);
        const monthInYear = ((label - 1) % 12) + 1;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[monthInYear - 1]} Y${year}`;
      })()}</p>
      <p className={`text-sm ${change > 0 ? 'text-success' : change < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
        Change: {formatCurrency(change)}
      </p>
    </div>
  );
};

export default AccountDetail;