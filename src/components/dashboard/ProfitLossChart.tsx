
import React, { useState, useMemo, useEffect } from 'react';
import { useTrades } from '@/context/TradeContext';
import { useBrokerageAccounts } from '@/context/BrokerageAccountsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Time range options in milliseconds
const TIME_RANGES = {
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
};

type TimeRangeKey = keyof typeof TIME_RANGES;

const ProfitLossChart = () => {
  const { state } = useTrades();
  const { trades } = state;
  const { activeAccountId } = useBrokerageAccounts();
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('1d');
  const [noData, setNoData] = useState(false);

  // Filter trades based on the active account
  const accountTrades = useMemo(() => {
    if (!activeAccountId) return trades;
    const filteredTrades = trades.filter(trade => trade.accountId === activeAccountId);
    console.log('Filtered trades for account', activeAccountId, filteredTrades);
    return filteredTrades;
  }, [trades, activeAccountId]);

  useEffect(() => {
    // Update the noData state based on filtered data
    setNoData(accountTrades.length === 0);
  }, [accountTrades]);

  const chartData = useMemo(() => {
    if (!accountTrades.length) return [];

    // Sort trades by date (oldest first)
    const sortedTrades = [...accountTrades].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Create cumulative profit data points
    let cumulativeProfit = 0;
    return sortedTrades.map((trade) => {
      cumulativeProfit += trade.profit;
      return {
        date: new Date(trade.date).getTime(),
        profit: cumulativeProfit,
      };
    });
  }, [accountTrades]);

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    if (!chartData.length) return [];
    
    const now = Date.now();
    const rangeStart = now - TIME_RANGES[timeRange];
    
    // If we don't have enough data for the selected range, show all data
    if (chartData[0].date > rangeStart) {
      return chartData;
    }
    
    return chartData.filter(point => point.date >= rangeStart);
  }, [chartData, timeRange]);

  // Calculate min and max for better axis visualization
  const yMin = Math.min(...filteredData.map(d => d.profit), 0); // Ensure we include 0
  const yMax = Math.max(...filteredData.map(d => d.profit), 0); // Ensure we include 0
  
  // Add some padding to y-axis
  const yDomain = [
    Math.floor(yMin - Math.abs(yMin * 0.1)),
    Math.ceil(yMax + Math.abs(yMax * 0.1))
  ];

  // Format date for X-axis based on selected time range
  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    
    if (timeRange === '5m' || timeRange === '15m' || timeRange === '1h') {
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (timeRange === '4h' || timeRange === '1d') {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  if (noData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            {activeAccountId ? "No trade data available for this account" : "No trade data available"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Profit & Loss</CardTitle>
        <ToggleGroup type="single" value={timeRange} onValueChange={(value: string) => setTimeRange(value as TimeRangeKey)}>
          {Object.keys(TIME_RANGES).map((range) => (
            <ToggleGroupItem key={range} value={range} aria-label={`${range} timeframe`} className="text-xs">
              {range}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer
          config={{
            line: {
              theme: {
                light: "#8B5CF6",
                dark: "#9b87f5"
              }
            }
          }}
        >
          <LineChart data={filteredData} margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis} 
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              domain={yDomain}
              width={80}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="profit"
              name="P&L"
              stroke="var(--color-line)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const profit = data.profit;
  const date = new Date(data.date);
  
  return (
    <div className="bg-background border border-border p-2 rounded-md shadow-md">
      <p className="text-sm font-medium">
        {date.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short'
        })}
      </p>
      <p className={`text-sm font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {formatCurrency(profit)}
      </p>
    </div>
  );
};

export default ProfitLossChart;
