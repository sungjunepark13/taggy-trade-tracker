
import React from 'react';
import { useTrades } from '@/context/TradeContext';
import {
  calculateTotalProfit,
  calculateWinRate,
  calculateAverageProfit,
  formatCurrency,
  formatPercent,
} from '@/utils/tradeUtils';
import StatCard from './StatCard';
import { DollarSign, TrendingUp, Activity, Calendar } from 'lucide-react';

const TradeStats: React.FC = () => {
  const { state } = useTrades();
  const { trades } = state;

  const totalProfit = calculateTotalProfit(trades);
  const winRate = calculateWinRate(trades);
  const averageProfit = calculateAverageProfit(trades);
  
  // Get trades from the current month
  const now = new Date();
  const currentMonthTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    return (
      tradeDate.getMonth() === now.getMonth() &&
      tradeDate.getFullYear() === now.getFullYear()
    );
  });
  
  const currentMonthProfit = calculateTotalProfit(currentMonthTrades);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total P&L"
        value={formatCurrency(totalProfit)}
        icon={DollarSign}
        trend={totalProfit > 0 ? 'up' : totalProfit < 0 ? 'down' : 'neutral'}
        trendValue={`${totalProfit > 0 ? '+' : ''}${formatCurrency(totalProfit)}`}
      />
      <StatCard
        title="Win Rate"
        value={formatPercent(winRate)}
        icon={TrendingUp}
        description={`${trades.filter(t => t.status === 'WIN').length} of ${trades.length} trades`}
      />
      <StatCard
        title="Avg. Profit Per Trade"
        value={formatCurrency(averageProfit)}
        icon={Activity}
        trend={averageProfit > 0 ? 'up' : averageProfit < 0 ? 'down' : 'neutral'}
        trendValue={`${averageProfit > 0 ? '+' : ''}${formatCurrency(averageProfit)}`}
      />
      <StatCard
        title="This Month"
        value={formatCurrency(currentMonthProfit)}
        icon={Calendar}
        trend={currentMonthProfit > 0 ? 'up' : currentMonthProfit < 0 ? 'down' : 'neutral'}
        trendValue={`${currentMonthProfit > 0 ? '+' : ''}${formatCurrency(currentMonthProfit)}`}
        description={`${currentMonthTrades.length} trades this month`}
      />
    </div>
  );
};

export default TradeStats;
