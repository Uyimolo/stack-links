"use client";
import { useAuthStore } from "@/store/useAuthStore";
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Loading from "../global/Loading";
import { cn } from "@/lib/cn";

const DashboardLayoutComp = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  // Show loading state
  if (loading) {
    return <Loading />;
  }

  if (!user) return null;

  return (
    <div className="relative mx-auto md:flex h-full min-h-screen w-full max-w-[1700px]">
      <Sidebar />
      <div className={cn("w-full")}>
        <Header />
        {children}
        {/* <Loading /> */}
      </div>
    </div>
  );
};

export default DashboardLayoutComp;
