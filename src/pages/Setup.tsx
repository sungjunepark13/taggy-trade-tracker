import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IntakeForm } from '@/components/onboarding/IntakeForm';
import { FinancialScenario } from '@/utils/financialEngine';

const Setup = () => {
  const navigate = useNavigate();
  const [existingScenario, setExistingScenario] = useState<Partial<FinancialScenario> | undefined>();

  useEffect(() => {
    // Load existing scenario from localStorage if it exists
    try {
      const stored = localStorage.getItem('financialScenario');
      if (stored) {
        setExistingScenario(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading existing scenario:', error);
    }
  }, []);

  const handleSubmit = (scenario: FinancialScenario) => {
    // Store the scenario in localStorage
    localStorage.setItem('financialScenario', JSON.stringify(scenario));

    // Navigate to dashboard
    navigate('/dashboard');

    // Reload to apply new scenario
    window.location.reload();
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-8">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f3a] via-[#2d1b4e] to-[#4a2545] -z-10" />

      {/* Gradient orb effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/40 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">
            {existingScenario ? 'Edit Your Financial Plan' : 'Welcome to myBig4'}
          </h1>
          <p className="text-white/80">
            {existingScenario
              ? 'Update your financial information below'
              : "Let's get started by setting up your financial profile"}
          </p>
        </div>

        <IntakeForm onSubmit={handleSubmit} initialData={existingScenario} />
      </div>
    </div>
  );
};

export default Setup;
