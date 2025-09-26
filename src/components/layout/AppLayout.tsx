
import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full">
      <main className="p-6 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
