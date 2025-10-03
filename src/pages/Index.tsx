
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import AccountsOverview from '@/components/finance/AccountsOverview';
import FinanceChart from '@/components/finance/FinanceChart';
import MonthSlider from '@/components/finance/MonthSlider';
import MonthlyExpenses from '@/components/finance/MonthlyExpenses';
import Milestones from '@/components/finance/Milestones';
import { FinancialDetails } from '@/components/finance/FinancialDetails';
import { DataExport } from '@/components/finance/DataExport';
import { ScenarioSummary } from '@/components/finance/ScenarioSummary';

const Dashboard: React.FC = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">Finance Dashboard</h1>
        </div>

        <ScenarioSummary />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
          <div className="space-y-6 lg:sticky lg:top-6">
            <MonthSlider />
            <AccountsOverview />
            <FinanceChart />
          </div>
          <div className="space-y-6">
            <MonthlyExpenses />
            <Milestones />
            <FinancialDetails />
            <DataExport />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
