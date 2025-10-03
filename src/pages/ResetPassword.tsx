import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  // Password strength validation
  const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password requirements
    const unmetRequirements = passwordRequirements.filter(req => !req.test(newPassword));
    if (unmetRequirements.length > 0) {
      setError('Password does not meet all requirements');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f3a] via-[#2d1b4e] to-[#4a2545] -z-10" />

      {/* Gradient orb effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/40 to-transparent rounded-full blur-3xl -z-10" />

      <Card className="w-full max-w-md bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">Set new password</CardTitle>
          <CardDescription className="text-white/80">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        {success ? (
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Your password has been reset successfully! Redirecting to login...
              </AlertDescription>
            </Alert>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!token && (
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-white">Reset Token</Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter the reset token from your email"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  <p className="text-xs text-white/60">
                    The token should be in the reset link you received via email
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-white">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onFocus={() => setShowPasswordRequirements(true)}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                {showPasswordRequirements && (
                  <div className="mt-2 p-3 border border-white/20 rounded-md bg-white/5 space-y-1">
                    <p className="text-xs font-medium mb-2 text-white">Password must contain:</p>
                    {passwordRequirements.map((req, idx) => {
                      const met = req.test(newPassword);
                      return (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          {met ? (
                            <CheckCircle2 className="h-3 w-3 text-green-400" />
                          ) : (
                            <X className="h-3 w-3 text-white/40" />
                          )}
                          <span className={met ? 'text-green-400' : 'text-white/60'}>
                            {req.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-white text-gray-900 hover:bg-gray-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset password'
                )}
              </Button>

              <p className="text-sm text-center text-white/80">
                Remember your password?{' '}
                <Link to="/login" className="text-pink-400 hover:text-pink-300 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
