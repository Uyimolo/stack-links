import Image from "next/image"
import authLayoutImage from "@/assets/svgs/My-password-pana.svg"
import { ReactNode } from "react"

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="bg-color-bg-light flex h-screen flex-col items-center justify-center lg:flex-row">
      <div className="">
        <Image alt="lady with key" src={authLayoutImage} />
        {children}
      </div>
    </main>
  )
}

export default AuthLayout
