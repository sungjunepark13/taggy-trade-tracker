
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { TradeProvider } from '@/context/TradeContext';
import TradeForm from '@/components/trades/TradeForm';

const AddTradePage: React.FC = () => {
  return (
    <TradeProvider>
      <AppLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Add Trade</h1>
          <TradeForm />
        </div>
      </AppLayout>
    </TradeProvider>
  );
};

export default AddTradePage;
