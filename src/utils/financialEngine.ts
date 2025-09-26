export interface DebtInfo {
  name: string;
  balance: number;
  apr: number;
  minimumPayment: number;
}

export interface MonthlySnapshot {
  month: number;
  year: number;
  annualGross: number;
  employee401kRate: number;
  employee401kMonthly: number;
  employerMatchMonthly: number;
  employerWealthBuilderMonthly: number; // PwC Wealth Builder + Deloitte Cash Balance
  hsaEmployeeMonthly: number;
  hsaEmployerMonthly: number;
  studentLoanAssistance: number; // PwC $100/month
  wellBeingSubsidy: number; // Deloitte $1000/year = $83.33/month
  fedTaxMonthly: number;
  stateTaxMonthly: number;
  ficaMonthly: number;
  netTakeHomeMonthly: number;
  monthlyExpenses: number;
  debtMinimumsPaidMonthly: number;
  goalBudgetDynamicMonthly: number;
  allocEarnest: number;
  allocEFStarter: number;
  allocDebtAvalanche: number;
  allocVacation: number;
  allocTrustFund: number;
  allocDownPayment: number;
  allocEFFinal: number;
  earnest: number;
  emergencyFund: number;
  downPayment: number;
  vacationFund: number;
  trustFund: number;
  debtPrivate10: number;
  debtStudent7: number;
  debtPrivate0: number;
  totalDebt: number;
  retirementBalanceBase: number;
  retirementBalanceExtra: number;
  retirementBalanceTotal: number;
  employee401k: number;
  employerMatch: number;
  employerWealthBuilder: number;
  hsaBalance: number;
  monthlyTithing: number;
  tithingYTD: number;
  tithingCarryforward: number;
  primaryAllocLabel: string;
  milestone: string;
}

export interface FinancialScenario {
  filingStatus: 'MFJ' | 'Single';
  ages: { primary: number; spouse?: number };
  location: string;
  planningHorizon: number;
  incomeByYear: number[];
  monthlyExpenses: number;
  monthlyExpenseDetails?: {
    rent: number;
    parking: number;
    rentersInsurance: number;
    electricity: number;
    naturalGas: number;
    waterSewerTrash: number;
    internet: number;
    mobilePhones: number;
    subscriptions: number;
    autoInsurance: number;
    gas: number;
    maintenance: number;
    registration: number;
    eatingOut: number;
    groceries: number;
    tithing: number;
  };
  initialDebts: DebtInfo[];
  earnestMoneyTarget: number;
  efStarterTarget: number;
  efFinalTarget: number;
  downPaymentTarget: number;
  vacationFundTarget: number;
  trustFundTarget: number;
}

// Calculate monthly gross for tithing (base salary only, not benefits)
const baseSalaryYear1 = 160000;
const monthlyGrossBase = baseSalaryYear1 / 12;
const monthlyTithing = monthlyGrossBase * 0.10; // 10% of gross income

const DEFAULT_SCENARIO: FinancialScenario = {
  filingStatus: 'MFJ',
  ages: { primary: 22, spouse: 23 },
  location: 'Atlanta, GA',
  planningHorizon: 60,
  // Base salaries: ~80k each = 160k combined
  // With benefits: +15.2k/year = 175.2k year 1
  incomeByYear: [175200, 202400, 234024, 271458, 315000],
  monthlyExpenses: 5700, // Total of all expense categories
  monthlyExpenseDetails: {
    // Housing & Utilities
    rent: 2000,
    parking: 200,
    rentersInsurance: 30,
    electricity: 170,
    naturalGas: 70,
    waterSewerTrash: 90,
    internet: 70,
    mobilePhones: 120,
    subscriptions: 350, // Includes $300 developer tools + $50 streaming
    // Transportation (2 cars)
    autoInsurance: 600,
    gas: 300,
    maintenance: 140,
    registration: 8,
    // Food & Living
    eatingOut: 600,
    groceries: 400,
    // Charitable
    tithing: monthlyTithing // 10% of gross income
  },
  initialDebts: [
    { name: 'Private 10%', balance: 50000, apr: 0.10, minimumPayment: 600 },
    { name: 'Student 7%', balance: 40000, apr: 0.07, minimumPayment: 350 },
    { name: 'Private 0%', balance: 50000, apr: 0.00, minimumPayment: 200 }
  ],
  earnestMoneyTarget: 15000,
  efStarterTarget: 5000,
  efFinalTarget: 20000,
  downPaymentTarget: 75000, // Increased from 50k due to additional benefits
  vacationFundTarget: 5000, // $5k vacation fund by end of year
  trustFundTarget: 50000 // $50k trust fund in 5 years
};

