import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'recharts';

const FinanceChart = () => {
  const { state } = useFinance();
  const { accountData, currentMonth } = state;

  // Filter data up to current month
  const filteredData = accountData.filter(data => data.month <= currentMonth);

  const chartConfig = {
    debt: {
      theme: {
        light: "#ef4444",
        dark: "#f87171"
      }
    },
    retirement401: {
      theme: {
        light: "#10b981",
        dark: "#34d399"
      }
    },
    house: {
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa"
      }
    },
    emergencyFund: {
      theme: {
        light: "#f59e0b",
        dark: "#fbbf24"
      }
    },
    checking: {
      theme: {
        light: "#8b5cf6",
        dark: "#a78bfa"
      }
    },
    miscellaneous: {
      theme: {
        light: "#ec4899",
        dark: "#f472b6"
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Balances Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                dataKey="debt"
                stroke="var(--color-debt)"
                strokeWidth={2}
                dot={false}
                name="Debt"
              />
              <Line
                type="monotone"
                dataKey="retirement401"
                stroke="var(--color-retirement401)"
                strokeWidth={2}
                dot={false}
                name="401(k)"
              />
              <Line
                type="monotone"
                dataKey="house"
                stroke="var(--color-house)"
                strokeWidth={2}
                dot={false}
                name="House"
              />
              <Line
                type="monotone"
                dataKey="emergencyFund"
                stroke="var(--color-emergencyFund)"
                strokeWidth={2}
                dot={false}
                name="Emergency Fund"
              />
              <Line
                type="monotone"
                dataKey="checking"
                stroke="var(--color-checking)"
                strokeWidth={2}
                dot={false}
                name="Checking"
              />
              <Line
                type="monotone"
                dataKey="miscellaneous"
                stroke="var(--color-miscellaneous)"
                strokeWidth={2}
                dot={false}
                name="Miscellaneous"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-background border border-border p-3 rounded-md shadow-md">
      <p className="text-sm font-medium mb-2">Month {label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: ${entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default FinanceChart;