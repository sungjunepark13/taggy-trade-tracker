import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const MonthSlider: React.FC = () => {
  const { state, setCurrentMonth } = useFinance();

  const handleSliderChange = (value: number[]) => {
    setCurrentMonth(value[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline - Month {state.currentMonth}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="px-2">
          <Slider
            value={[state.currentMonth]}
            onValueChange={handleSliderChange}
            max={12}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Jan</span>
          <span>Mar</span>
          <span>Jun</span>
          <span>Sep</span>
          <span>Dec</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthSlider;