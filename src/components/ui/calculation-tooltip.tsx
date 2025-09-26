import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CalculationItem {
  label: string;
  value: number | string;
  isSubtraction?: boolean;
  isTotal?: boolean;
  isPercentage?: boolean;
  isNote?: boolean;
}

interface CalculationTooltipProps {
  children: React.ReactNode;
  title?: string;
  calculations: CalculationItem[];
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const CalculationTooltip: React.FC<CalculationTooltipProps> = ({
  children,
  title,
  calculations,
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span className="cursor-help underline decoration-dotted decoration-muted-foreground/50 underline-offset-4">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-3" side="top">
          {title && (
            <div className="font-semibold mb-2 text-sm">{title}</div>
          )}
          <div className="space-y-1 text-xs">
            {calculations.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center gap-4 ${
                  item.isTotal ? 'border-t pt-1 mt-1 font-semibold' : ''
                }`}
              >
                <span className="text-muted-foreground">
                  {item.isSubtraction && !item.isTotal && '−'} {item.label}{!item.isNote && ':'}
                </span>
                <span className={item.isSubtraction && !item.isTotal ? 'text-destructive' : ''}>
                  {item.isNote || item.isPercentage || typeof item.value === 'string'
                    ? item.value
                    : formatCurrency(item.value as number)}
                </span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};