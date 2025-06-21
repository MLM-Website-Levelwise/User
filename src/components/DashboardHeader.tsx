import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserImg from "./userimg.png";

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-gray-900">
            Prime Networks Inc Analytics
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {/* <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary text-white text-sm">
                SB
              </AvatarFallback>
            </Avatar> */}
            {/* <div className="flex justify-end items-center p-4">
              <UserImg />
            </div> */}
            {/* <div className="flex items-center space-x-2"> */}
            <img
              src="/userimg.png"
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />

            <div className="text-sm">
              <div className="font-semibold text-gray-900">SAMIMA BIBI</div>
              <div className="text-gray-500">PRN676277</div>
            </div>
            {/* <div className="w-2 h-2 bg-green-500 rounded-full"></div> */}
            {/* <span className="text-xs text-green-600">Online</span> */}
          </div>
        </div>
      </div>
    </header>
  );
}