export class FinancialEngine {
  private scenario: FinancialScenario;
  private snapshots: MonthlySnapshot[] = [];
  private milestoneTracker: Set<string> = new Set();

  constructor(scenario: FinancialScenario = DEFAULT_SCENARIO) {
    this.scenario = scenario;
  }

  private getYearFromMonth(month: number): number {
    return Math.ceil(month / 12);
  }

  private getAnnualGross(year: number): number {
    const index = year - 1;
    return this.scenario.incomeByYear[index] || this.scenario.incomeByYear[this.scenario.incomeByYear.length - 1];
  }

  private areAllGoalsComplete(
    earnest: number,
    ef: number,
    downPayment: number,
    totalDebt: number
  ): boolean {
    return (
      earnest >= this.scenario.earnestMoneyTarget &&
      ef >= this.scenario.efFinalTarget &&
      downPayment >= this.scenario.downPaymentTarget &&
      totalDebt <= 0
    );
  }

  private calculateFederalTax(taxableIncome: number): number {
    const brackets = [
      { min: 0, max: 23200, rate: 0.10 },
      { min: 23200, max: 94300, rate: 0.12 },
      { min: 94300, max: 201050, rate: 0.22 },
      { min: 201050, max: 383900, rate: 0.24 },
      { min: 383900, max: 487450, rate: 0.32 },
      { min: 487450, max: 731200, rate: 0.35 },
      { min: 731200, max: Infinity, rate: 0.37 }
    ];

    let tax = 0;
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
        tax += taxableInBracket * bracket.rate;
      }
    }
    return tax;
  }

  private calculateFICA(annualGross: number): number {
    const ssCap = 176100;
    const medicareThreshold = 250000;

    const ssWages = Math.min(annualGross, ssCap);
    const socialSecurity = ssWages * 0.062;

    const medicare = annualGross * 0.0145;

    const additionalMedicare = annualGross > medicareThreshold ?
      (annualGross - medicareThreshold) * 0.009 : 0;

    return socialSecurity + medicare + additionalMedicare;
  }

  private calculateTaxes(month: number, annualGross: number, goalsComplete: boolean) {
    // Base salary calculation (benefits are added on top)
    const baseSalary = annualGross - 15200; // Remove benefits to get base

    // 401k: Both contribute 6% to get full match
    const employee401kRate = goalsComplete ? 0.15 : 0.06;
    const employee401kAnnual = baseSalary * employee401kRate;
    const employee401kMonthly = employee401kAnnual / 12;

    // Combined employer match: PwC 1.5% + Deloitte 3% = 4.5% average
    const employerMatchRate = 0.045;
    const employerMatchMonthly = (baseSalary * employerMatchRate) / 12;

    // Wealth Builder (PwC 3%) + Cash Balance (Deloitte 3%) = 6% combined
    const employerWealthBuilderMonthly = (baseSalary * 0.06) / 12;

    // HSA contributions (both on HDHP)
    const hsaEmployeeMonthly = goalsComplete ? 200 : 0; // Optional employee contribution
    const hsaEmployerMonthly = 58.33; // PwC $700/year = $58.33/month

    // Other benefits
    const studentLoanAssistance = 100; // PwC $100/month
    const wellBeingSubsidy = 83.33; // Deloitte $1000/year

    const standardDeductionMFJ = 29200;
    const hsaAnnualDeduction = (hsaEmployeeMonthly + hsaEmployerMonthly) * 12;
    const taxableIncome = Math.max(0, annualGross - employee401kAnnual - hsaAnnualDeduction - standardDeductionMFJ);

    const fedTaxAnnual = this.calculateFederalTax(taxableIncome);
    const gaStateDeduction = 24000;
    const gaStateTaxableIncome = Math.max(0, annualGross - employee401kAnnual - hsaAnnualDeduction - gaStateDeduction);
    const stateTaxAnnual = gaStateTaxableIncome * 0.0519;
    const ficaAnnual = this.calculateFICA(annualGross);

    // Net take home calculation without the benefits (they'll be allocated separately)
    const netTakeHomeAnnual = annualGross - employee401kAnnual - hsaEmployeeMonthly * 12 - fedTaxAnnual - stateTaxAnnual - ficaAnnual;
    const netTakeHomeMonthly = netTakeHomeAnnual / 12;

    return {
      employee401kRate,
      employee401kMonthly,
      employerMatchMonthly,
      employerWealthBuilderMonthly,
      hsaEmployeeMonthly,
      hsaEmployerMonthly,
      studentLoanAssistance,
      wellBeingSubsidy,
      fedTaxMonthly: fedTaxAnnual / 12,
      stateTaxMonthly: stateTaxAnnual / 12,
      ficaMonthly: ficaAnnual / 12,
      netTakeHomeMonthly
    };
  }

  public simulate(): MonthlySnapshot[] {
    this.snapshots = [];
    this.milestoneTracker.clear();

    let earnest = 0;
    let emergencyFund = 0;
    let downPayment = 0;
    let vacationFund = 0;
    let trustFund = 0;
    let retirementBalanceBase = 0;
    let retirementBalanceExtra = 0;
    let employee401k = 0;
    let employerMatch = 0;
    let employerWealthBuilder = 0;
    let hsaBalance = 0;
    let tithingCarryforward = 0;

    const debts = this.scenario.initialDebts.map(d => ({ ...d }));

    for (let month = 1; month <= this.scenario.planningHorizon; month++) {
      const year = this.getYearFromMonth(month);
      const annualGross = this.getAnnualGross(year);

      const prevTotalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
      const goalsComplete = this.areAllGoalsComplete(earnest, emergencyFund, downPayment, prevTotalDebt);

      const taxes = this.calculateTaxes(month, annualGross, goalsComplete);

      let totalMinimumsPaid = 0;
      debts.forEach(debt => {
        if (debt.balance > 0) {
          const monthlyInterest = debt.balance * (debt.apr / 12);
          const principalPayment = Math.max(0, debt.minimumPayment - monthlyInterest);
          debt.balance = Math.max(0, debt.balance - principalPayment);
          totalMinimumsPaid += debt.minimumPayment;
        }
      });

      // Calculate tithing (10% of base salary)
      const baseSalary = annualGross - 15200; // Remove benefits to get base
      const monthlyTithingAmount = (baseSalary * 0.10) / 12;

      // Calculate actual monthly expenses including dynamic tithing
      let actualMonthlyExpenses = this.scenario.monthlyExpenses;
      if (this.scenario.monthlyExpenseDetails) {
        // Recalculate total with current tithing amount
        const details = this.scenario.monthlyExpenseDetails;
        actualMonthlyExpenses = details.rent + details.parking + details.rentersInsurance +
          details.electricity + details.naturalGas + details.waterSewerTrash +
          details.internet + details.mobilePhones + details.subscriptions +
          details.autoInsurance + details.gas + details.maintenance + details.registration +
          details.eatingOut + details.groceries + monthlyTithingAmount;
      }

      // Track year-to-date tithing
      const monthInYear = ((month - 1) % 12) + 1;
      const tithingYTD = monthInYear === 1 ? monthlyTithingAmount :
        (monthInYear * monthlyTithingAmount);

      // Reset carryforward at year start, accumulate during year
      if (monthInYear === 1 && month > 1) {
        tithingCarryforward += tithingYTD;
      }

      // Goal budget is net income minus expenses and debt minimums
      // Subsidies are handled separately: loan assistance for debt, well-being for vacation
      const goalBudget = Math.max(0, taxes.netTakeHomeMonthly - actualMonthlyExpenses - totalMinimumsPaid);

      let remainingBudget = goalBudget;
      const allocations = {
        earnest: 0,
        efStarter: 0,
        debtAvalanche: 0,
        vacation: 0,
        trustFund: 0,
        downPayment: 0,
        efFinal: 0
      };
      const allocLabels: string[] = [];

      if (earnest < this.scenario.earnestMoneyTarget && remainingBudget > 0) {
        const alloc = Math.min(remainingBudget, this.scenario.earnestMoneyTarget - earnest);
        allocations.earnest = alloc;
        earnest += alloc;
        remainingBudget -= alloc;
        allocLabels.push('Earnest');
      }

      if (emergencyFund < this.scenario.efStarterTarget && remainingBudget > 0) {
        const alloc = Math.min(remainingBudget, this.scenario.efStarterTarget - emergencyFund);
        allocations.efStarter = alloc;
        emergencyFund += alloc;
        remainingBudget -= alloc;
        allocLabels.push('EF-Starter');
      }

      // Priority 3: Debt avalanche (includes loan assistance)
      // First apply loan assistance to highest APR debt
      if (taxes.studentLoanAssistance > 0) {
        const activeDebts = debts.filter(d => d.balance > 0).sort((a, b) => b.apr - a.apr);
        if (activeDebts.length > 0) {
          const targetDebt = activeDebts[0];
          const assistanceAlloc = Math.min(taxes.studentLoanAssistance, targetDebt.balance);
          targetDebt.balance -= assistanceAlloc;
          allocations.debtAvalanche = assistanceAlloc;
          if (!allocLabels.includes('Debt-Avalanche')) {
            allocLabels.push('Loan-Assistance-Debt');
          }
        }
      }

      // Then apply remaining budget to debt avalanche (only if budget is positive)
      if (remainingBudget > 0) {
        const activeDebts = debts.filter(d => d.balance > 0).sort((a, b) => b.apr - a.apr);
        if (activeDebts.length > 0) {
          const targetDebt = activeDebts[0];
          const alloc = Math.min(remainingBudget, targetDebt.balance);
          allocations.debtAvalanche = (allocations.debtAvalanche || 0) + alloc;
          targetDebt.balance -= alloc;
          remainingBudget -= alloc;
          if (!allocLabels.includes('Debt-Avalanche') && !allocLabels.includes('Loan-Assistance-Debt')) {
            allocLabels.push('Debt-Avalanche');
          }
        }
      }

      // Priority 4: Vacation fund ($5k target by year end)
      // Well-being subsidy is added directly to vacation fund
      vacationFund += taxes.wellBeingSubsidy;
      if (vacationFund < this.scenario.vacationFundTarget && remainingBudget > 0) {
        const alloc = Math.min(remainingBudget, this.scenario.vacationFundTarget - vacationFund);
        allocations.vacation = alloc;
        vacationFund += alloc;
        remainingBudget -= alloc;
        allocLabels.push('Vacation');
      }

      // Priority 5: Emergency fund final
      if (emergencyFund < this.scenario.efFinalTarget && remainingBudget > 0) {
        const alloc = Math.min(remainingBudget, this.scenario.efFinalTarget - emergencyFund);
        allocations.efFinal = alloc;
        emergencyFund += alloc;
        remainingBudget -= alloc;
        allocLabels.push('EF-Final');
      }

      // Priority 6: Trust fund for children ($50k in 5 years)
      // Start contributing AFTER debt is mostly paid (month 30+) to ensure we have enough cash flow
      // We need about $1,500/month from months 30-60 to reach $50k
      if (month >= 30 && trustFund < this.scenario.trustFundTarget && remainingBudget > 0) {
        const monthsRemaining = Math.max(1, 60 - month + 1);
        const neededMonthly = (this.scenario.trustFundTarget - trustFund) / monthsRemaining;
        const alloc = Math.min(remainingBudget, Math.min(neededMonthly, this.scenario.trustFundTarget - trustFund));
        allocations.trustFund = alloc;
        trustFund += alloc;
        remainingBudget -= alloc;
        allocLabels.push('Trust-Fund');
      }

      // Priority 7: House down payment - gets remaining budget
      if (remainingBudget > 0) {
        allocations.downPayment = remainingBudget;
        downPayment += remainingBudget;
        allocLabels.push('House-Fund');
        remainingBudget = 0;
      }

      // Track retirement components separately (minimum contributions only)
      employee401k += taxes.employee401kMonthly;
      employerMatch += taxes.employerMatchMonthly;
      employerWealthBuilder += taxes.employerWealthBuilderMonthly;
      hsaBalance += taxes.hsaEmployeeMonthly + taxes.hsaEmployerMonthly;

      // Apply growth to all retirement accounts
      const monthlyGrowthRate = Math.pow(1.06, 1/12) - 1;
      employee401k *= (1 + monthlyGrowthRate);
      employerMatch *= (1 + monthlyGrowthRate);
      employerWealthBuilder *= (1 + monthlyGrowthRate);
      hsaBalance *= (1 + monthlyGrowthRate);
      // No extra retirement contributions anymore
      retirementBalanceExtra = 0;

      // Calculate total retirement balances
      retirementBalanceBase = employee401k + employerMatch + employerWealthBuilder + hsaBalance;

      const milestones: string[] = [];

      if (earnest >= this.scenario.earnestMoneyTarget && !this.milestoneTracker.has('earnest15k')) {
        this.milestoneTracker.add('earnest15k');
        milestones.push('Earnest $15k reached');
      }

      if (emergencyFund >= this.scenario.efStarterTarget && !this.milestoneTracker.has('ef5k')) {
        this.milestoneTracker.add('ef5k');
        milestones.push('EF $5k starter reached');
      }

      const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
      if (totalDebt === 0 && prevTotalDebt > 0 && !this.milestoneTracker.has('debtFree')) {
        this.milestoneTracker.add('debtFree');
        milestones.push('All debts paid off');
      }

      if (downPayment >= 50000 && !this.milestoneTracker.has('dp50k')) {
        this.milestoneTracker.add('dp50k');
        milestones.push('Down Payment $50k reached');
      }

      if (downPayment >= this.scenario.downPaymentTarget && !this.milestoneTracker.has('dp75k')) {
        this.milestoneTracker.add('dp75k');
        milestones.push('Down Payment $75k target reached!');
      }

      if (emergencyFund >= this.scenario.efFinalTarget && !this.milestoneTracker.has('ef20k')) {
        this.milestoneTracker.add('ef20k');
        milestones.push('EF $20k final reached');
      }

      if (vacationFund >= this.scenario.vacationFundTarget && !this.milestoneTracker.has('vacation5k')) {
        this.milestoneTracker.add('vacation5k');
        milestones.push('Vacation fund $5k reached');
      }

      if (trustFund >= 10000 && !this.milestoneTracker.has('trust10k')) {
        this.milestoneTracker.add('trust10k');
        milestones.push('Trust fund $10k milestone');
      }

      if (trustFund >= 25000 && !this.milestoneTracker.has('trust25k')) {
        this.milestoneTracker.add('trust25k');
        milestones.push('Trust fund $25k milestone');
      }

      if (trustFund >= this.scenario.trustFundTarget && !this.milestoneTracker.has('trust50k')) {
        this.milestoneTracker.add('trust50k');
        milestones.push('Trust fund $50k target reached!');
      }

      if (goalsComplete && !this.milestoneTracker.has('rate15')) {
        this.milestoneTracker.add('rate15');
        milestones.push('401k rate increased to 15%');
      }

      this.snapshots.push({
        month,
        year,
        annualGross,
        employee401kRate: taxes.employee401kRate,
        employee401kMonthly: taxes.employee401kMonthly,
        employerMatchMonthly: taxes.employerMatchMonthly,
        employerWealthBuilderMonthly: taxes.employerWealthBuilderMonthly,
        hsaEmployeeMonthly: taxes.hsaEmployeeMonthly,
        hsaEmployerMonthly: taxes.hsaEmployerMonthly,
        studentLoanAssistance: taxes.studentLoanAssistance,
        wellBeingSubsidy: taxes.wellBeingSubsidy,
        fedTaxMonthly: taxes.fedTaxMonthly,
        stateTaxMonthly: taxes.stateTaxMonthly,
        ficaMonthly: taxes.ficaMonthly,
        netTakeHomeMonthly: taxes.netTakeHomeMonthly,
        monthlyExpenses: actualMonthlyExpenses,
        debtMinimumsPaidMonthly: totalMinimumsPaid,
        goalBudgetDynamicMonthly: goalBudget,
        allocEarnest: allocations.earnest,
        allocEFStarter: allocations.efStarter,
        allocDebtAvalanche: allocations.debtAvalanche,
        allocVacation: allocations.vacation,
        allocTrustFund: allocations.trustFund,
        allocDownPayment: allocations.downPayment,
        allocEFFinal: allocations.efFinal,
        earnest,
        emergencyFund,
        downPayment,
        vacationFund,
        trustFund,
        debtPrivate10: debts[0].balance,
        debtStudent7: debts[1].balance,
        debtPrivate0: debts[2].balance,
        totalDebt,
        retirementBalanceBase,
        retirementBalanceExtra,
        retirementBalanceTotal: retirementBalanceBase + retirementBalanceExtra,
        employee401k,
        employerMatch,
        employerWealthBuilder,
        hsaBalance,
        monthlyTithing: monthlyTithingAmount,
        tithingYTD,
        tithingCarryforward,
        primaryAllocLabel: allocLabels.join(', '),
        milestone: milestones.join(', ')
      });
    }

    return this.snapshots;
  }

  public getAnnualReconciliation(): { year: number; data: any }[] {
    const reconciliation = [];

    for (let year = 1; year <= 5; year++) {
      const yearMonths = this.snapshots.filter(s => s.year === year);
      if (yearMonths.length === 0) continue;

      const annualGross = yearMonths[0].annualGross;
      const employee401k = yearMonths.reduce((sum, m) => sum + m.employee401kMonthly, 0);
      const employerMatch = yearMonths.reduce((sum, m) => sum + m.employerMatchMonthly, 0);
      const fedTax = yearMonths.reduce((sum, m) => sum + m.fedTaxMonthly, 0);
      const stateTax = yearMonths.reduce((sum, m) => sum + m.stateTaxMonthly, 0);
      const fica = yearMonths.reduce((sum, m) => sum + m.ficaMonthly, 0);
      const netTakeHome = yearMonths.reduce((sum, m) => sum + m.netTakeHomeMonthly, 0);

      const expenses = yearMonths.reduce((sum, m) => sum + m.monthlyExpenses, 0);
      const debtMinimums = yearMonths.reduce((sum, m) => sum + m.debtMinimumsPaidMonthly, 0);
      const goalBudgetUsed = yearMonths.reduce((sum, m) =>
        sum + m.allocEarnest + m.allocEFStarter + m.allocDebtAvalanche +
        m.allocDownPayment + m.allocEFFinal + m.allocRetirementExtra, 0);

      const difference = netTakeHome - (expenses + debtMinimums + goalBudgetUsed);

      reconciliation.push({
        year,
        data: {
          annualGross,
          employee401k,
          employerMatch,
          fedTax,
          stateTax,
          fica,
          netTakeHome,
          expenses,
          debtMinimums,
          goalBudgetUsed,
          totalUsed: expenses + debtMinimums + goalBudgetUsed,
          difference,
          checkPassed: Math.abs(difference) < 1
        }
      });
    }

    return reconciliation;
  }

  public getSnapshots(): MonthlySnapshot[] {
    return this.snapshots;
  }
}