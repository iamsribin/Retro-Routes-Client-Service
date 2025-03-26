import React, { useState } from 'react';
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Car, Gift, PieChart, LogOut, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminLogout } from "../../services/redux/slices/adminAuthSlice";
import { useDispatch } from 'react-redux';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="p-2">
              <h2 className="text-xl font-bold text-emerald">Retro Routes</h2>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link to="/admin/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Users">
                  <Link to="/admin/users">
                    <Users />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Drivers">
                  <Link to="/admin/drivers">
                    <Car />
                    <span>Drivers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Offers">
                  <Link to="/admin/offers">
                    <Gift />
                    <span>Offers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Reports">
                  <Link to="/admin/reports">
                    <PieChart />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to Site">
                <Link to="/"
                 onClick={() => {
                  dispatch(adminLogout()); 
                  localStorage.removeItem("userToken"); 
                    }}>
                    <LogOut />
                    <span>Back to Site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="relative">
          <div className="sticky top-0 z-10 w-full bg-background p-4 border-b flex items-center justify-between md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">Admin User</span>
            </div>
          </div>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;