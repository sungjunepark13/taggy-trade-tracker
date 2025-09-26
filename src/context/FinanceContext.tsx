import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { FinancialEngine, MonthlySnapshot } from '../utils/financialEngine';

export interface AccountData {
  month: number;
  debt: number;
  retirement401: number;
  house: number;
  emergencyFund: number;
  checking: number;
  miscellaneous: number;
  vacationFund: number;
  trustFund: number;
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
  actualMonth?: number;
}

interface FinanceState {
  accountData: AccountData[];
  monthlyExpenses: MonthlyExpense[];
  milestones: Milestone[];
  currentMonth: number;
  snapshots: MonthlySnapshot[];
  reconciliation: { year: number; data: any }[];
}

interface FinanceContextProps {
  state: FinanceState;
  setCurrentMonth: (month: number) => void;
  getCurrentSnapshot: () => MonthlySnapshot | undefined;
}

// Initialize financial engine and run simulation
const engine = new FinancialEngine();
const snapshots = engine.simulate();
const reconciliation = engine.getAnnualReconciliation();

// Convert snapshots to AccountData format for UI compatibility
const generateAccountData = (): AccountData[] => {
  return snapshots.map(snapshot => ({
    month: snapshot.month,
    debt: snapshot.totalDebt,
    retirement401: snapshot.retirementBalanceTotal,
    house: snapshot.downPayment, // Using down payment as proxy for house savings
    emergencyFund: snapshot.emergencyFund,
    checking: snapshot.earnest, // Using earnest money as checking proxy
    miscellaneous: 0, // Deprecated - using separate vacation and trust funds
    vacationFund: snapshot.vacationFund,
    trustFund: snapshot.trustFund,
  }));
};

// Generate monthly expenses from snapshot data
const generateMonthlyExpenses = (snapshot?: MonthlySnapshot): MonthlyExpense[] => {
  if (!snapshot) {
    return [
      { label: 'Net Take Home', amount: 0 },
      { label: 'Fixed Expenses', amount: 0 },
      { label: 'Debt Minimums', amount: 0 },
      { label: 'Goal Budget', amount: 0 },
    ];
  }

  return [
    { label: 'Net Take Home', amount: snapshot.netTakeHomeMonthly },
    { label: 'Living Expenses (inc. tithing)', amount: -snapshot.monthlyExpenses },
    { label: 'Debt Minimum Payments', amount: -snapshot.debtMinimumsPaidMonthly },
    { label: 'Available for Goals', amount: snapshot.goalBudgetDynamicMonthly },
  ];
};

// Extract milestones from snapshots
const generateMilestones = (): Milestone[] => {
  const milestoneList: Milestone[] = [];
  const milestoneMap = new Map<string, number>();

  snapshots.forEach(snapshot => {
    if (snapshot.milestone) {
      const milestones = snapshot.milestone.split(', ');
      milestones.forEach(m => {
        if (!milestoneMap.has(m)) {
          milestoneMap.set(m, snapshot.month);
        }
      });
    }
  });

  let id = 1;
  milestoneMap.forEach((month, milestone) => {
    milestoneList.push({
      id: id.toString(),
      title: milestone,
      description: `${milestone} at month ${month}`,
      targetMonth: month,
      achieved: false,
      actualMonth: month,
    });
    id++;
  });

  // Add projected milestones if not yet achieved
  const hasEarnest = milestoneMap.has('Earnest $15k reached');
  const hasEFStarter = milestoneMap.has('EF $5k starter reached');
  const hasDebtFree = milestoneMap.has('All debts paid off');
  const hasDownPayment = milestoneMap.has('Down Payment $50k reached');
  const hasEFFinal = milestoneMap.has('EF $20k final reached');

  if (!hasEarnest) {
    milestoneList.push({
      id: id.toString(),
      title: 'Earnest $15k (Projected)',
      description: 'Reach $15,000 earnest money',
      targetMonth: 12,
      achieved: false,
    });
    id++;
  }

  if (!hasEFStarter) {
    milestoneList.push({
      id: id.toString(),
      title: 'EF $5k Starter (Projected)',
      description: 'Build initial emergency fund',
      targetMonth: 8,
      achieved: false,
    });
    id++;
  }

  if (!hasDebtFree) {
    milestoneList.push({
      id: id.toString(),
      title: 'Debt Free (Projected)',
      description: 'Pay off all debts',
      targetMonth: 48,
      achieved: false,
    });
    id++;
  }

  if (!hasDownPayment) {
    milestoneList.push({
      id: id.toString(),
      title: 'Down Payment $50k (Projected)',
      description: 'Save for house down payment',
      targetMonth: 54,
      achieved: false,
    });
    id++;
  }

  if (!hasEFFinal) {
    milestoneList.push({
      id: id.toString(),
      title: 'EF $20k Final (Projected)',
      description: 'Complete emergency fund',
      targetMonth: 60,
      achieved: false,
    });
  }

  return milestoneList.sort((a, b) => (a.actualMonth || a.targetMonth) - (b.actualMonth || b.targetMonth));
};

const initialAccountData: AccountData[] = generateAccountData();
const initialMilestones: Milestone[] = generateMilestones();

const initialState: FinanceState = {
  accountData: initialAccountData,
  monthlyExpenses: generateMonthlyExpenses(snapshots[0]),
  milestones: initialMilestones,
  currentMonth: 1,
  snapshots,
  reconciliation,
};

const FinanceContext = createContext<FinanceContextProps | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FinanceState>(initialState);

  const setCurrentMonth = (month: number) => {
    const snapshot = snapshots[month - 1];
    setState(prev => ({
      ...prev,
      currentMonth: month,
      monthlyExpenses: generateMonthlyExpenses(snapshot),
      milestones: prev.milestones.map(milestone => ({
        ...milestone,
        achieved: month >= (milestone.actualMonth || milestone.targetMonth)
      }))
    }));
  };

  const getCurrentSnapshot = () => {
    return state.snapshots[state.currentMonth - 1];
  };

  return (
    <FinanceContext.Provider value={{ state, setCurrentMonth, getCurrentSnapshot }}>
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