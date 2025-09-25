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

// Generate 5 years (60 months) of account data
const generateAccountData = (): AccountData[] => {
  const data: AccountData[] = [];
  
  for (let month = 1; month <= 60; month++) {
    // Calculate progressive changes over 5 years
    const yearProgress = (month - 1) / 12;
    
    data.push({
      month,
      debt: Math.max(0, 50000 - (month * 800)), // Decreasing debt
      retirement401: 10000 + (month * 1200), // Growing 401k
      house: 200000 + (month * 600), // Growing house value
      emergencyFund: Math.min(25000, 5000 + (month * 300)), // Growing emergency fund up to 25k
      checking: 15000 + Math.sin(month * 0.5) * 5000, // Fluctuating checking account
      miscellaneous: 2000 + (month * 100), // Slowly growing miscellaneous
    });
  }
  
  return data;
};

const initialAccountData: AccountData[] = generateAccountData();

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
  { id: '1', title: 'Emergency Fund $10K', description: 'Reached $10,000 emergency fund milestone', targetMonth: 17, achieved: false },
  { id: '2', title: 'Debt Under $40K', description: 'Reduced debt below $40,000', targetMonth: 13, achieved: false },
  { id: '3', title: '401k $25K Milestone', description: 'Reached $25,000 in retirement savings', targetMonth: 13, achieved: false },
  { id: '4', title: 'House Value $220K', description: 'House value increased to $220,000', targetMonth: 34, achieved: false },
  { id: '5', title: 'Emergency Fund $20K', description: 'Built emergency fund to $20,000', targetMonth: 50, achieved: false },
  { id: '6', title: 'Debt Free Goal', description: 'Eliminated all debt completely', targetMonth: 60, achieved: false },
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