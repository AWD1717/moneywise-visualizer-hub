
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Cashflows from "./pages/Cashflows";
import Budgets from "./pages/Budgets";
import Accounts from "./pages/Accounts";
import Investments from "./pages/Investments";
import Debts from "./pages/Debts";
import EmergencyFunds from "./pages/EmergencyFunds";
import NetWorth from "./pages/NetWorth";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider collapsedWidth={64}>
          <div className="min-h-screen flex w-full bg-background">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="cashflows" element={<Cashflows />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="investments" element={<Investments />} />
                <Route path="debts" element={<Debts />} />
                <Route path="emergency-funds" element={<EmergencyFunds />} />
                <Route path="net-worth" element={<NetWorth />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
