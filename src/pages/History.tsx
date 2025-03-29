
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { TradeProvider } from '@/context/TradeContext';
import TradeList from '@/components/trades/TradeList';

const HistoryPage: React.FC = () => {
  return (
    <TradeProvider>
      <AppLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Trade History</h1>
          <TradeList />
        </div>
      </AppLayout>
    </TradeProvider>
  );
};

export default HistoryPage;
