
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface BrokerageAccount {
  id: string;
  name: string;
  broker: string;
  accountNumber: string;
  accountType: string;
  color?: string;
}

interface BrokerageAccountsContextType {
  accounts: BrokerageAccount[];
  activeAccountId: string | null;
  setActiveAccountId: (id: string) => void;
  addAccount: (account: Omit<BrokerageAccount, 'id'>) => void;
  updateAccount: (id: string, account: Partial<BrokerageAccount>) => void;
  deleteAccount: (id: string) => void;
}

const BrokerageAccountsContext = createContext<BrokerageAccountsContextType | undefined>(undefined);

const defaultAccounts: BrokerageAccount[] = [
  {
    id: '1',
    name: 'Main Trading',
    broker: 'Interactive Brokers',
    accountNumber: '12345678',
    accountType: 'Cash',
    color: '#3498db'
  }
];

export const BrokerageAccountsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<BrokerageAccount[]>(() => {
    const savedAccounts = localStorage.getItem('brokerageAccounts');
    return savedAccounts ? JSON.parse(savedAccounts) : defaultAccounts;
  });
  
  const [activeAccountId, setActiveAccountId] = useState<string | null>(() => {
    const savedActiveAccount = localStorage.getItem('activeAccountId');
    return savedActiveAccount || (accounts.length > 0 ? accounts[0].id : null);
  });
  
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('brokerageAccounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (activeAccountId) {
      localStorage.setItem('activeAccountId', activeAccountId);
    }
  }, [activeAccountId]);

  const addAccount = (account: Omit<BrokerageAccount, 'id'>) => {
    const newAccount = {
      ...account,
      id: Date.now().toString(),
    };
    
    setAccounts(prev => [...prev, newAccount]);
    
    if (!activeAccountId) {
      setActiveAccountId(newAccount.id);
    }
    
    toast({
      title: "Account added",
      description: `${account.name} has been added to your accounts.`,
    });
  };

  const updateAccount = (id: string, updates: Partial<BrokerageAccount>) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === id ? { ...account, ...updates } : account
      )
    );
    
    toast({
      title: "Account updated",
      description: "Your account has been updated successfully.",
    });
  };

  const deleteAccount = (id: string) => {
    const accountToDelete = accounts.find(account => account.id === id);
    
    setAccounts(prev => prev.filter(account => account.id !== id));
    
    if (activeAccountId === id) {
      const remainingAccounts = accounts.filter(account => account.id !== id);
      setActiveAccountId(remainingAccounts.length > 0 ? remainingAccounts[0].id : null);
    }
    
    toast({
      title: "Account deleted",
      description: `${accountToDelete?.name || 'Account'} has been deleted.`,
    });
  };

  return (
    <BrokerageAccountsContext.Provider
      value={{
        accounts,
        activeAccountId,
        setActiveAccountId,
        addAccount,
        updateAccount,
        deleteAccount
      }}
    >
      {children}
    </BrokerageAccountsContext.Provider>
  );
};

export const useBrokerageAccounts = () => {
  const context = useContext(BrokerageAccountsContext);
  if (context === undefined) {
    throw new Error('useBrokerageAccounts must be used within a BrokerageAccountsProvider');
  }
  return context;
};
