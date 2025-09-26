import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TradeList: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Trade list functionality coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default TradeList;