'use client'
import { useAppState } from '@/store/useAppStateStore'
import { MenuIcon, X } from 'lucide-react'
import React from 'react'

const SidebarMenuBtn = () => {

      const { toggleSidebar, showSidebar } = useAppState()

  return (
    <button className="lg:hidden" onClick={toggleSidebar}>
      {showSidebar ? (
        <X className="text-text-secondary" />
      ) : (
        <MenuIcon className="text-text-secondary" />
      )}
    </button>
  )
}

export default SidebarMenuBtn
