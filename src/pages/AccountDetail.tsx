import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFinance } from '@/context/FinanceContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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

  const accountTitles: Record<string, string> = {
    debt: 'Debt',
    retirement401: '401(k)',
    house: 'House',
    emergencyFund: 'Emergency Fund',
    checking: 'Checking',
    miscellaneous: 'Miscellaneous',
  };

  const accountTitle = accountTitles[accountKey] || 'Unknown Account';
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
            <h1 className="text-3xl font-bold tracking-tight">{accountTitle}</h1>
            <p className="text-muted-foreground">
              Current Balance: {formatCurrency(currentValue)}
            </p>
          </div>
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
                    tickFormatter={(value) => `Month ${value}`}
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
                    name={accountTitle}
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
                    tickFormatter={(value) => `Month ${value}`}
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
                    
                    return (
                      <tr key={data.month} className="border-b">
                        <td className="p-2">Month {data.month}</td>
                        <td className="text-right p-2 font-medium">
                          {formatCurrency(data.value)}
                        </td>
                        <td className={`text-right p-2 ${
                          data.change > 0 ? 'text-success' : data.change < 0 ? 'text-destructive' : 'text-muted-foreground'
                        }`}>
                          {index > 0 ? formatCurrency(data.change) : '-'}
                        </td>
                        <td className={`text-right p-2 ${
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
      <p className="text-sm font-medium mb-1">Month {label}</p>
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
      <p className="text-sm font-medium mb-1">Month {label}</p>
      <p className={`text-sm ${change > 0 ? 'text-success' : change < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
        Change: {formatCurrency(change)}
      </p>
    </div>
  );
};

export default AccountDetail;