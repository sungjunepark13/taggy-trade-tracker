import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);

  const { verifyEmail, resendVerification, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleVerification(token);
    }
  }, [searchParams]);

  const handleVerification = async (token: string) => {
    setLoading(true);
    setError('');

    try {
      await verifyEmail(token);
      setSuccess(true);
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed. The link may be expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      await resendVerification();
      setError(''); // Clear any previous errors
      alert('Verification email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f3a] via-[#2d1b4e] to-[#4a2545] -z-10" />

        {/* Gradient orb effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/40 to-transparent rounded-full blur-3xl -z-10" />

        <Card className="w-full max-w-md bg-black/40 backdrop-blur-sm border-white/10">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-pink-400" />
              <p className="text-center text-white/80">Verifying your email...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f3a] via-[#2d1b4e] to-[#4a2545] -z-10" />

      {/* Gradient orb effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/40 to-transparent rounded-full blur-3xl -z-10" />

      <Card className="w-full max-w-md bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-pink-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">
            {success ? 'Email Verified!' : 'Verify Your Email'}
          </CardTitle>
          <CardDescription className="text-center text-white/80">
            {success
              ? 'Your email has been successfully verified'
              : 'Check your email for a verification link'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {user && !user.isEmailVerified && (
                <>
                  <p className="text-sm text-white/80 text-center">
                    We sent a verification link to <strong>{user.email}</strong>
                  </p>
                  <p className="text-sm text-white/80 text-center">
                    Click the link in the email to verify your account.
                  </p>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button
                      onClick={handleResend}
                      disabled={resending}
                      variant="outline"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      {resending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Resend verification email'
                      )}
                    </Button>
                  </div>
                </>
              )}

              {!user && (
                <p className="text-sm text-white/80 text-center">
                  Please check your email and click the verification link.
                </p>
              )}
            </>
          )}

          <div className="pt-4">
            <Link to="/dashboard">
              <Button variant="default" className="w-full bg-white text-gray-900 hover:bg-gray-100">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
