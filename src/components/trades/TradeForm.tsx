
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useTrades, Trade, TradeType, TradeStatus } from '@/context/TradeContext';
import { toast } from 'sonner';

interface TradeFormProps {
  existingTrade?: Trade;
  onSuccess?: () => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ existingTrade, onSuccess }) => {
  const { state, addTrade, updateTrade } = useTrades();
  const { tags } = state;
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    symbol: '',
    type: 'BUY' as TradeType,
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    notes: '',
    selectedTags: [] as string[]
  });
  
  // Set form data if editing an existing trade
  useEffect(() => {
    if (existingTrade) {
      setFormData({
        date: existingTrade.date,
        symbol: existingTrade.symbol,
        type: existingTrade.type,
        entryPrice: existingTrade.entryPrice.toString(),
        exitPrice: existingTrade.exitPrice.toString(),
        quantity: existingTrade.quantity.toString(),
        notes: existingTrade.notes,
        selectedTags: [...existingTrade.tags]
      });
    }
  }, [existingTrade]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleTag = (tagId: string) => {
    setFormData(prev => {
      if (prev.selectedTags.includes(tagId)) {
        return {
          ...prev,
          selectedTags: prev.selectedTags.filter(id => id !== tagId)
        };
      } else {
        return {
          ...prev,
          selectedTags: [...prev.selectedTags, tagId]
        };
      }
    });
  };
  
  const calculateProfit = (): number => {
    const entryPrice = parseFloat(formData.entryPrice) || 0;
    const exitPrice = parseFloat(formData.exitPrice) || 0;
    const quantity = parseFloat(formData.quantity) || 0;
    
    if (formData.type === 'BUY') {
      return (exitPrice - entryPrice) * quantity;
    } else {
      return (entryPrice - exitPrice) * quantity;
    }
  };
  
  const determineStatus = (profit: number): TradeStatus => {
    if (profit > 0) return 'WIN';
    if (profit < 0) return 'LOSS';
    return 'BREAKEVEN';
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.symbol || !formData.entryPrice || !formData.exitPrice || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const profit = calculateProfit();
    const status = determineStatus(profit);
    
    const tradeData = {
      date: formData.date,
      symbol: formData.symbol.toUpperCase(),
      type: formData.type,
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: parseFloat(formData.exitPrice),
      quantity: parseFloat(formData.quantity),
      status,
      profit,
      notes: formData.notes,
      tags: formData.selectedTags
    };
    
    if (existingTrade) {
      updateTrade({ ...tradeData, id: existingTrade.id });
      toast.success('Trade updated successfully');
    } else {
      addTrade(tradeData);
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        symbol: '',
        type: 'BUY',
        entryPrice: '',
        exitPrice: '',
        quantity: '',
        notes: '',
        selectedTags: []
      });
      toast.success('Trade added successfully');
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{existingTrade ? 'Edit Trade' : 'Add New Trade'}</CardTitle>
        <CardDescription>
          {existingTrade 
            ? 'Update the details of your trade' 
            : 'Record a new trade in your journal'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                placeholder="e.g., AAPL"
                value={formData.symbol}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Trade Type</Label>
              <Select
                onValueChange={(value) => handleSelectChange('type', value)}
                value={formData.type}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">BUY</SelectItem>
                  <SelectItem value="SELL">SELL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Number of shares/contracts"
                min="0.01"
                step="0.01"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                name="entryPrice"
                type="number"
                placeholder="Price at entry"
                min="0.01"
                step="0.01"
                value={formData.entryPrice}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price</Label>
              <Input
                id="exitPrice"
                name="exitPrice"
                type="number"
                placeholder="Price at exit"
                min="0.01"
                step="0.01"
                value={formData.exitPrice}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {tags.map(tag => (
                <Badge
                  key={tag.id}
                  style={{ 
                    backgroundColor: formData.selectedTags.includes(tag.id) ? tag.color : 'transparent',
                    color: formData.selectedTags.includes(tag.id) ? 'white' : 'inherit',
                    borderColor: tag.color
                  }}
                  className="cursor-pointer border"
                  variant={formData.selectedTags.includes(tag.id) ? 'default' : 'outline'}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-muted-foreground">No tags available. Create tags in the Tags section.</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add your trade notes, strategy, and observations..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">
              {existingTrade ? 'Update Trade' : 'Add Trade'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TradeForm;
