import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/tradeUtils';

interface AccountCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  accountKey: string;
  className?: string;
}

const AccountCard: React.FC<AccountCardProps> = ({
  title,
  value,
  icon: Icon,
  accountKey,
  className,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/account/${accountKey}`);
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(value)}</div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;