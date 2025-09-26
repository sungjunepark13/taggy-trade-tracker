
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinanceProvider } from "@/context/FinanceContext";
import Dashboard from "./pages/Index";
import AccountDetail from "./pages/AccountDetail";
import TithingDetail from "./pages/TithingDetail";
import DebtDetail from "./pages/DebtDetail";
import AddTrade from "./pages/AddTrade";
import History from "./pages/History";
import Tags from "./pages/Tags";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FinanceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/account/:accountKey" element={<AccountDetail />} />
            <Route path="/tithing" element={<TithingDetail />} />
            <Route path="/debt" element={<DebtDetail />} />
            <Route path="/add-trade" element={<AddTrade />} />
            <Route path="/history" element={<History />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/calendar" element={<Calendar />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </FinanceProvider>
  </QueryClientProvider>
);

export default App;
