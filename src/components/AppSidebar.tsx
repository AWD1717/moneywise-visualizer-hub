
import { 
  BarChart3, 
  TrendingUp, 
  Calculator, 
  CreditCard, 
  PiggyBank, 
  AlertTriangle, 
  Shield, 
  DollarSign,
  Settings 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Cashflows", url: "/cashflows", icon: TrendingUp },
  { title: "Budgets", url: "/budgets", icon: Calculator },
  { title: "Accounts", url: "/accounts", icon: CreditCard },
  { title: "Investments", url: "/investments", icon: PiggyBank },
  { title: "Debts", url: "/debts", icon: AlertTriangle },
  { title: "Emergency Funds", url: "/emergency-funds", icon: Shield },
  { title: "Net Worth", url: "/net-worth", icon: DollarSign },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
      active
        ? "bg-primary/10 text-primary border border-primary/20"
        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
    }`;
  };

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarContent className="p-4">
        <div className="mb-8">
          {open && (
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">FinanceApp</span>
            </div>
          )}
          {!open && (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-xs text-muted-foreground mb-2">MENU</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-4 h-4 shrink-0" />
                      {open && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
