import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setDevToken(null);
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      setSuccess(true);

      // In development, show the token for testing
      if (result.resetToken) {
        setDevToken(result.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
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
          <CardTitle className="text-2xl font-bold text-white">Reset your password</CardTitle>
          <CardDescription className="text-white/80">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>

        {success ? (
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
              </AlertDescription>
            </Alert>

            {devToken && (
              <Alert>
                <AlertDescription className="space-y-2">
                  <p className="font-semibold">Development Mode - Reset Token:</p>
                  <code className="block p-2 bg-muted rounded text-xs break-all">
                    {devToken}
                  </code>
                  <p className="text-xs">
                    Use this token on the reset password page or click:{' '}
                    <Link
                      to={`/reset-password?token=${devToken}`}
                      className="text-primary hover:underline"
                    >
                      Reset Password
                    </Link>
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-4">
              <Link to="/login">
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Button>
              </Link>
            </div>
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

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
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
                    Sending reset link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>

              <Link to="/login" className="w-full">
                <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Button>
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
