// app/(dashboard)/layout.tsx or wherever your dashboard layout is
import React from "react";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar/>
      {children}
    </div>
  );
}
