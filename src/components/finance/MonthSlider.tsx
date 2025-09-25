import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const MonthSlider: React.FC = () => {
  const { state, setCurrentMonth } = useFinance();

  const handleSliderChange = (value: number[]) => {
    setCurrentMonth(value[0]);
  };

  const getYearAndMonth = (month: number) => {
    const year = Math.ceil(month / 12);
    const monthInYear = ((month - 1) % 12) + 1;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[monthInYear - 1]} Y${year}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline - {getYearAndMonth(state.currentMonth)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="px-2">
          <Slider
            value={[state.currentMonth]}
            onValueChange={handleSliderChange}
            max={60}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Y1</span>
          <span>Y2</span>
          <span>Y3</span>
          <span>Y4</span>
          <span>Y5</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthSlider;