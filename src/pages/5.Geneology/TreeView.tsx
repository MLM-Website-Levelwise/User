import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, ChevronUp, Search } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface TeamMember {
  id: number;
  member_id: string;
  name: string;
  sponsor_code: string;
  sponsor_name: string;
  position: "Left" | "Right";
  date_of_joining: string;
  active_status: boolean;
  children?: TeamMember[];
  level?: number;
}

const MLMBinaryTree = () => {
  const [treeData, setTreeData] = useState<{
    root: TeamMember;
    history: TeamMember[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState("");
  const [currentLevels, setCurrentLevels] = useState(3);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const treeContainerRef = useRef<HTMLDivElement>(null);

  const fetchTeamData = async (rootId?: string, levels = currentLevels) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await axios.get(`${API_BASE_URL}/team-structure`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          root_id: rootId,
          levels: levels
        }
      });

      setTreeData(prev => {
        const newRoot = response.data;
        const isNewRoot = !prev || prev.root.member_id !== newRoot.member_id;
        
        return {
          root: newRoot,
          history: isNewRoot && prev 
            ? [...prev.history.slice(-4), prev.root] // Keep last 5 in history
            : prev?.history || []
        };
      });

      // Update breadcrumbs
      if (rootId) {
        setBreadcrumbs(prev => [...prev.slice(-3), rootId]);
      } else {
        setBreadcrumbs([]);
      }

      // Scroll to center after data loads
      setTimeout(() => {
        if (treeContainerRef.current) {
          treeContainerRef.current.scrollTo({
            left: treeContainerRef.current.scrollWidth / 2 - treeContainerRef.current.clientWidth / 2,
            behavior: 'smooth'
          });
        }
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData(); // Initial load with logged-in user as root
  }, []);

  const handleNodeClick = (member: TeamMember) => {
    setCurrentLevels(3); // Show 4 levels when drilling down
    fetchTeamData(member.member_id, 3);

  };

  const handleGoBack = (index: number) => {
    if (!treeData?.history.length) return;
    
    // If clicking on breadcrumb
    if (index >= 0) {
      const targetId = breadcrumbs[index];
      const historyIndex = index - (breadcrumbs.length - treeData.history.length);
      const previousRoot = treeData.history[historyIndex] || treeData.history[0];
      
      if (previousRoot.member_id === targetId) {
        setCurrentLevels(index === breadcrumbs.length - 1 ? 3 : 4);
        setTreeData(prev => ({
          root: previousRoot,
          history: prev?.history.slice(0, historyIndex) || []
        }));
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
      }
    } 
    // If clicking back button
    else {
      const previousRoot = treeData.history[treeData.history.length - 1];
      setCurrentLevels(3); // Show 3 levels when going back
      setTreeData(prev => ({
        root: previousRoot,
        history: prev?.history.slice(0, -1) || []
      }));
      setBreadcrumbs(breadcrumbs.slice(0, -1));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setCurrentLevels(4);
      fetchTeamData(searchId, 4);
    }
  };

  const MemberNode = ({
  member,
  isRoot = false,
  isPlaceholder = false,
}: {
  member: TeamMember;
  isRoot?: boolean;
  isPlaceholder?: boolean;
}) => {
  const iconColor = member.active_status ? "text-green-600" : "text-red-600";
  const statusColor = member.active_status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  const statusLabel = member.active_status ? "Active" : "Inactive";

  if (isPlaceholder) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
          <User className="w-10 h-10 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex flex-col items-center">
          <div
            className="relative flex flex-col items-center cursor-pointer p-2"
            onClick={() => handleNodeClick(member)}
          >
            <div
  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-md ${
    member.active_status ? 'bg-green-500' : 'bg-red-500'
  }`}
>
  <User className="w-10 h-10 text-white" />
</div>

            <div className="text-center mt-2 text-sm font-semibold text-gray-800">
              {member.member_id}
            </div>
            <div className="text-xs mt-1">
              <span className={`px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">{member.name}</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>ID: {member.member_id}</div>
            <div>Sponsor: {member.sponsor_code}</div>
            <div>Position: {member.position}</div>
            <div>Status:
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            <div>Joined: {new Date(member.date_of_joining).toLocaleDateString()}</div>
            <div>Level: {member.level}</div>
          </div>
          <Button
            size="sm"
            className="w-full mt-2"
            onClick={() => handleNodeClick(member)}
          >
            View Downline (4 Levels)
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};


  const renderTree = (node: TeamMember, depth = 0): JSX.Element => {
  const leftChild = node.children?.find(c => c.position === "Left") || null;
  const rightChild = node.children?.find(c => c.position === "Right") || null;

  return (
    <div className="flex flex-col items-center relative">
      {/* Node */}
      <MemberNode member={node} isRoot={depth === 0} />

      {/* Connector Lines (below node) */}
      {(leftChild || rightChild) && (
        <>
          {/* Vertical line from node to horizontal bar */}
          <div className="h-6 w-px bg-gray-300" />

          {/* Horizontal line between left and right */}
          <div className="flex items-center justify-center relative">
  <div
    className="h-px bg-gray-300"
    style={{ width: depth === 0 ? "16rem" : "6rem" }}
  />
  <div className="w-6 h-px bg-gray-300" />
  <div
    className="h-px bg-gray-300"
    style={{ width: depth === 0 ? "10rem" : "6rem" }}
  />
</div>

        </>
      )}

      {/* Children */}
      {(leftChild || rightChild) && (
        <div className="flex justify-center gap-32 mt-4">
          {/* Left */}
          <div className="flex flex-col items-center">
            <div className="h-6 w-px bg-gray-300" />
            {leftChild
              ? renderTree(leftChild, depth + 1)
              : <MemberNode member={{ member_id: "", active_status: false } as TeamMember} isPlaceholder />
            }
          </div>

          {/* Right */}
          <div className="flex flex-col items-center">
            <div className="h-6 w-px bg-gray-300" />
            {rightChild
              ? renderTree(rightChild, depth + 1)
              : <MemberNode member={{ member_id: "", active_status: false } as TeamMember} isPlaceholder />
            }
          </div>
        </div>
      )}
    </div>
  );
};




  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-x-hidden">
            <DashboardHeader />
            <main className="flex-1 p-4 overflow-x-hidden">
              <Card>
                <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
                  <h1 className="text-xl font-bold">MLM Binary Tree Structure</h1>
                  <div className="flex items-center gap-4">
                    {treeData?.history.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGoBack(-1)}
                        className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600"
                      >
                        <ChevronUp className="w-4 h-4" />
                        Back
                      </Button>
                    )}
                    <select 
  value={3}
  disabled
  className="bg-gray-600 text-white rounded px-2 py-1 text-sm border-none cursor-not-allowed"
>
                      <option value={3}>3 Levels</option>
                      <option value={4}>4 Levels</option>
                      <option value={5}>5 Levels</option>
                      <option value={6}>6 Levels</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Breadcrumbs */}
                  {(breadcrumbs.length > 0 || treeData?.root) && (
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:bg-gray-100"
                        onClick={() => {
                          setCurrentLevels(3);
                          fetchTeamData();
                        }}
                      >
                        My Team
                      </Button>
                      
                      {breadcrumbs.map((id, index) => (
                        <div key={id} className="flex items-center">
                          <span className="mx-1 text-gray-400">/</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-800 hover:bg-gray-100"
                            onClick={() => handleGoBack(index)}
                          >
                            {id}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Search */}
                  <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search member ID..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button type="submit">Search</Button>
                  </form>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800" />
                    </div>
                  ) : treeData ? (
                    <div 
                      ref={treeContainerRef}
                      className="overflow-auto p-4 bg-white rounded-lg border"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      <div className="min-w-max mx-auto">
                        {renderTree(treeData.root)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No team data available
                    </div>
                  )}
                </div>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MLMBinaryTree;