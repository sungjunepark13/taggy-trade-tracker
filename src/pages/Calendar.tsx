
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { TradeProvider } from '@/context/TradeContext';
import TradeCalendar from '@/components/calendar/TradeCalendar';

const CalendarPage: React.FC = () => {
  return (
    <TradeProvider>
      <AppLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Trade Calendar</h1>
          <TradeCalendar />
        </div>
      </AppLayout>
    </TradeProvider>
  );
};

export default CalendarPage;
