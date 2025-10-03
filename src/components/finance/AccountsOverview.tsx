import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import AccountCard from './AccountCard';
import {
  CreditCard,
  PiggyBank,
  Home,
  Shield,
  Wallet,
  Plane,
  Baby
} from 'lucide-react';

const AccountsOverview: React.FC = () => {
  const { state } = useFinance();
  const currentData = state.accountData.find(data => data.month === state.currentMonth);

  if (!currentData) return null;

  const accounts = [
    {
      title: 'Debt',
      value: currentData.debt,
      icon: CreditCard,
      accountKey: 'debt',
    },
    {
      title: '401(k)',
      value: currentData.retirement401,
      icon: PiggyBank,
      accountKey: 'retirement401',
    },
    {
      title: 'House Fund',
      value: currentData.house,
      icon: Home,
      accountKey: 'house',
    },
    {
      title: 'Emergency Fund',
      value: currentData.emergencyFund,
      icon: Shield,
      accountKey: 'emergencyFund',
    },
    {
      title: 'Earnest Money',
      value: currentData.checking,
      icon: Wallet,
      accountKey: 'checking',
    },
    {
      title: 'Vacation Fund',
      value: currentData.vacationFund,
      icon: Plane,
      accountKey: 'vacationFund',
    },
    {
      title: "Charity Fund",
      value: currentData.charityFund,
      icon: Baby,
      accountKey: 'charityFund',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {accounts.map((account) => (
        <AccountCard
          key={account.accountKey}
          title={account.title}
          value={account.value}
          icon={account.icon}
          accountKey={account.accountKey}
        />
      ))}
    </div>
  );
};

export default AccountsOverview;