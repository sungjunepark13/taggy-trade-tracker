
import React, { useState } from 'react';
import { useTrades, Trade, Tag } from '@/context/TradeContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical, ArrowUpDown } from 'lucide-react';
import { formatCurrency, getProfitClass, findTagById } from '@/utils/tradeUtils';
import TradeForm from './TradeForm';
import { toast } from 'sonner';

interface TradeListProps {
  title?: string;
  filterByTags?: string[];
  limit?: number;
}

type SortField = 'date' | 'symbol' | 'profit';
type SortDirection = 'asc' | 'desc';

const TradeList: React.FC<TradeListProps> = ({ 
  title = 'Trade History', 
  filterByTags,
  limit
}) => {
  const { state, deleteTrade } = useTrades();
  const { trades, tags } = state;
  
  const [search, setSearch] = useState('');
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    return (
      <ArrowUpDown className="ml-1 h-4 w-4 inline" />
    );
  };
  
  const filteredTrades = trades.filter(trade => {
    // Filter by tags if specified
    if (filterByTags && filterByTags.length > 0) {
      if (!filterByTags.some(tagId => trade.tags.includes(tagId))) {
        return false;
      }
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        trade.symbol.toLowerCase().includes(searchLower) ||
        trade.notes.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Sort trades
  const sortedTrades = [...filteredTrades].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (sortField === 'symbol') {
      return sortDirection === 'asc' 
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    }
    
    if (sortField === 'profit') {
      return sortDirection === 'asc' 
        ? a.profit - b.profit
        : b.profit - a.profit;
    }
    
    return 0;
  });
  
  // Apply limit if specified
  const displayTrades = limit ? sortedTrades.slice(0, limit) : sortedTrades;
  
  const handleDelete = (tradeId: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      deleteTrade(tradeId);
      toast.success('Trade deleted successfully');
    }
  };
  
  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTrade(null);
  };
  
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
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <CardTitle>{title}</CardTitle>
          <div className="w-full md:w-auto mt-2 md:mt-0">
            <Input
              placeholder="Search trades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {displayTrades.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date {getSortIcon('date')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('symbol')}
                  >
                    Symbol {getSortIcon('symbol')}
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>Exit</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('profit')}
                  >
                    P&L {getSortIcon('profit')}
                  </TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>
                      {new Date(trade.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>{trade.type}</TableCell>
                    <TableCell>{trade.entryPrice.toFixed(2)}</TableCell>
                    <TableCell>{trade.exitPrice.toFixed(2)}</TableCell>
                    <TableCell>{trade.quantity}</TableCell>
                    <TableCell className={getProfitClass(trade.profit)}>
                      {formatCurrency(trade.profit)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {renderTags(trade)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(trade)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(trade.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {search ? 'No trades match your search.' : 'No trades yet. Add your first trade!'}
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Trade</DialogTitle>
            </DialogHeader>
            {editingTrade && (
              <TradeForm 
                existingTrade={editingTrade} 
                onSuccess={closeDialog} 
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TradeList;
