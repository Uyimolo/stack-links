import { Sidebar } from "lucide-react";
import React, { ReactNode } from "react";
import Header from "./Header";

const DashboardSidebarHeader = ({ children }: { children: ReactNode }) => {
  return (
    <main className="">
      <Sidebar />
      <div className="">
        <Header />
        {children}
      </div>
    </main>
  );
};

export default DashboardSidebarHeader;
