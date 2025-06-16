import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard/Dashboard";

import AddMember from "./pages/Member/AddMember";
import DirectMembers from "./pages/Member/DirectMembers";
import MemberList from "./pages/Member/MemberList";

import IdActivation from "./pages/Top-Up/IDActivation";
import TopUpStatement from "./pages/Top-Up/TopUpStatement";

import SelfPurchase from "./pages/Purchase/SelfPurchase";
import SelfPurchaseReport from "./pages/Purchase/SelfPurchaseReport";

import TreeView from "./pages/Geneology/TreeView";

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
          {/* Top Up */}
          <Route path="/top-up/idactivation" element={<IdActivation />} />
          <Route path="/top-up/statement" element={<TopUpStatement />} />
          {/* Purchase */}
          <Route path="/purchase/self-purchase" element={<SelfPurchase />} />
          <Route
            path="/purchase/self-purchase-report"
            element={<SelfPurchaseReport />}
          />
          {/* Geneology */}
          <Route path="/geneology/binary-view" element={<TreeView />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
