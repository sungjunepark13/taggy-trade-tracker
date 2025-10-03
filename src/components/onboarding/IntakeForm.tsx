import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FinancialScenario, DebtInfo, EmploymentInfo } from '@/utils/financialEngine';
import { calculateBig4Compensation } from '@/utils/big4Compensation';
import { Trash2, Plus, Briefcase, Target } from 'lucide-react';

interface IntakeFormProps {
  onSubmit: (scenario: FinancialScenario) => void;
  initialData?: Partial<FinancialScenario>;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit, initialData }) => {
  const [employmentData, setEmploymentData] = useState<EmploymentInfo>({
    firm: initialData?.employment?.firm || 'PwC',
    position: initialData?.employment?.position || 'Associate',
    yearsAtFirm: initialData?.employment?.yearsAtFirm || 0,
    yearsPlannedToStay: initialData?.employment?.yearsPlannedToStay || 5,
    location: initialData?.employment?.location || 'Atlanta, GA',
  });

  const [projectedIncome, setProjectedIncome] = useState<number[]>([0, 0, 0, 0, 0]);
  const [benefits, setBenefits] = useState<string[]>([]);

  const [formData, setFormData] = useState<FinancialScenario>({
    filingStatus: initialData?.filingStatus || 'Single',
    ages: initialData?.ages || { primary: 25 },
    location: initialData?.location || 'Atlanta, GA',
    planningHorizon: initialData?.planningHorizon || 60,
    employment: initialData?.employment,
    incomeByYear: initialData?.incomeByYear || [0, 0, 0, 0, 0],
    monthlyExpenses: initialData?.monthlyExpenses || 0,
    monthlyExpenseDetails: initialData?.monthlyExpenseDetails || {
      rent: 0,
      parking: 0,
      rentersInsurance: 0,
      electricity: 0,
      naturalGas: 0,
      waterSewerTrash: 0,
      internet: 0,
      mobilePhones: 0,
      subscriptions: 0,
      autoInsurance: 0,
      gas: 0,
      maintenance: 0,
      registration: 0,
      eatingOut: 0,
      groceries: 0,
      tithing: 0,
    },
    initialDebts: initialData?.initialDebts || [],
    earnestMoneyTarget: initialData?.earnestMoneyTarget || 15000,
    efStarterTarget: initialData?.efStarterTarget || 5000,
    efFinalTarget: initialData?.efFinalTarget || 20000,
    downPaymentTarget: initialData?.downPaymentTarget || 60000,
    vacationFundTarget: initialData?.vacationFundTarget || 5000,
    charityTarget: initialData?.charityTarget || 50000,
  });

  // Calculate income when employment data changes
  useEffect(() => {
    try {
      const compensation = calculateBig4Compensation(employmentData);
      setProjectedIncome(compensation.incomeByYear);
      setBenefits(compensation.benefits);

      // Update form data with calculated income
      setFormData(prev => ({
        ...prev,
        incomeByYear: compensation.incomeByYear,
        employment: employmentData,
        location: employmentData.location,
      }));
    } catch (error) {
      console.error('Error calculating compensation:', error);
    }
  }, [employmentData]);

  const updateField = <K extends keyof FinancialScenario>(
    field: K,
    value: FinancialScenario[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateEmployment = <K extends keyof EmploymentInfo>(
    field: K,
    value: EmploymentInfo[K]
  ) => {
    setEmploymentData(prev => ({ ...prev, [field]: value }));
  };

  const updateExpenseDetail = (field: keyof NonNullable<FinancialScenario['monthlyExpenseDetails']>, value: number) => {
    setFormData(prev => ({
      ...prev,
      monthlyExpenseDetails: {
        ...prev.monthlyExpenseDetails!,
        [field]: value,
      },
    }));
  };

  const updateIncome = (index: number, value: number) => {
    const newIncomes = [...formData.incomeByYear];
    newIncomes[index] = value;
    updateField('incomeByYear', newIncomes);
  };

  const addDebt = () => {
    const newDebt: DebtInfo = {
      name: 'New Debt',
      balance: 0,
      apr: 0,
      minimumPayment: 0,
    };
    updateField('initialDebts', [...formData.initialDebts, newDebt]);
  };

  const updateDebt = (index: number, field: keyof DebtInfo, value: string | number) => {
    const newDebts = [...formData.initialDebts];
    newDebts[index] = { ...newDebts[index], [field]: value };
    updateField('initialDebts', newDebts);
  };

  const removeDebt = (index: number) => {
    updateField('initialDebts', formData.initialDebts.filter((_, i) => i !== index));
  };

  const calculateTotalExpenses = () => {
    if (!formData.monthlyExpenseDetails) return 0;
    const details = formData.monthlyExpenseDetails;
    return Object.values(details).reduce((sum, val) => sum + val, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalExpenses = calculateTotalExpenses();
    onSubmit({
      ...formData,
      monthlyExpenses: totalExpenses,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-4 space-y-6 [&_label]:text-white [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/40 [&_h3]:text-white [&_p]:text-white/80">
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Financial Planning Intake Form</CardTitle>
          <CardDescription className="text-white/80">
            Enter your financial information to create a personalized projection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employment" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="employment" className="data-[state=active]:bg-white/20 text-white/80 data-[state=active]:text-white">
                <Briefcase className="h-4 w-4 mr-2" />
                Employment
              </TabsTrigger>
              <TabsTrigger value="debts" className="data-[state=active]:bg-white/20 text-white/80 data-[state=active]:text-white">
                Debts & Loans
              </TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:bg-white/20 text-white/80 data-[state=active]:text-white">
                <Target className="h-4 w-4 mr-2" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="expenses" className="data-[state=active]:bg-white/20 text-white/80 data-[state=active]:text-white">Expenses</TabsTrigger>
            </TabsList>

            {/* Employment Information */}
            <TabsContent value="employment" className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firm" className="text-white">Which firm do you work for?</Label>
                    <Select
                      value={employmentData.firm}
                      onValueChange={(value: 'PwC' | 'Deloitte') => updateEmployment('firm', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        <SelectItem value="PwC" className="text-white hover:bg-white/10">PwC</SelectItem>
                        <SelectItem value="Deloitte" className="text-white hover:bg-white/10">Deloitte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="position" className="text-white">What is your current position?</Label>
                    <Select
                      value={employmentData.position}
                      onValueChange={(value: any) => updateEmployment('position', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        <SelectItem value="Associate" className="text-white hover:bg-white/10">Associate</SelectItem>
                        <SelectItem value="Senior Associate" className="text-white hover:bg-white/10">Senior Associate</SelectItem>
                        <SelectItem value="Manager" className="text-white hover:bg-white/10">Manager</SelectItem>
                        <SelectItem value="Senior Manager" className="text-white hover:bg-white/10">Senior Manager</SelectItem>
                        <SelectItem value="Director" className="text-white hover:bg-white/10">Director</SelectItem>
                        <SelectItem value="Partner" className="text-white hover:bg-white/10">Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="yearsAtFirm" className="text-white">How many years have you been at the firm?</Label>
                    <Input
                      id="yearsAtFirm"
                      type="number"
                      value={employmentData.yearsAtFirm}
                      onChange={(e) => updateEmployment('yearsAtFirm', parseInt(e.target.value) || 0)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearsPlannedToStay" className="text-white">How many years do you plan to stay?</Label>
                    <Input
                      id="yearsPlannedToStay"
                      type="number"
                      value={employmentData.yearsPlannedToStay}
                      onChange={(e) => updateEmployment('yearsPlannedToStay', parseInt(e.target.value) || 0)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="employmentLocation" className="text-white">Office Location</Label>
                    <Select
                      value={employmentData.location}
                      onValueChange={(value) => updateEmployment('location', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        <SelectItem value="New York, NY" className="text-white hover:bg-white/10">New York, NY</SelectItem>
                        <SelectItem value="San Francisco, CA" className="text-white hover:bg-white/10">San Francisco, CA</SelectItem>
                        <SelectItem value="Los Angeles, CA" className="text-white hover:bg-white/10">Los Angeles, CA</SelectItem>
                        <SelectItem value="Chicago, IL" className="text-white hover:bg-white/10">Chicago, IL</SelectItem>
                        <SelectItem value="Boston, MA" className="text-white hover:bg-white/10">Boston, MA</SelectItem>
                        <SelectItem value="Seattle, WA" className="text-white hover:bg-white/10">Seattle, WA</SelectItem>
                        <SelectItem value="Washington, DC" className="text-white hover:bg-white/10">Washington, DC</SelectItem>
                        <SelectItem value="Atlanta, GA" className="text-white hover:bg-white/10">Atlanta, GA</SelectItem>
                        <SelectItem value="Dallas, TX" className="text-white hover:bg-white/10">Dallas, TX</SelectItem>
                        <SelectItem value="Houston, TX" className="text-white hover:bg-white/10">Houston, TX</SelectItem>
                        <SelectItem value="Other" className="text-white hover:bg-white/10">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Projected Income Display */}
                <div className="mt-6 p-6 bg-white/10 rounded-lg border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Projected Compensation (Next 5 Years)</h3>
                  <div className="space-y-2">
                    {projectedIncome.map((income, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-white/80">Year {idx + 1}:</span>
                        <span className="text-white font-semibold">${income.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits Display */}
                <div className="p-6 bg-white/10 rounded-lg border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Your {employmentData.firm} Benefits</h3>
                  <ul className="space-y-2">
                    {benefits.map((benefit, idx) => (
                      <li key={idx} className="text-white/80 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="filingStatus" className="text-white">Filing Status</Label>
                  <Select
                    value={formData.filingStatus}
                    onValueChange={(value: 'MFJ' | 'Single') => updateField('filingStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MFJ">Married Filing Jointly</SelectItem>
                      <SelectItem value="Single">Single</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <Label htmlFor="primaryAge">Your Age</Label>
                  <Input
                    id="primaryAge"
                    type="number"
                    value={formData.ages.primary}
                    onChange={(e) => updateField('ages', { ...formData.ages, primary: parseInt(e.target.value) })}
                  />
                </div>

                {formData.filingStatus === 'MFJ' && (
                  <div>
                    <Label htmlFor="spouseAge">Spouse Age</Label>
                    <Input
                      id="spouseAge"
                      type="number"
                      value={formData.ages.spouse || ''}
                      onChange={(e) => updateField('ages', { ...formData.ages, spouse: parseInt(e.target.value) })}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="planningHorizon">Planning Horizon (months)</Label>
                  <Input
                    id="planningHorizon"
                    type="number"
                    value={formData.planningHorizon}
                    onChange={(e) => updateField('planningHorizon', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Income */}
            <TabsContent value="income" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your expected gross annual income for each of the next 5 years
                </p>
                {[1, 2, 3, 4, 5].map((year) => (
                  <div key={year}>
                    <Label htmlFor={`income-year-${year}`}>Year {year} Gross Income</Label>
                    <Input
                      id={`income-year-${year}`}
                      type="number"
                      value={formData.incomeByYear[year - 1]}
                      onChange={(e) => updateIncome(year - 1, parseInt(e.target.value))}
                      placeholder="$0"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Expenses */}
            <TabsContent value="expenses" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Housing & Utilities</h3>
                </div>
                <div>
                  <Label htmlFor="rent">Rent/Mortgage</Label>
                  <Input
                    id="rent"
                    type="number"
                    value={formData.monthlyExpenseDetails?.rent || 0}
                    onChange={(e) => updateExpenseDetail('rent', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="parking">Parking</Label>
                  <Input
                    id="parking"
                    type="number"
                    value={formData.monthlyExpenseDetails?.parking || 0}
                    onChange={(e) => updateExpenseDetail('parking', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="rentersInsurance">Renters/Home Insurance</Label>
                  <Input
                    id="rentersInsurance"
                    type="number"
                    value={formData.monthlyExpenseDetails?.rentersInsurance || 0}
                    onChange={(e) => updateExpenseDetail('rentersInsurance', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="electricity">Electricity</Label>
                  <Input
                    id="electricity"
                    type="number"
                    value={formData.monthlyExpenseDetails?.electricity || 0}
                    onChange={(e) => updateExpenseDetail('electricity', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="naturalGas">Natural Gas</Label>
                  <Input
                    id="naturalGas"
                    type="number"
                    value={formData.monthlyExpenseDetails?.naturalGas || 0}
                    onChange={(e) => updateExpenseDetail('naturalGas', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="waterSewerTrash">Water/Sewer/Trash</Label>
                  <Input
                    id="waterSewerTrash"
                    type="number"
                    value={formData.monthlyExpenseDetails?.waterSewerTrash || 0}
                    onChange={(e) => updateExpenseDetail('waterSewerTrash', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="internet">Internet</Label>
                  <Input
                    id="internet"
                    type="number"
                    value={formData.monthlyExpenseDetails?.internet || 0}
                    onChange={(e) => updateExpenseDetail('internet', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="mobilePhones">Mobile Phones</Label>
                  <Input
                    id="mobilePhones"
                    type="number"
                    value={formData.monthlyExpenseDetails?.mobilePhones || 0}
                    onChange={(e) => updateExpenseDetail('mobilePhones', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="subscriptions">Subscriptions</Label>
                  <Input
                    id="subscriptions"
                    type="number"
                    value={formData.monthlyExpenseDetails?.subscriptions || 0}
                    onChange={(e) => updateExpenseDetail('subscriptions', parseFloat(e.target.value))}
                  />
                </div>

                <div className="col-span-2">
                  <h3 className="text-lg font-semibold mb-2 mt-4">Transportation</h3>
                </div>
                <div>
                  <Label htmlFor="autoInsurance">Auto Insurance</Label>
                  <Input
                    id="autoInsurance"
                    type="number"
                    value={formData.monthlyExpenseDetails?.autoInsurance || 0}
                    onChange={(e) => updateExpenseDetail('autoInsurance', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="gas">Gas</Label>
                  <Input
                    id="gas"
                    type="number"
                    value={formData.monthlyExpenseDetails?.gas || 0}
                    onChange={(e) => updateExpenseDetail('gas', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maintenance">Maintenance</Label>
                  <Input
                    id="maintenance"
                    type="number"
                    value={formData.monthlyExpenseDetails?.maintenance || 0}
                    onChange={(e) => updateExpenseDetail('maintenance', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="registration">Registration</Label>
                  <Input
                    id="registration"
                    type="number"
                    value={formData.monthlyExpenseDetails?.registration || 0}
                    onChange={(e) => updateExpenseDetail('registration', parseFloat(e.target.value))}
                  />
                </div>

                <div className="col-span-2">
                  <h3 className="text-lg font-semibold mb-2 mt-4">Food & Living</h3>
                </div>
                <div>
                  <Label htmlFor="groceries">Groceries</Label>
                  <Input
                    id="groceries"
                    type="number"
                    value={formData.monthlyExpenseDetails?.groceries || 0}
                    onChange={(e) => updateExpenseDetail('groceries', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="eatingOut">Eating Out</Label>
                  <Input
                    id="eatingOut"
                    type="number"
                    value={formData.monthlyExpenseDetails?.eatingOut || 0}
                    onChange={(e) => updateExpenseDetail('eatingOut', parseFloat(e.target.value))}
                  />
                </div>

                <div className="col-span-2">
                  <h3 className="text-lg font-semibold mb-2 mt-4">Charitable</h3>
                </div>
                <div>
                  <Label htmlFor="tithing">Tithing/Charitable Giving (monthly)</Label>
                  <Input
                    id="tithing"
                    type="number"
                    value={formData.monthlyExpenseDetails?.tithing || 0}
                    onChange={(e) => updateExpenseDetail('tithing', parseFloat(e.target.value))}
                  />
                </div>

                <div className="col-span-2 mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-sm font-semibold text-white">Total Monthly Expenses: ${calculateTotalExpenses().toLocaleString()}</p>
                </div>
              </div>
            </TabsContent>

            {/* Debts */}
            <TabsContent value="debts" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-white/80">Add all your current debts</p>
                <Button type="button" onClick={addDebt} size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Debt
                </Button>
              </div>

              {formData.initialDebts.map((debt, index) => (
                <Card key={index} className="bg-white/5 border-white/20">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 flex justify-between items-center">
                        <h4 className="font-semibold text-white">Debt #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDebt(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div>
                        <Label htmlFor={`debt-name-${index}`}>Debt Name</Label>
                        <Input
                          id={`debt-name-${index}`}
                          value={debt.name}
                          onChange={(e) => updateDebt(index, 'name', e.target.value)}
                          placeholder="e.g., Student Loan"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`debt-balance-${index}`}>Current Balance</Label>
                        <Input
                          id={`debt-balance-${index}`}
                          type="number"
                          value={debt.balance}
                          onChange={(e) => updateDebt(index, 'balance', parseFloat(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`debt-apr-${index}`}>APR (as decimal, e.g., 0.07 for 7%)</Label>
                        <Input
                          id={`debt-apr-${index}`}
                          type="number"
                          step="0.01"
                          value={debt.apr}
                          onChange={(e) => updateDebt(index, 'apr', parseFloat(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`debt-minimum-${index}`}>Minimum Monthly Payment</Label>
                        <Input
                          id={`debt-minimum-${index}`}
                          type="number"
                          value={debt.minimumPayment}
                          onChange={(e) => updateDebt(index, 'minimumPayment', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {formData.initialDebts.length === 0 && (
                <div className="text-center p-8 text-white/60">
                  No debts added. Click "Add Debt" to get started.
                </div>
              )}
            </TabsContent>

            {/* Goals */}
            <TabsContent value="goals" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="earnestMoneyTarget">Earnest Money Target</Label>
                  <Input
                    id="earnestMoneyTarget"
                    type="number"
                    value={formData.earnestMoneyTarget}
                    onChange={(e) => updateField('earnestMoneyTarget', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="efStarterTarget">Emergency Fund Starter Target</Label>
                  <Input
                    id="efStarterTarget"
                    type="number"
                    value={formData.efStarterTarget}
                    onChange={(e) => updateField('efStarterTarget', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="efFinalTarget">Emergency Fund Final Target</Label>
                  <Input
                    id="efFinalTarget"
                    type="number"
                    value={formData.efFinalTarget}
                    onChange={(e) => updateField('efFinalTarget', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="downPaymentTarget">Down Payment Target</Label>
                  <Input
                    id="downPaymentTarget"
                    type="number"
                    value={formData.downPaymentTarget}
                    onChange={(e) => updateField('downPaymentTarget', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="vacationFundTarget">Vacation Fund Target</Label>
                  <Input
                    id="vacationFundTarget"
                    type="number"
                    value={formData.vacationFundTarget}
                    onChange={(e) => updateField('vacationFundTarget', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="charityTarget">Charity Fund Target</Label>
                  <Input
                    id="charityTarget"
                    type="number"
                    value={formData.charityTarget}
                    onChange={(e) => updateField('charityTarget', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
          Generate Financial Plan
        </Button>
      </div>
    </form>
  );
};
