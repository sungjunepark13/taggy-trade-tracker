
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  BarChart2,
  Tag,
  Calendar,
  Menu,
  Settings,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const AppSidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Add Trade',
      path: '/add-trade',
      icon: PlusCircle,
    },
    {
      title: 'Trade History',
      path: '/history',
      icon: BarChart2,
    },
    {
      title: 'Tags',
      path: '/tags',
      icon: Tag,
    },
    {
      title: 'Calendar',
      path: '/calendar',
      icon: Calendar,
    },
  ];

  const settingsItems = [
    {
      title: 'Edit Financial Plan',
      path: '/setup',
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">TaggyTrade</span>
        </div>
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                  >
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                  >
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
