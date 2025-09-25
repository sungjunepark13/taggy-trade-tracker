import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFinance } from '@/context/FinanceContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Lightbulb, User } from 'lucide-react';
import { formatCurrency } from '@/utils/tradeUtils';
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
      title: '401(k) Retirement Planning',
      description: 'Your employer-sponsored retirement account with tax advantages. Contributions are typically made pre-tax, and many employers offer matching contributions. This is crucial for long-term financial security.',
      strategy: 'Maximize Employer Match Strategy: Always contribute enough to get the full employer match - it\'s free money. Aim to contribute 10-15% of your income. Take advantage of catch-up contributions if you\'re over 50. Consider Roth 401(k) options for tax diversification in retirement.',
      tips: [
        'Contribute at least enough to get full employer match',
        'Increase contributions by 1% annually or with each raise',
        'Take advantage of catch-up contributions after age 50',
        'Diversify investments within your 401(k) portfolio',
        'Review and rebalance your portfolio annually',
        'Consider Roth 401(k) contributions for tax diversification'
      ],
      about: 'Your 401(k) is one of the most powerful wealth-building tools available. The combination of tax advantages, employer matching, and compound growth over decades can result in substantial retirement savings. Starting early and contributing consistently, even small amounts, can lead to significant wealth accumulation due to the power of compound interest.'
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
    miscellaneous: {
      title: 'Investment Portfolio',
      description: 'Other investments and assets including savings accounts, CDs, stocks, bonds, or alternative investments. This represents your diversified portfolio beyond primary accounts.',
      strategy: 'Diversified Investment Strategy: Spread investments across different asset classes (stocks, bonds, real estate, commodities). Rebalance regularly to maintain target allocations. Consider low-cost index funds for broad market exposure. Dollar-cost average into investments consistently.',
      tips: [
        'Diversify across different asset classes and sectors',
        'Use low-cost index funds for broad market exposure',
        'Rebalance your portfolio quarterly or semi-annually',
        'Dollar-cost average to reduce timing risk',
        'Keep investment costs low to maximize returns',
        'Stay disciplined and avoid emotional investing decisions'
      ],
      about: 'A diversified investment portfolio is essential for long-term wealth building. This account represents your growth investments beyond retirement accounts and emergency funds. The key to successful investing is consistency, diversification, and keeping costs low. Over time, a well-managed investment portfolio can significantly outpace inflation and build substantial wealth.'
    }
  };

  const account = accountInfo[accountKey];
  if (!account) {
    return <div>Invalid account</div>;
  }

  const currentValue = state.accountData.find(data => data.month === state.currentMonth)?.[accountKey as keyof typeof state.accountData[0]] || 0;

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
              Current Balance: {formatCurrency(currentValue)}
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
              <ChartContainer config={chartConfig}>
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
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Monthly Changes */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Changes</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer config={chartConfig}>
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
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown Table */}
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
                    
                    return (
                      <tr key={data.month} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{displayDate}</td>
                        <td className="text-right p-2 font-medium">
                          {formatCurrency(data.value)}
                        </td>
                        <td className={`text-right p-2 font-medium ${
                          data.change > 0 ? 'text-success' : data.change < 0 ? 'text-destructive' : 'text-muted-foreground'
                        }`}>
                          {index > 0 ? formatCurrency(data.change) : '-'}
                        </td>
                        <td className={`text-right p-2 font-medium ${
                          percentChange > 0 ? 'text-success' : percentChange < 0 ? 'text-destructive' : 'text-muted-foreground'
                        }`}>
                          {index > 0 ? `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
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