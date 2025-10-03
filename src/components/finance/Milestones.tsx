import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const Milestones: React.FC = () => {
  const { state } = useFinance();
  const [isExpanded, setIsExpanded] = useState(false);

  const achievedMilestones = state.milestones.filter(milestone => milestone.achieved);
  const upcomingMilestones = state.milestones.filter(milestone => !milestone.achieved);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Milestones</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpanded}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
        {achievedMilestones.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-success mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Achieved
            </h4>
            <div className="space-y-2">
              {achievedMilestones.map((milestone) => (
                <div key={milestone.id} className="p-2 border rounded-md bg-success/5">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium">{milestone.title}</span>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      Month {milestone.targetMonth}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {upcomingMilestones.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming
            </h4>
            <div className="space-y-2">
              {upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="p-2 border rounded-md">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium">{milestone.title}</span>
                    <Badge variant="outline">
                      Month {milestone.targetMonth}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {achievedMilestones.length === 0 && upcomingMilestones.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No milestones available
          </p>
        )}
        </CardContent>
      )}
    </Card>
  );
};

export default Milestones;