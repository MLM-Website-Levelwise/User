import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import {
  Home,
  ShoppingCart,
  Share2,
  Settings,
  Pin,
  Users,
  CreditCard,
  DollarSign,
  Briefcase,
  LogOut,
  Power,
  ChevronDown,
  Download,
  UserCheck,
  Lock,
  Upload,
  Eye,
  History,
  UserPlus,
  List,
  UsersIcon,
  TreePine,
} from "lucide-react";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";

// Define types
type SubMenuItem = {
  title: string;
  icon: React.ElementType;
  isActive?: boolean;
  path?: string;
};

type MenuItem = {
  title: string;
  icon: React.ElementType;
  badge?: string;
  isActive?: boolean;
  submenu?: SubMenuItem[] | boolean;
  path?: string;
};

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    title: "Member",
    icon: Users,
    submenu: [
      { title: "Add Member", icon: UserPlus, path: "/member/add-member" },
      {
        title: "Member List",
        icon: List,
        path: "/member/member-memberlist",
      },
      {
        title: "Direct Member List",
        icon: UsersIcon,
        path: "/member/direct-list",
      },
    ],
  },
  {
    title: "Top-Up",
    icon: Pin,
    submenu: [
      { title: "ID Activation", icon: Eye, path: "/top-up/idactivation" },
      { title: "Top-Up Statement", icon: History, path: "/top-up/statement" },
    ],
  },
  {
    title: "Purchase",
    icon: ShoppingCart,
    submenu: [
      { title: "Self Purchase", icon: Eye, path: "/purchase/self-purchase" },
      {
        title: "Self Purchase Report",
        icon: History,
        path: "/purchase/self-purchase-report",
      },
    ],
  },
  {
    title: "Geneology",
    icon: Users,
    submenu: [
      {
        title: "Level View",
        icon: UserPlus,
        path: "/geneology/level-wise-team",
      },
      { title: "Binary View", icon: UserPlus, path: "/geneology/binary-view" },
    ],
  },
  {
    title: "Withdrawal",
    icon: DollarSign,
    submenu: [
      {
        title: "Send Request",
        icon: UserPlus,
        path: "/withdrawal/send-request",
      },
      {
        title: "Request Status",
        icon: UserPlus,
        path: "/withdrawal/request-status",
      },
    ],
  },
  {
    title: "Income",
    icon: Briefcase,
    submenu: [
      {
        title: "Direct Income",
        icon: UserCheck,
        path: "/income/direct-income",
      },
      {
        title: "Level-wise Income",
        icon: UserCheck,
        path: "/income/levelwise-income",
      },
      {
        title: "Growth-wise Income",
        icon: UserCheck,
        path: "/income/levelwise-income",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    submenu: [
      { title: "Profile", icon: UserCheck, path: "/settings/profile" },
      { title: "Password Reset", icon: Lock, path: "/settings/password" },
      {
        title: "KYC Upload",
        icon: Upload,
        path: "/settings/kyc",
      },
    ],
  },
  // {
  //   title: "Purchase",
  //   icon: CreditCard,
  //   path: "/purchase",
  // },
  // {
  //   title: "Bonus Income",
  //   icon: DollarSign,
  //   path: "/bonus-income",
  // },
  // {
  //   title: "Business (L : R)",
  //   icon: Briefcase,
  //   path: "/business",
  // },
  // {
  //   title: "Withdraw",
  //   icon: LogOut,
  //   path: "/withdraw",
  // },
];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Dashboard",
    "Settings",
    "PIN",
    "Mass Influencer",
  ]);
  const navigate = useNavigate();

  const toggleExpanded = (itemTitle: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemTitle)
        ? prev.filter((item) => item !== itemTitle)
        : [...prev, itemTitle]
    );
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("member");
    
    // Redirect to login
    navigate("/login");
    
    // Optional: Refresh the page to clear any state
    window.location.reload();
  };

  const handleNavigate = (path?: string, title?: string) => {
    if (path) {
      navigate(path);
      if (title) setActiveItem(title);
    }
  };

  return (
    <Sidebar className="bg-primary text-white border-r-0">
      <SidebarHeader className="border-b border-white/20 p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-xl">P</span>
          </div>
          <span className="text-lg font-bold text-white">
            Prime Networks Inc
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 overflow-visible">
        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-400 font-semibold mb-4">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {Array.isArray(item.submenu) ? (
                    <Collapsible
                      open={expandedItems.includes(item.title)}
                      onOpenChange={() => toggleExpanded(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            activeItem === item.title
                              ? "bg-white/20 text-white"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              <item.icon className="w-5 h-5" />
                              <span className="text-sm">{item.title}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {item.badge && (
                                <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-semibold">
                                  {item.badge}
                                </span>
                              )}
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  expandedItems.includes(item.title)
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-visible">
                        <SidebarMenuSub>
                          {(item.submenu as SubMenuItem[]).map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                                  subItem.isActive
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                                onClick={() =>
                                  handleNavigate(subItem.path, subItem.title)
                                }
                              >
                                <div className="w-2 h-2 rounded-full bg-current"></div>
                                <span className="text-sm">{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      onClick={() => handleNavigate(item.path, item.title)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        activeItem === item.title
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span className="text-sm">{item.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-semibold">
                              {item.badge}
                            </span>
                          )}
                          {item.submenu === true && (
                            <span className="text-white/60">›</span>
                          )}
                        </div>
                      </div>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Power className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">Pwd</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
