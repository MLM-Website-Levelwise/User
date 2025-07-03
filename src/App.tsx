import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Home";
import Login from "./pages/Login";

import Dashboard from "./pages/1.Dashboard/Dashboard";

import AddMember from "./pages/2.Member/AddMember";
import DirectMembers from "./pages/2.Member/DirectMembers";
import MemberList from "./pages/2.Member/MemberList";

import SelfIdActivation from "./pages/3.Top-Up/SelfIdActivation";
import SelfIdStatement from "./pages/3.Top-Up/SelfIdStatement";
import MemActivation from "./pages/3.Top-Up/MemActivation";
import TopUpStatement from "./pages/3.Top-Up/TopUpStatement";
import GrowthReTopUp from "./pages/3.Top-Up/ReTopUp";
import WalletTransfer from "./pages/3.Top-Up/WalletTransfer";

import SelfPurchase from "./pages/4.Purchase/SelfPurchase";
import SelfPurchaseReport from "./pages/4.Purchase/SelfPurchaseReport";

import ProfitSharingIncome from "./pages/6. Income/ProfitSharingIncome";
import DirectIncome from "./pages/6. Income/DirectIncome";

import TreeView from "./pages/5.Geneology/TreeView";
import LevelView from "./pages/5.Geneology/LevelView";

// import SendRequest from "./pages/7.Withdrawal.tsx/SendRequest";
// import RequestStatus from "./pages/7.Withdrawal.tsx/RequestStatus";

import Profile from "./pages/7. Settings/Profile";
import BankDetails from "./pages/7. Settings/BankDetails";
import PasswordReset from "./pages/7. Settings/PasswordReset";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Members */}
          <Route path="/member/add-member" element={<AddMember />} />
          <Route path="/member/member-memberlist" element={<MemberList />} />
          <Route path="/member/direct-list" element={<DirectMembers />} />
          {/* Geneology */}
          <Route path="/geneology/level-wise-team" element={<LevelView />} />
          <Route path="/geneology/binary-view" element={<TreeView />} />
          {/* Top Up */}
          <Route path="/top-up/idactivation" element={<SelfIdActivation />} />
          <Route path="/top-up/memidactivation" element={<MemActivation />} />
          <Route path="/top-up/growth-retopup" element={<GrowthReTopUp />} />
          <Route path="/top-up/self-statement" element={<SelfIdStatement />} />
          <Route path="/top-up/member-statement" element={<TopUpStatement />} />
          <Route path="/top-up/wallet-transfer" element={<WalletTransfer />} />
          {/* Purchase */}
          {/* <Route path="/purchase/self-purchase" element={<SelfPurchase />} />
          <Route
            path="/purchase/self-purchase-report"
            element={<SelfPurchaseReport />}
          /> */}

          {/* Income */}
          <Route
            path="/income/profitsharing-income"
            element={<ProfitSharingIncome />}
          />
          <Route path="/income/direct-income" element={<DirectIncome />} />

          {/* Withdrawal */}
          {/* <Route path="/withdrawal/send-request" element={<SendRequest />} />
          <Route
            path="/withdrawal/request-status"
            element={<RequestStatus />}
          /> */}

          {/* Settings */}
          {/* <Route path="/settings/profile" element={<Profile />} /> */}
          <Route path="/settings/password" element={<PasswordReset />} />
          <Route path="/settings/bank-details" element={<BankDetails />} />

          {/* Not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
