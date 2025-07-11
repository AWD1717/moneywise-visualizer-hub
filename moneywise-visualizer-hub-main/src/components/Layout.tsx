
import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const Layout = () => {
  return (
    <>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 flex items-center border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 px-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <h1 className="ml-4 text-lg font-semibold">Finance Dashboard</h1>
        </header>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;
