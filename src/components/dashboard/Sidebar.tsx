import React, { useEffect } from "react";
import Link from "next/link";
import {
  Link as LinkIcon,
  BarChart,
  Settings,
  Clock,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";
import { Logo, LogoSmall } from "../global/Logo";
import UserCard from "./UserCard";
import { useAppState } from "@/store/useAppStore";
import { cn } from "@/lib/cn";
import SidebarMenuBtn from "./SidebarMenuBtn";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { toggleSidebar, showSidebar, setShowSidebar } = useAppState();

  const dashboardLinks = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboardIcon,
    },

    {
      label: "My Collections",
      path: "/collections",
      icon: LinkIcon,
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: BarChart,
    },
    {
      label: "Archived",
      path: "/archived",
      icon: Clock,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
    {
      label: "Logout",
      path: "/logout",
      icon: LogOutIcon,
      onClick: () => toggleSidebar(),
    },
  ];

  const pathname = usePathname();

  const isActive = (path: string): boolean => pathname.includes(path);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initial = window.innerWidth >= 768;
      setShowSidebar(initial);
    }
  }, [setShowSidebar]);

  return (
    <>
      {/* overlay */}
      <div
        onClick={toggleSidebar}
        className={cn(
          "bg-grey/50 fixed top-0 z-10 h-screen w-screen transition duration-500 md:hidden",
          showSidebar ? "" : "-translate-x-full",
        )}
      ></div>

      {/* side bar */}
      <div
        className={cn(
          "border-grey-5 bg-grey-6 fixed top-0 left-0 z-10 min-h-screen w-[300px] -translate-x-[100%] space-y-4 overflow-hidden transition-all duration-300 md:sticky md:top-0 md:h-screen md:w-[250px] md:translate-x-0 md:border-r",
          showSidebar ? "translate-x-0" : "-translate-x-[100%] md:w-[80px]",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between py-4",
            showSidebar ? "px-4" : "flex-col gap-2 px-2",
          )}
        >
          <Link href="/dashboard">
            <div className="md:hidden">
              <Logo />
            </div>

            <div className="hidden md:block">
              {showSidebar ? <Logo /> : <LogoSmall />}
            </div>
          </Link>
          <SidebarMenuBtn />
        </div>

        <UserCard />

        <nav>
          <ul className="flex flex-col">
            {dashboardLinks.map((link, index) => (
              <>
                <li className="md:hidden" key={index} onClick={toggleSidebar}>
                  <Link
                    href={link.path}
                    className={cn(
                      "group flex h-12 items-center gap-2 border-r-4 border-transparent px-4 text-sm transition duration-300 ease-in-out",
                      isActive(link.path)
                        ? "bg-blue-2 border-primary"
                        : "hover:bg-grey-4 hover:border-primary/50",
                    )}
                  >
                    <link.icon className="text-text-secondary h-5 w-5" />

                    <span className={cn(showSidebar ? "" : "hidden")}>
                      {" "}
                      {link.label}
                    </span>
                  </Link>
                </li>
                <li
                  className="hidden md:block"
                  key={link.label}
                  // onClick={toggleSidebar}
                >
                  <Link
                    href={link.path}
                    className={cn(
                      "group flex h-12 items-center gap-2 border-r-4 border-transparent px-4 text-sm transition duration-300 ease-in-out",
                      isActive(link.path)
                        ? "bg-blue-2 border-primary"
                        : "hover:bg-grey-6 hover:border-primary/50",
                    )}
                  >
                    <link.icon className="text-text-secondary max-h-5 min-h-5 max-w-5 min-w-5" />

                    <span
                      className={cn(
                        "overflow-hidden",
                        showSidebar ? "w-full" : "w-0",
                      )}
                    >
                      {" "}
                      {link.label}
                    </span>
                  </Link>
                </li>
              </>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
