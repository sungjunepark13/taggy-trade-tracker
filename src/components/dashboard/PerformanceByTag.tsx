
import React from 'react';
import { useTrades } from '@/context/TradeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateProfitByTag, formatCurrency, calculateWinRateByTag, formatPercent } from '@/utils/tradeUtils';
import { Progress } from '@/components/ui/progress';

const PerformanceByTag: React.FC = () => {
  const { state } = useTrades();
  const { trades, tags } = state;

  const profitByTag = calculateProfitByTag(trades, tags);
  const winRateByTag = calculateWinRateByTag(trades, tags);

  // Sort tags by profit (highest first)
  const sortedTags = [...tags].sort((a, b) => {
    const profitA = profitByTag[a.id] || 0;
    const profitB = profitByTag[b.id] || 0;
    return profitB - profitA;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance By Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTags.map(tag => {
            const profit = profitByTag[tag.id] || 0;
            const winRate = winRateByTag[tag.id] || 0;
            
            // Calculate how many trades use this tag
            const tagTradeCount = trades.filter(trade => 
              trade.tags.includes(tag.id)
            ).length;
            
            if (tagTradeCount === 0) return null;
            
            return (
              <div key={tag.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="font-medium">{tag.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({tagTradeCount} trades)
                    </span>
                  </div>
                  <div className={profit >= 0 ? 'trade-profit' : 'trade-loss'}>
                    {formatCurrency(profit)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={winRate * 100} className="h-2" />
                  <span className="text-xs text-muted-foreground w-12">
                    {formatPercent(winRate)}
                  </span>
                </div>
              </div>
            );
          })}
          
          {sortedTags.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No tags with trades yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceByTag;
