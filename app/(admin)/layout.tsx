"use client";
import { SidebarDemo } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SidebarDemo />

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <AppNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
