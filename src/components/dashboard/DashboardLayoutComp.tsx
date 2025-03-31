"use client"
import { useAuthStore } from "@/store/useAuthStore"
import React from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"

const DashboardLayoutComp = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore()
  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Just in case auth hasn't caught up yet
  if (!user) return null

  return (
    <div>
      <Sidebar />
      <div className="">
        <Header />
        {children}
      </div>
    </div>
  )
}

export default DashboardLayoutComp
