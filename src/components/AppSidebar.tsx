import {
  Home,
  ShoppingCart,
  Settings,
  Pin,
  Users,
  DollarSign,
  Briefcase,
  LogOut,
  Power,
  ChevronDown,
  UserCheck,
  Lock,
  Upload,
  Eye,
  History,
  UserPlus,
  List,
  User,
  Wallet,
} from "lucide-react";

import { useState, useEffect } from "react";
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
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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

  const handleNavigate = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-64 h-screen bg-blue-900 text-white flex flex-col shadow-xl fixed left-0 top-0 z-50">
        {/* Header */}
        <div className="p-4 border-b border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-blue-900 font-bold text-lg">P</span>
            </div>
            <span className="text-lg font-semibold">Prime Networks</span>
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
                background: #3b82f6;
                border-radius: 3px;
              }
              .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                background: #60a5fa;
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
                          ? "bg-blue-800 text-white shadow-md"
                          : "hover:bg-blue-800/50 text-white/90 hover:text-white"
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
                                : "text-white/70 hover:bg-blue-800/30 hover:text-white hover:pl-14"
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
                        ? "bg-blue-800 text-white shadow-md"
                        : "hover:bg-blue-800/50 text-white/90 hover:text-white"
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
        {/* <div className="p-4 border-t border-blue-800 mt-auto">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Power className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">Logout</span>
            </div>
            <button
              className="p-2 bg-blue-800 hover:bg-red-500/80 border border-transparent rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-white hover:text-red-100" />
            </button>
          </div>
        </div> */}
        <div className="p-4 border-t border-blue-800 mt-auto">
          <button
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

      {/* Spacer div to push content to the right of the sidebar */}
      <div className="w-64 flex-shrink-0"></div>
    </>
  );
}
