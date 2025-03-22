"use client";
import { SidebarDemo } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SidebarDemo />

      {/* Main Content */}
      <div className="flex flex-col flex-grow h-screen">
        <AppNavbar />
        <main className="flex-grow overflow-auto p-6 flex justify-center">
          <div className="w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
