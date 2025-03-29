
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import AccountTabs from '../accounts/AccountTabs';
import { BrokerageAccountsProvider } from '@/context/BrokerageAccountsContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <BrokerageAccountsProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col max-w-full overflow-hidden">
            <div className="px-6 pt-4 bg-background border-b">
              <AccountTabs />
            </div>
            <main className="flex-1 p-6 md:p-8 max-w-full overflow-hidden">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </BrokerageAccountsProvider>
  );
};

export default AppLayout;
