
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrades, Trade } from '@/context/TradeContext';
import { formatCurrency } from '@/utils/tradeUtils';
import TradeList from '../trades/TradeList';

const TradeCalendar: React.FC = () => {
  const { state } = useTrades();
  const { trades } = state;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Group trades by date for calendar highlighting
  const tradesByDate: Record<string, Trade[]> = {};
  const profitByDate: Record<string, number> = {};
  
  trades.forEach(trade => {
    const dateStr = trade.date;
    if (!tradesByDate[dateStr]) {
      tradesByDate[dateStr] = [];
      profitByDate[dateStr] = 0;
    }
    tradesByDate[dateStr].push(trade);
    profitByDate[dateStr] += trade.profit;
  });
  
  // Filter trades for selected date
  const selectedDateStr = selectedDate?.toISOString().split('T')[0];
  const selectedTrades = selectedDateStr ? tradesByDate[selectedDateStr] || [] : [];
  
  // Custom day rendering for the calendar
  const renderDay = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    const tradesOnDate = tradesByDate[dateStr];
    
    if (!tradesOnDate) return null;
    
    const profit = profitByDate[dateStr];
    const isProfit = profit > 0;
    const isLoss = profit < 0;
    
    return (
      <div className="relative h-full w-full p-2">
        <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-foreground" />
        <div 
          className={`w-full h-1 absolute bottom-1 rounded-full ${
            isProfit ? 'bg-success' : isLoss ? 'bg-danger' : 'bg-warning'
          }`}
        />
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trade Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border shadow"
                components={{
                  DayContent: ({ date }) => (
                    <>
                      {date.getDate()}
                      {renderDay(date)}
                    </>
                  ),
                }}
              />
            </div>
            <div className="lg:w-1/2">
              {selectedDate ? (
                <>
                  <h3 className="text-lg font-medium mb-4">
                    Trades on {selectedDate.toLocaleDateString()}
                  </h3>
                  {selectedTrades.length > 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-md bg-muted">
                        <div className="text-sm text-muted-foreground mb-1">Total P&L</div>
                        <div className={`text-xl font-bold ${
                          profitByDate[selectedDateStr!] > 0 
                            ? 'text-success' 
                            : profitByDate[selectedDateStr!] < 0 
                              ? 'text-danger' 
                              : ''
                        }`}>
                          {formatCurrency(profitByDate[selectedDateStr!] || 0)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {selectedTrades.map(trade => (
                          <div 
                            key={trade.id} 
                            className="p-3 border rounded-md flex justify-between items-center"
                          >
                            <div>
                              <div className="font-medium">{trade.symbol} ({trade.type})</div>
                              <div className="text-sm text-muted-foreground">
                                {trade.quantity} @ {trade.entryPrice} → {trade.exitPrice}
                              </div>
                            </div>
                            <div className={`font-medium ${
                              trade.profit > 0 
                                ? 'text-success' 
                                : trade.profit < 0 
                                  ? 'text-danger' 
                                  : ''
                            }`}>
                              {formatCurrency(trade.profit)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No trades on this date.
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a date to view trades
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedDate && selectedTrades.length > 0 && (
        <TradeList 
          title={`Trades on ${selectedDate.toLocaleDateString()}`} 
        />
      )}
    </div>
  );
};

export default TradeCalendar;
