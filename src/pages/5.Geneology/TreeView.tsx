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

const API_BASE_URL = "http://localhost:5000";

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
    setCurrentLevels(4); // Show 4 levels when drilling down
    fetchTeamData(member.member_id, 4);
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

  const MemberNode = ({ member, isRoot = false }: { member: TeamMember; isRoot?: boolean }) => {
    const bgColor = isRoot ? "bg-purple-600" : member.position === "Left" ? "bg-blue-500" : "bg-green-500";
    const statusColor = member.active_status ? "bg-green-500" : "bg-red-500";
    const hasChildren = member.children && member.children.length > 0;

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex flex-col items-center">
            <div 
              className={`relative flex flex-col items-center cursor-pointer p-2 group ${hasChildren ? 'mb-4' : 'mb-1'}`}
              onClick={() => handleNodeClick(member)}
            >
              <div className={`w-3 h-3 rounded-full ${statusColor} absolute top-1 right-1`} />
              <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center transition-all group-hover:scale-110`}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-center mt-1">
                <div className="font-medium text-xs">{member.member_id}</div>
                <div className="text-xs text-gray-600 truncate w-20">{member.name}</div>
              </div>
            </div>
            
            {hasChildren && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-4 border-l border-gray-300 mx-auto"></div>
              </div>
            )}
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
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  member.active_status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {member.active_status ? 'Active' : 'Inactive'}
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
  // Only show left and right children (binary structure)
  const leftChild = node.children?.find(c => c.position === "Left");
  const rightChild = node.children?.find(c => c.position === "Right");

  return (
    <div className="flex flex-col items-center relative">
      <MemberNode member={node} isRoot={depth === 0} />
      
      {(leftChild || rightChild) && depth < currentLevels - 1 && (
        <div className="flex justify-center mt-6 relative">
          {/* Left branch */}
          {leftChild && (
            <div className="flex flex-col items-center mr-16">
              <div className="h-6 w-px bg-gray-300 absolute top-0 left-1/2 -translate-x-8"></div>
              <div className="relative">
                {renderTree(leftChild, depth + 1)}
              </div>
            </div>
          )}
          
          {/* Right branch */}
          {rightChild && (
            <div className="flex flex-col items-center ml-16">
              <div className="h-6 w-px bg-gray-300 absolute top-0 right-1/2 translate-x-8"></div>
              <div className="relative">
                {renderTree(rightChild, depth + 1)}
              </div>
            </div>
          )}
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
                      value={currentLevels}
                      onChange={(e) => {
                        setCurrentLevels(Number(e.target.value));
                        fetchTeamData(treeData?.root.member_id, Number(e.target.value));
                      }}
                      className="bg-gray-700 text-white rounded px-2 py-1 text-sm border-none focus:ring-1 focus:ring-gray-500"
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