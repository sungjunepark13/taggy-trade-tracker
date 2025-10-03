
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FinanceProvider } from "@/context/FinanceContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Index";
import AccountDetail from "./pages/AccountDetail";
import TithingDetail from "./pages/TithingDetail";
import DebtDetail from "./pages/DebtDetail";
import AddTrade from "./pages/AddTrade";
import History from "./pages/History";
import Tags from "./pages/Tags";
import Calendar from "./pages/Calendar";
import Setup from "./pages/Setup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <FinanceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              {/* Protected routes */}
              <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/account/:accountKey" element={<ProtectedRoute><AccountDetail /></ProtectedRoute>} />
              <Route path="/tithing" element={<ProtectedRoute><TithingDetail /></ProtectedRoute>} />
              <Route path="/debt" element={<ProtectedRoute><DebtDetail /></ProtectedRoute>} />
              <Route path="/add-trade" element={<ProtectedRoute><AddTrade /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/tags" element={<ProtectedRoute><Tags /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </FinanceProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
