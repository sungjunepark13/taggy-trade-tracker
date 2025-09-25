
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { FinanceProvider } from '@/context/FinanceContext';
import AccountsOverview from '@/components/finance/AccountsOverview';
import FinanceChart from '@/components/finance/FinanceChart';
import MonthSlider from '@/components/finance/MonthSlider';
import MonthlyExpenses from '@/components/finance/MonthlyExpenses';
import Milestones from '@/components/finance/Milestones';

const Dashboard: React.FC = () => {
  return (
    <FinanceProvider>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
          </div>
          
          <MonthSlider />
          <AccountsOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FinanceChart />
            </div>
            <div className="space-y-6">
              <MonthlyExpenses />
              <Milestones />
            </div>
          </div>
        </div>
      </AppLayout>
    </FinanceProvider>
  );
};

export default Dashboard;
