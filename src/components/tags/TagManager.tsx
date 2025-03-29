
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { useTrades, Tag } from '@/context/TradeContext';
import { toast } from 'sonner';

const TagManager: React.FC = () => {
  const { state, addTag, deleteTag } = useTrades();
  const { tags, trades } = state;
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  
  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast.error('Tag name cannot be empty');
      return;
    }
    
    addTag({
      name: newTagName.trim(),
      color: newTagColor
    });
    
    // Reset form
    setNewTagName('');
    setNewTagColor('#3B82F6');
    setIsDialogOpen(false);
    toast.success('Tag created successfully');
  };
  
  const handleDeleteTag = (tagId: string) => {
    // Check if the tag is used in any trades
    const isUsed = trades.some(trade => trade.tags.includes(tagId));
    
    if (isUsed) {
      toast.error('Cannot delete a tag that is used in trades');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this tag?')) {
      deleteTag(tagId);
      toast.success('Tag deleted successfully');
    }
  };
  
  // Calculate how many trades use each tag
  const getTagUsageCount = (tagId: string): number => {
    return trades.filter(trade => trade.tags.includes(tagId)).length;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tags</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Create New Tag</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tag Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Breakout"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Tag Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="color"
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="flex-1"
                    placeholder="#HEX"
                  />
                </div>
              </div>
              <Button onClick={handleAddTag} className="w-full mt-4">
                Create Tag
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <div 
                key={tag.id} 
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="font-medium">{tag.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({getTagUsageCount(tag.id)} trades)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTag(tag.id)}
                  disabled={getTagUsageCount(tag.id) > 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No tags created yet. Create your first tag!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TagManager;
