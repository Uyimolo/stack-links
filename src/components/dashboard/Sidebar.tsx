import React from "react"
import Link from "next/link"
import {
  Link as LinkIcon,
  BarChart,
  Settings,
  Clock,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react"
import { Logo } from "../global/Logo"
import UserCard from "./UserCard"
import { useAppState } from "@/store/useAppStateStore"
import { cn } from "@/lib/cn"
import SidebarMenuBtn from "./SidebarMenuBtn"
import { usePathname } from "next/navigation"

const Sidebar = () => {
  const { toggleSidebar, showSidebar } = useAppState()

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
    // {
    //   label: "Trash",
    //   path: "/trash",
    //   icon: Trash2,
    // },
    // {
    //   label: "Team",
    //   path: "/team",
    //   icon: Users,
    // },
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
  ]

  const pathname = usePathname()
  // interface DashboardLink {
  //   label: string
  //   path: string
  //   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  //   onClick?: () => void
  // }

  const isActive = (path: string): boolean => pathname.includes(path)

  return (
    <>
      {/* overlay */}

      <div
        onClick={toggleSidebar}
        className={cn(
          "bg-grey/50 fixed top-0 z-10 h-screen w-screen transition duration-500 md:hidden",
          showSidebar ? "" : "-translate-x-full"
        )}
      ></div>

      <div
        className={cn(
          "border-grey-5 fixed top-0 left-0 z-10 min-h-screen w-[300px] -translate-x-[100%] md:absolute space-y-4 md:border-r bg-white transition-all duration-300 ease-in-out md:top-0 md:w-[250px] md:translate-x-0",
          showSidebar ? "translate-x-0" : "-translate-x-[100%] md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <SidebarMenuBtn mode="open" />
        </div>

        <UserCard />

        <nav>
          <ul className="flex flex-col">
            {dashboardLinks.map((link) => (
              <li key={link.label} onClick={toggleSidebar}>
                <Link
                  href={link.path}
                  className={cn(
                    "group flex h-12 items-center gap-2 border-r-4 border-transparent px-6 text-sm transition duration-300 ease-in-out",
                    isActive(link.path)
                      ? "bg-blue-2 border-primary"
                      : "hover:bg-grey-6 hover:border-primary/50"
                  )}
                >
                  <link.icon className="text-text-secondary h-5 w-5" />

                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
