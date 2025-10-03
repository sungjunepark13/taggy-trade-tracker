import { EmploymentInfo } from './financialEngine';

// Big 4 compensation data by firm, position, and location
interface CompensationData {
  baseSalary: number;
  bonus: number; // percentage of base
  annualIncrease: number; // percentage increase per year
}

// Simplified compensation structure (you can expand this with real data)
const COMPENSATION_DATA: Record<string, Record<string, CompensationData>> = {
  PwC: {
    'Associate': { baseSalary: 75000, bonus: 0.10, annualIncrease: 0.08 },
    'Senior Associate': { baseSalary: 95000, bonus: 0.12, annualIncrease: 0.10 },
    'Manager': { baseSalary: 125000, bonus: 0.15, annualIncrease: 0.12 },
    'Senior Manager': { baseSalary: 155000, bonus: 0.18, annualIncrease: 0.10 },
    'Director': { baseSalary: 195000, bonus: 0.20, annualIncrease: 0.08 },
    'Partner': { baseSalary: 300000, bonus: 0.25, annualIncrease: 0.05 },
  },
  Deloitte: {
    'Associate': { baseSalary: 73000, bonus: 0.10, annualIncrease: 0.08 },
    'Senior Associate': { baseSalary: 92000, bonus: 0.12, annualIncrease: 0.10 },
    'Manager': { baseSalary: 120000, bonus: 0.15, annualIncrease: 0.12 },
    'Senior Manager': { baseSalary: 150000, bonus: 0.18, annualIncrease: 0.10 },
    'Director': { baseSalary: 190000, bonus: 0.20, annualIncrease: 0.08 },
    'Partner': { baseSalary: 290000, bonus: 0.25, annualIncrease: 0.05 },
  },
};

// Location adjustments (multipliers)
const LOCATION_ADJUSTMENTS: Record<string, number> = {
  'New York, NY': 1.25,
  'San Francisco, CA': 1.30,
  'Los Angeles, CA': 1.20,
  'Chicago, IL': 1.10,
  'Boston, MA': 1.15,
  'Seattle, WA': 1.18,
  'Washington, DC': 1.15,
  'Atlanta, GA': 1.00,
  'Dallas, TX': 1.05,
  'Houston, TX': 1.05,
  'Other': 1.00,
};

export interface ProjectedIncome {
  year: number;
  baseSalary: number;
  bonus: number;
  totalCompensation: number;
  position: string;
}

export function calculateBig4Compensation(employment: EmploymentInfo): {
  incomeByYear: number[];
  projectedIncome: ProjectedIncome[];
  benefits: string[];
} {
  const { firm, position, yearsAtFirm, yearsPlannedToStay, location } = employment;

  const compData = COMPENSATION_DATA[firm]?.[position];
  if (!compData) {
    throw new Error(`Compensation data not found for ${firm} ${position}`);
  }

  const locationMultiplier = LOCATION_ADJUSTMENTS[location] || LOCATION_ADJUSTMENTS['Other'];

  const projectedIncome: ProjectedIncome[] = [];
  const incomeByYear: number[] = [];

  // Calculate income for next 5 years
  for (let year = 0; year < 5; year++) {
    const yearsInPosition = yearsAtFirm + year;

    // Calculate base salary with annual increases
    let adjustedBaseSalary = compData.baseSalary * locationMultiplier;
    for (let i = 0; i < year; i++) {
      adjustedBaseSalary *= (1 + compData.annualIncrease);
    }

    // Calculate bonus
    const bonus = adjustedBaseSalary * compData.bonus;
    const totalComp = adjustedBaseSalary + bonus;

    projectedIncome.push({
      year: year + 1,
      baseSalary: Math.round(adjustedBaseSalary),
      bonus: Math.round(bonus),
      totalCompensation: Math.round(totalComp),
      position: getProjectedPosition(position, yearsInPosition),
    });

    incomeByYear.push(Math.round(totalComp));
  }

  // Get firm-specific benefits
  const benefits = getFirmBenefits(firm);

  return {
    incomeByYear,
    projectedIncome,
    benefits,
  };
}

function getProjectedPosition(currentPosition: string, yearsInPosition: number): string {
  const promotionTimeline: Record<string, { years: number; nextPosition: string }> = {
    'Associate': { years: 2, nextPosition: 'Senior Associate' },
    'Senior Associate': { years: 3, nextPosition: 'Manager' },
    'Manager': { years: 4, nextPosition: 'Senior Manager' },
    'Senior Manager': { years: 5, nextPosition: 'Director' },
    'Director': { years: 6, nextPosition: 'Partner' },
    'Partner': { years: 999, nextPosition: 'Partner' },
  };

  const timeline = promotionTimeline[currentPosition];
  if (!timeline) return currentPosition;

  if (yearsInPosition >= timeline.years) {
    return getProjectedPosition(timeline.nextPosition, yearsInPosition - timeline.years);
  }

  return currentPosition;
}

function getFirmBenefits(firm: 'PwC' | 'Deloitte'): string[] {
  const commonBenefits = [
    '401(k) with company match',
    'Health, dental, and vision insurance',
    'Paid time off and holidays',
    'Professional development budget',
    'CPA exam support and bonuses',
  ];

  const firmSpecificBenefits: Record<string, string[]> = {
    PwC: [
      ...commonBenefits,
      'Wealth Builder contribution (additional retirement)',
      'Student loan assistance ($100/month)',
      'Wellness reimbursement',
      'Flexible work arrangements',
    ],
    Deloitte: [
      ...commonBenefits,
      'Cash Balance Plan (pension)',
      'Well-being subsidy ($1,000/year)',
      'Backup care for family',
      'Sabbatical program (after 5 years)',
    ],
  };

  return firmSpecificBenefits[firm] || commonBenefits;
}
