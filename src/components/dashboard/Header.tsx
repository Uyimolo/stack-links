import { H1 } from "../global/Text"
import SidebarMenuBtn from "./SidebarMenuBtn"

const Header = () => {
  return (
    <header className="bg-white flex h-20 w-full items-center gap-4 px-4">
      <SidebarMenuBtn />
      <div className="flex h-full w-full items-center justify-between">
        <H1>Dashboard</H1>
      </div>
    </header>
  )
}

export default Header
