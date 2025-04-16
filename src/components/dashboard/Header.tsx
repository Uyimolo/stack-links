import { Logo } from "../global/Logo"
import SidebarMenuBtn from "./SidebarMenuBtn"

const Header = () => {
  return (
    <header className="px-4 md:hidden">
      <div className="flex h-20 w-full items-center justify-between gap-4">
        <Logo />
        <SidebarMenuBtn />
      </div>

      <div className="border-grey-3 w-full border-b"></div>
    </header>
  )
}

export default Header
