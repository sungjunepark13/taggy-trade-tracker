
import { Trade, TradeStatus, Tag } from '../context/TradeContext';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num: number, precision: number = 2): string => {
  return num.toFixed(precision);
};

export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const getStatusColor = (status: TradeStatus): string => {
  switch (status) {
    case 'WIN':
      return 'text-success';
    case 'LOSS':
      return 'text-danger';
    case 'BREAKEVEN':
      return 'text-warning';
    default:
      return '';
  }
};

export const getProfitClass = (profit: number): string => {
  if (profit > 0) return 'trade-profit';
  if (profit < 0) return 'trade-loss';
  return 'text-warning';
};

export const calculateTotalProfit = (trades: Trade[]): number => {
  return trades.reduce((total, trade) => total + trade.profit, 0);
};

export const calculateWinRate = (trades: Trade[]): number => {
  if (trades.length === 0) return 0;
  
  const wins = trades.filter(trade => trade.status === 'WIN').length;
  return wins / trades.length;
};

export const calculateAverageProfit = (trades: Trade[]): number => {
  if (trades.length === 0) return 0;
  
  const totalProfit = calculateTotalProfit(trades);
  return totalProfit / trades.length;
};

export const findTagById = (tagId: string, tags: Tag[]): Tag | undefined => {
  return tags.find(tag => tag.id === tagId);
};

export const getTradesByTag = (trades: Trade[], tagId: string): Trade[] => {
  return trades.filter(trade => trade.tags.includes(tagId));
};

export const filterTradesByDate = (trades: Trade[], startDate: Date, endDate: Date): Trade[] => {
  return trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    return tradeDate >= startDate && tradeDate <= endDate;
  });
};

export const getTradesByMonth = (trades: Trade[], year: number, month: number): Trade[] => {
  return trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    return tradeDate.getFullYear() === year && tradeDate.getMonth() === month;
  });
};

export const calculateProfitByTag = (trades: Trade[], tags: Tag[]): Record<string, number> => {
  const profitByTag: Record<string, number> = {};
  
  tags.forEach(tag => {
    const tagTrades = getTradesByTag(trades, tag.id);
    profitByTag[tag.id] = calculateTotalProfit(tagTrades);
  });
  
  return profitByTag;
};

export const calculateWinRateByTag = (trades: Trade[], tags: Tag[]): Record<string, number> => {
  const winRateByTag: Record<string, number> = {};
  
  tags.forEach(tag => {
    const tagTrades = getTradesByTag(trades, tag.id);
    winRateByTag[tag.id] = calculateWinRate(tagTrades);
  });
  
  return winRateByTag;
};
