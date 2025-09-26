
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddAccountForm from './AddAccountForm';
import { useBrokerageAccounts } from '@/context/BrokerageAccountsContext';

const AccountTabs = () => {
  const { accounts, activeAccountId, setActiveAccountId } = useBrokerageAccounts();
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);

  return (
    <div className="w-full flex items-center justify-between mb-4 border-b">
      <Tabs 
        value={activeAccountId || undefined} 
        onValueChange={setActiveAccountId}
        className="w-full"
      >
        <div className="flex items-center justify-between w-full">
          <TabsList className="h-10 overflow-x-auto w-auto">
            {accounts.map((account) => (
              <TabsTrigger 
                key={account.id} 
                value={account.id}
                className="px-4 py-2"
              >
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: account.color || '#3498db' }}
                  />
                  {account.name}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <Button
            onClick={() => setShowAddAccountForm(true)}
            variant="ghost"
            size="sm"
            className="mr-2"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </Tabs>
      
      <AddAccountForm
        open={showAddAccountForm}
        onOpenChange={setShowAddAccountForm}
      />
    </div>
  );
};

export default AccountTabs;
