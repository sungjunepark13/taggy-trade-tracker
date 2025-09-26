import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TagManager: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tag Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Tag management functionality coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default TagManager;