import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MemberNode {
  id: string;
  name: string;
  position: "left" | "right";
  status: "active" | "inactive";
  children?: MemberNode[];
}

const memberTree: MemberNode = {
  id: "admin",
  name: "Smart Money",
  position: "left",
  status: "active",
  children: [
    {
      id: "SMS8418942",
      name: "L1",
      position: "left",
      status: "inactive",
      children: [
        {
          id: "SMS6668943",
          name: "L1",
          position: "left",
          status: "inactive",
        },
        {
          id: "SMS6899901",
          name: "R1",
          position: "right",
          status: "inactive",
        },
      ],
    },
    {
      id: "SMS8881249",
      name: "MAIN R1",
      position: "right",
      status: "active",
      children: [
        {
          id: "SMS8211301",
          name: "SAKIRUL ISLAM",
          position: "right",
          status: "active",
        },
      ],
    },
  ],
};

// Avatar component with different images
const Avatar: React.FC<{ member: MemberNode; isRoot?: boolean }> = ({
  member,
  isRoot = false,
}) => {
  const isActive = member.status === "active";
  const isAdmin = member.id === "admin";

  // Different avatar styles based on member
  const getAvatarStyle = () => {
    if (isAdmin) {
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format";
    }

    const avatars = [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1494790108755-2616b332c505?w=150&h=150&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face&auto=format",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face&auto=format",
    ];

    // Use member ID to consistently assign same avatar
    const index =
      Math.abs(member.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) %
      avatars.length;
    return avatars[index];
  };

  return (
    <div
      className={`
      ${isRoot ? "w-24 h-24" : "w-20 h-20"}
      rounded-full overflow-hidden shadow-lg border-4 border-white
      ${
        isAdmin
          ? "ring-4 ring-green-200"
          : isActive
          ? "ring-4 ring-blue-200"
          : "ring-4 ring-red-200"
      }
      transition-all duration-300 hover:scale-105
    `}
    >
      <img
        src={getAvatarStyle()}
        alt={member.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to colored background with initials if image fails
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          target.nextElementSibling!.classList.remove("hidden");
        }}
      />
      <div
        className={`
        hidden w-full h-full flex items-center justify-center text-white font-bold text-lg
        ${isAdmin ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-red-500"}
      `}
      >
        {member.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()}
      </div>
    </div>
  );
};

const MemberCard: React.FC<{
  member: MemberNode;
  onToggle?: () => void;
  isCollapsed?: boolean;
  hasChildren?: boolean;
  isRoot?: boolean;
}> = ({ member, onToggle, isCollapsed, hasChildren, isRoot = false }) => {
  const isActive = member.status === "active";

  return (
    <div className="flex flex-col items-center relative">
      {/* Avatar */}
      <div className="mb-4">
        <Avatar member={member} isRoot={isRoot} />
      </div>

      {/* Member Info */}
      <div className="text-center mb-3">
        <h3
          className={`
          font-bold text-gray-800 leading-tight mb-1
          ${isRoot ? "text-xl" : "text-base"}
        `}
        >
          {member.name}
        </h3>
        <p
          className={`
          text-gray-600 font-medium
          ${isRoot ? "text-base" : "text-sm"}
        `}
        >
          {member.id}
        </p>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`
          px-4 py-2 rounded-full text-sm font-bold shadow-sm
          ${isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}
        `}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* NEW Badge */}
      {member.id === "SMS8211301" && (
        <div className="absolute -top-2 -right-4 z-20">
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 animate-pulse">
            NEW
          </div>
        </div>
      )}

      {/* Expand/Collapse Button */}
      {hasChildren && (
        <button
          onClick={onToggle}
          className="mt-2 p-2 bg-white border-2 border-blue-300 rounded-full shadow-md hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 z-10"
        >
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronUp className="w-5 h-5 text-blue-600" />
          )}
        </button>
      )}
    </div>
  );
};

const TreeView: React.FC = () => {
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    const newCollapsed = new Set(collapsedNodes);
    if (newCollapsed.has(nodeId)) {
      newCollapsed.delete(nodeId);
    } else {
      newCollapsed.add(nodeId);
    }
    setCollapsedNodes(newCollapsed);
  };

  const renderTree = (node: MemberNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedNodes.has(node.id);
    const isRoot = level === 0;

    return (
      <div className="flex flex-col items-center" key={node.id}>
        {/* Member Card */}
        <MemberCard
          member={node}
          onToggle={hasChildren ? () => toggleNode(node.id) : undefined}
          isCollapsed={isCollapsed}
          hasChildren={hasChildren}
          isRoot={isRoot}
        />

        {/* Children Section */}
        {hasChildren && !isCollapsed && (
          <div className="relative mt-8">
            {/* Vertical line down from parent */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 -top-8 rounded-full"></div>

            {/* Horizontal connector line */}
            {node.children!.length > 1 && (
              <div className="absolute top-0 left-0 right-0 flex justify-center">
                <div
                  className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-full"
                  style={{
                    width: `${(node.children!.length - 1) * 200 + 100}px`,
                  }}
                ></div>
              </div>
            )}

            {/* Children Container */}
            <div className="flex items-start justify-center space-x-32 pt-8">
              {node.children!.map((child, index) => (
                <div key={child.id} className="relative">
                  {/* Vertical line up from child to horizontal connector */}
                  {node.children!.length > 1 && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-t from-blue-600 to-blue-500 -top-8 rounded-full"></div>
                  )}
                  {renderTree(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const countMembers = (node: MemberNode): number => {
    let count = 1;
    if (node.children) {
      count += node.children.reduce(
        (sum, child) => sum + countMembers(child),
        0
      );
    }
    return count;
  };

  const countActiveMembers = (node: MemberNode): number => {
    let count = node.status === "active" ? 1 : 0;
    if (node.children) {
      count += node.children.reduce(
        (sum, child) => sum + countActiveMembers(child),
        0
      );
    }
    return count;
  };

  const totalMembers = countMembers(memberTree);
  const activeMembers = countActiveMembers(memberTree);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Organization Structure
        </h1>
        <div className="flex justify-center items-center space-x-8 text-sm">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">
              Active ({activeMembers})
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">
              Inactive ({totalMembers - activeMembers})
            </span>
          </div>
        </div>
      </div>

      {/* Tree Container */}
      <div className="flex justify-center">
        <div className="inline-block">{renderTree(memberTree)}</div>
      </div>
    </div>
  );
};

export default TreeView;
