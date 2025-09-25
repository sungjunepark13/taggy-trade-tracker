import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

const Milestones: React.FC = () => {
  const { state } = useFinance();

  const achievedMilestones = state.milestones.filter(milestone => milestone.achieved);
  const upcomingMilestones = state.milestones.filter(milestone => !milestone.achieved);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestones</CardTitle>
      </CardHeader>
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
    </Card>
  );
};

export default Milestones;