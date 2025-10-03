import React, { createContext, useContext, useState, useEffect } from 'react';
import { FinancialEngine, MonthlySnapshot } from '../utils/financialEngine';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AccountData {
  month: number;
  debt: number;
  retirement401: number;
  house: number;
  emergencyFund: number;
  checking: number;
  miscellaneous: number;
  vacationFund: number;
  charityFund: number;
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
  loadingHousehold: boolean;
  householdError: string | null;
  refreshHousehold: () => Promise<void>;
}

// Generate default data when no household exists
const generateDefaultData = () => {
  // Try to load scenario from localStorage first
  let customScenario = undefined;
  try {
    const stored = localStorage.getItem('financialScenario');
    if (stored) {
      customScenario = JSON.parse(stored);
      console.log('Loaded financial scenario from localStorage:', customScenario);
    }
  } catch (error) {
    console.error('Error loading financial scenario from localStorage:', error);
  }

  const engine = new FinancialEngine(customScenario);
  const snapshots = engine.simulate();
  const reconciliation = engine.getAnnualReconciliation();

  return { snapshots, reconciliation };
};

// Convert snapshots to AccountData format for UI compatibility
const generateAccountData = (snapshots: MonthlySnapshot[]): AccountData[] => {
  return snapshots.map(snapshot => ({
    month: snapshot.month,
    debt: snapshot.totalDebt,
    retirement401: snapshot.retirementBalanceTotal,
    house: snapshot.downPayment,
    emergencyFund: snapshot.emergencyFund,
    checking: snapshot.earnest,
    miscellaneous: 0,
    vacationFund: snapshot.vacationFund,
    charityFund: snapshot.charityFund,
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
const generateMilestones = (snapshots: MonthlySnapshot[]): Milestone[] => {
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

const getInitialState = (): FinanceState => {
  const { snapshots, reconciliation } = generateDefaultData();
  return {
    accountData: generateAccountData(snapshots),
    monthlyExpenses: generateMonthlyExpenses(snapshots[0]),
    milestones: generateMilestones(snapshots),
    currentMonth: 1,
    snapshots,
    reconciliation,
  };
};

const FinanceContext = createContext<FinanceContextProps | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FinanceState>(getInitialState());
  const [loadingHousehold, setLoadingHousehold] = useState(false);
  const [householdError, setHouseholdError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch household data from API when user is authenticated
  const fetchHousehold = async () => {
    if (!isAuthenticated || !user) {
      // Use default data if not authenticated
      setState(getInitialState());
      return;
    }

    setLoadingHousehold(true);
    setHouseholdError(null);

    try {
      const response = await fetch(`${API_URL}/api/household`, {
        credentials: 'include',
      });

      if (response.status === 404) {
        // No household setup yet, use default data
        setState(getInitialState());
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch household data');
      }

      const data = await response.json();
      const household = data.household;

      // Convert household data to scenario format and regenerate financial data
      // For now, use default data - in future, this would convert household to scenario
      // TODO: Implement conversion from household API data to FinancialEngine scenario
      const { snapshots, reconciliation } = generateDefaultData();

      setState({
        accountData: generateAccountData(snapshots),
        monthlyExpenses: generateMonthlyExpenses(snapshots[0]),
        milestones: generateMilestones(snapshots),
        currentMonth: 1,
        snapshots,
        reconciliation,
      });
    } catch (error) {
      console.error('Error fetching household:', error);
      setHouseholdError(error instanceof Error ? error.message : 'Failed to load household data');
      // Use default data on error
      setState(getInitialState());
    } finally {
      setLoadingHousehold(false);
    }
  };

  // Load household data when user authenticates
  useEffect(() => {
    fetchHousehold();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  // Listen for changes to localStorage (e.g., when intake form is submitted)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'financialScenario') {
        console.log('Financial scenario updated in localStorage, regenerating data...');
        const { snapshots, reconciliation } = generateDefaultData();
        setState({
          accountData: generateAccountData(snapshots),
          monthlyExpenses: generateMonthlyExpenses(snapshots[0]),
          milestones: generateMilestones(snapshots),
          currentMonth: 1,
          snapshots,
          reconciliation,
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setCurrentMonth = (month: number) => {
    const snapshot = state.snapshots[month - 1];
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

  const refreshHousehold = async () => {
    await fetchHousehold();
  };

  return (
    <FinanceContext.Provider value={{
      state,
      setCurrentMonth,
      getCurrentSnapshot,
      loadingHousehold,
      householdError,
      refreshHousehold
    }}>
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