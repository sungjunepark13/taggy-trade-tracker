
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { TradeProvider } from '@/context/TradeContext';
import TagManager from '@/components/tags/TagManager';

const TagsPage: React.FC = () => {
  return (
    <TradeProvider>
      <AppLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Manage Tags</h1>
          <TagManager />
        </div>
      </AppLayout>
    </TradeProvider>
  );
};

export default TagsPage;
