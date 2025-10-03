import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Welcome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f3a] via-[#2d1b4e] to-[#4a2545] -z-10" />

      {/* Gradient orb effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/40 to-transparent rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="relative z-10">
        <div className="flex h-16 items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">myBig4</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button
              className="bg-white text-gray-900 hover:bg-gray-100"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm text-white/90">Built for Big 4 Professionals 💼</span>
        </div>

        {/* Hero heading */}
        <h1 className="text-center text-5xl md:text-7xl font-bold text-white mb-6 max-w-4xl">
          Master your <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">finances</span>
        </h1>

        {/* Subheading */}
        <p className="text-center text-lg md:text-xl text-white/80 mb-12 max-w-2xl">
          Smart financial planning for your Big 4 career journey
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 mb-24">
          <Button
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8"
            onClick={() => navigate('/signup')}
          >
            Get Started Free
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-white border border-white/20 hover:bg-white/10 text-lg px-8"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>

        {/* Features section */}
        <div className="w-full max-w-6xl">
          <div className="rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Everything you need to plan ahead</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: '5-Year Projections', emoji: '📊' },
                { label: 'Debt Planning', emoji: '💳' },
                { label: 'Emergency Fund', emoji: '🏦' },
                { label: 'Tax Calculations', emoji: '📈' },
                { label: 'Milestone Tracking', emoji: '🎯' },
                { label: 'Savings Goals', emoji: '💰' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/10 bg-white/5 px-6 py-4 text-center text-white/80"
                >
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <div className="text-sm font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
