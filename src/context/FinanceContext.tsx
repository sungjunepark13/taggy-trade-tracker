import React, { createContext, useContext, useState } from 'react';

export interface AccountData {
  month: number;
  debt: number;
  retirement401: number;
  house: number;
  emergencyFund: number;
  checking: number;
  miscellaneous: number;
}

export interface MonthlyExpense {
  label: string;
  amount: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetMonth: number;
  achieved: boolean;
}

interface FinanceState {
  accountData: AccountData[];
  monthlyExpenses: MonthlyExpense[];
  milestones: Milestone[];
  currentMonth: number;
}

interface FinanceContextProps {
  state: FinanceState;
  setCurrentMonth: (month: number) => void;
}

const initialAccountData: AccountData[] = [
  { month: 1, debt: 50000, retirement401: 10000, house: 200000, emergencyFund: 5000, checking: 15000, miscellaneous: 2000 },
  { month: 2, debt: 48000, retirement401: 12000, house: 202000, emergencyFund: 6000, checking: 16000, miscellaneous: 2500 },
  { month: 3, debt: 46000, retirement401: 14000, house: 204000, emergencyFund: 7000, checking: 17000, miscellaneous: 3000 },
  { month: 4, debt: 44000, retirement401: 16000, house: 206000, emergencyFund: 8000, checking: 18000, miscellaneous: 3500 },
  { month: 5, debt: 42000, retirement401: 18000, house: 208000, emergencyFund: 9000, checking: 19000, miscellaneous: 4000 },
  { month: 6, debt: 40000, retirement401: 20000, house: 210000, emergencyFund: 10000, checking: 20000, miscellaneous: 4500 },
  { month: 7, debt: 38000, retirement401: 22000, house: 212000, emergencyFund: 11000, checking: 21000, miscellaneous: 5000 },
  { month: 8, debt: 36000, retirement401: 24000, house: 214000, emergencyFund: 12000, checking: 22000, miscellaneous: 5500 },
  { month: 9, debt: 34000, retirement401: 26000, house: 216000, emergencyFund: 13000, checking: 23000, miscellaneous: 6000 },
  { month: 10, debt: 32000, retirement401: 28000, house: 218000, emergencyFund: 14000, checking: 24000, miscellaneous: 6500 },
  { month: 11, debt: 30000, retirement401: 30000, house: 220000, emergencyFund: 15000, checking: 25000, miscellaneous: 7000 },
  { month: 12, debt: 28000, retirement401: 32000, house: 222000, emergencyFund: 16000, checking: 26000, miscellaneous: 7500 },
];

const initialMonthlyExpenses: MonthlyExpense[] = [
  { label: 'Total Take Home Pay', amount: 8000 },
  { label: 'Rent/Mortgage', amount: -2500 },
  { label: 'Groceries', amount: -800 },
  { label: 'Transportation', amount: -600 },
  { label: 'Utilities', amount: -400 },
  { label: 'Insurance', amount: -300 },
  { label: 'Debt Payment', amount: -2000 },
  { label: '401k Contribution', amount: -1000 },
  { label: 'Emergency Fund', amount: -500 },
  { label: 'Miscellaneous', amount: -400 },
];

const initialMilestones: Milestone[] = [
  { id: '1', title: 'Emergency Fund Goal', description: 'Reached $10,000 emergency fund', targetMonth: 6, achieved: false },
  { id: '2', title: 'Debt Reduction', description: 'Reduced debt by $10,000', targetMonth: 4, achieved: false },
  { id: '3', title: '401k Milestone', description: 'Reached $25,000 in 401k', targetMonth: 8, achieved: false },
  { id: '4', title: 'House Value Growth', description: 'House value increased by $20,000', targetMonth: 12, achieved: false },
];

const initialState: FinanceState = {
  accountData: initialAccountData,
  monthlyExpenses: initialMonthlyExpenses,
  milestones: initialMilestones,
  currentMonth: 1,
};

const FinanceContext = createContext<FinanceContextProps | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FinanceState>(initialState);

  const setCurrentMonth = (month: number) => {
    setState(prev => ({
      ...prev,
      currentMonth: month,
      milestones: prev.milestones.map(milestone => ({
        ...milestone,
        achieved: month >= milestone.targetMonth
      }))
    }));
  };

  return (
    <FinanceContext.Provider value={{ state, setCurrentMonth }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};