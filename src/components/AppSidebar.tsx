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
  Wallet,
  User,
  X,
  Menu,
} from "lucide-react";

import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavigate, useLocation } from "react-router-dom";

// Define types
type SubMenuItem = {
  title: string;
  icon: React.ElementType;
  path?: string;
};

type MenuItem = {
  title: string;
  icon: React.ElementType;
  badge?: string;
  submenu?: SubMenuItem[];
  path?: string;
};

// Menu Configuration
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
        icon: User,
        path: "/member/direct-list",
      },
    ],
  },
  {
    title: "Top-Up",
    icon: Pin,
    submenu: [
      { title: "Self Activation", icon: Eye, path: "/top-up/idactivation" },
      {
        title: "Member Activation",
        icon: Eye,
        path: "/top-up/memidactivation",
      },
      {
        title: "Re Top-Up",
        icon: Eye,
        path: "/top-up/growth-retopup",
      },
      {
        title: "Wallet Transfer",
        icon: Wallet,
        path: "/top-up/wallet-transfer",
      },
      { title: "Self Report", icon: History, path: "/top-up/self-statement" },

      {
        title: "Member Report",
        icon: History,
        path: "/top-up/member-statement",
      },
    ],
  },
  // {
  //   title: "Purchase",
  //   icon: ShoppingCart,
  //   submenu: [
  //     { title: "Self Purchase", icon: Eye, path: "/purchase/self-purchase" },
  //     {
  //       title: "Self Purchase Report",
  //       icon: History,
  //       path: "/purchase/self-purchase-report",
  //     },
  //   ],
  // },
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
    title: "Income",
    icon: Briefcase,
    submenu: [
      {
        title: "Profit Sharing Income",
        icon: UserCheck,
        path: "/income/profitsharing-income",
      },
      {
        title: "Direct Income",
        icon: UserCheck,
        path: "/income/direct-income",
      },
      {
        title: "Level Income",
        icon: UserCheck,
        path: "/income/level-income",
      },
      {
        title: "Growth Income",
        icon: UserCheck,
        path: "/income/growth-income",
      },
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
  // {
  //   title: "Income",
  //   icon: Briefcase,
  //   submenu: [
  //     {
  //       title: "Direct Income",
  //       icon: UserCheck,
  //       path: "/income/direct-income",
  //     },
  //     {
  //       title: "Level-wise Income",
  //       icon: UserCheck,
  //       path: "/income/levelwise-income",
  //     },
  //     {
  //       title: "Growth-wise Income",
  //       icon: UserCheck,
  //       path: "/income/levelwise-income",
  //     },
  //   ],
  // },
  {
    title: "Settings",
    icon: Settings,
    submenu: [
      { title: "Profile", icon: UserCheck, path: "/settings/profile" },
      { title: "Password Reset", icon: Lock, path: "/settings/password" },
      {
        title: "Bank Details",
        icon: Upload,
        path: "/settings/bank-details",
      },
    ],
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    const toggleSidebar = () => {
      setIsMobileMenuOpen((prev) => !prev);
    };

    document.addEventListener("toggle-sidebar", toggleSidebar);
    return () => {
      document.removeEventListener("toggle-sidebar", toggleSidebar);
    };
  }, []);

  // Function to check if a path is active
  const isPathActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  // Function to check if a main menu item should be active (if any of its children are active)
  const isMainItemActive = (item: MenuItem) => {
    if (item.path && isPathActive(item.path)) return true;
    if (item.submenu) {
      return item.submenu.some((subItem) => isPathActive(subItem.path));
    }
    return false;
  };

  // Auto-expand menu if one of its children is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (
        item.submenu &&
        item.submenu.some((subItem) => isPathActive(subItem.path))
      ) {
        setExpandedItems((prev) =>
          prev.includes(item.title) ? prev : [...prev, item.title]
        );
      }
    });
  }, [location.pathname]);

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
    }
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      {/* {!isMobileMenuOpen && (
        <button
          className="md:hidden fixed top-[21px] left-4 z-50 bg-purple-800 p-2 rounded-lg shadow-lg text-white"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
      )} */}
      {/* Sidebar */}
      <div
        className={`
          w-64 h-[100dvh] bg-gradient-to-b from-blue-900 to-blue-950 
          text-white flex flex-col shadow-xl fixed left-0 top-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Close button inside sidebar (top right) */}
        {isMobileMenuOpen && (
          <button
            className="md:hidden absolute top-[21px] right-4 z-50 bg-blue-800 p-2 rounded-lg shadow-lg text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        )}

        {/* Header */}
        <div className="p-4 border-b border-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-blue-900 font-bold text-lg">PN</span>
            </div>
            <span className="text-lg font-semibold">Prime Next</span>
          </div>
        </div>

        {/* Menu with custom scrollbar */}
        <div className="flex-1 px-4 py-4 overflow-y-auto sidebar-scroll">
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .sidebar-scroll::-webkit-scrollbar {
                width: 6px;
              }
              .sidebar-scroll::-webkit-scrollbar-track {
                background: #1e3a8a;
                border-radius: 3px;
              }
              .sidebar-scroll::-webkit-scrollbar-thumb {
                background: #8b5cf6;
                border-radius: 3px;
              }
              .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                background: #a78bfa;
              }
            `,
            }}
          />
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.title}>
                {Array.isArray(item.submenu) ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                        isMainItemActive(item)
                          ? "bg-blue-700 text-white shadow-md"
                          : "hover:bg-blue-700/50 text-white/90 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon
                          className={`w-5 h-5 ${
                            isMainItemActive(item) ? "text-blue-300" : ""
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedItems.includes(item.title) ? "rotate-180" : ""
                        } ${isMainItemActive(item) ? "text-blue-300" : ""}`}
                      />
                    </button>

                    {/* Submenu */}
                    {expandedItems.includes(item.title) && (
                      <div className="mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.title}
                            onClick={() => handleNavigate(subItem.path)}
                            className={`w-full text-left flex items-center space-x-3 px-3 py-2.5 pl-12 rounded-lg transition-all duration-200 group ${
                              isPathActive(subItem.path)
                                ? "bg-yellow-600/30 text-yellow-300 shadow-md border border-yellow-500/50"
                                : "text-white/70 hover:bg-blue-700/30 hover:text-white hover:pl-14"
                            }`}
                          >
                            <subItem.icon
                              className={`w-4 h-4 ${
                                isPathActive(subItem.path)
                                  ? "text-yellow-300"
                                  : ""
                              }`}
                            />
                            <span className="text-sm">{subItem.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center group ${
                      isPathActive(item.path)
                        ? "bg-blue-700 text-white shadow-md"
                        : "hover:bg-blue-700/50 text-white/90 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon
                        className={`w-5 h-5 ${
                          isPathActive(item.path) ? "text-blue-300" : ""
                        }`}
                      />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 hover:bg-red-500 group"
            title="Logout"
          >
            <div className="flex items-center space-x-2">
              <Power className="w-4 h-4 text-white/60 group-hover:text-white" />
              <span className="text-sm text-white/60 group-hover:text-white">
                Logout
              </span>
            </div>
            <LogOut className="w-4 h-4 text-white/60 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Spacer div - only on desktop */}
      <div className="hidden md:block w-64 flex-shrink-0"></div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
