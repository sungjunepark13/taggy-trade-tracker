
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { TradeProvider } from '@/context/TradeContext';
import { BrokerageAccountsProvider } from '@/context/BrokerageAccountsContext';
import TradeStats from '@/components/dashboard/TradeStats';
import RecentTrades from '@/components/dashboard/RecentTrades';
import PerformanceByTag from '@/components/dashboard/PerformanceByTag';
import ProfitLossChart from '@/components/dashboard/ProfitLossChart';
import AccountTabs from '@/components/accounts/AccountTabs';

const Dashboard: React.FC = () => {
  return (
    <BrokerageAccountsProvider>
      <TradeProvider>
        <AppLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
            
            <AccountTabs />
            <TradeStats />
            <ProfitLossChart />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RecentTrades />
              <PerformanceByTag />
            </div>
          </div>
        </AppLayout>
      </TradeProvider>
    </BrokerageAccountsProvider>
  );
};

export default Dashboard;
