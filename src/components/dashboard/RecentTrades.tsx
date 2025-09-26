
import React from 'react';
import { Link } from 'react-router-dom';
import { Trade, Tag, useTrades } from '@/context/TradeContext';
import { formatCurrency, getProfitClass, findTagById } from '@/utils/tradeUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const RecentTrades: React.FC = () => {
  const { state, deleteTrade } = useTrades();
  const { trades, tags } = state;

  // Sort trades by date (newest first) and take the 5 most recent
  const recentTrades = [...trades]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const renderTags = (trade: Trade) => {
    return trade.tags.map(tagId => {
      const tag = findTagById(tagId, tags);
      if (!tag) return null;
      
      return (
        <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="mr-1">
          {tag.name}
        </Badge>
      );
    });
  };

  const handleDelete = (tradeId: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      deleteTrade(tradeId);
      toast.success('Trade deleted successfully');
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTrades.length > 0 ? (
            recentTrades.map(trade => (
              <div key={trade.id} className="flex flex-col p-4 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">
                    {trade.symbol} ({trade.type})
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={getProfitClass(trade.profit)}>
                      {formatCurrency(trade.profit)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                      onClick={() => handleDelete(trade.id)}
                      title="Delete trade"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {new Date(trade.date).toLocaleDateString()}
                </div>
                <div className="flex flex-wrap mt-2">
                  {renderTags(trade)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No trades yet. Add your first trade!
            </div>
          )}
          <div className="text-center mt-4">
            <Button asChild variant="outline">
              <Link to="/history">View All Trades</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTrades;
