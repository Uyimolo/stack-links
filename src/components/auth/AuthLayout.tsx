import Image from "next/image"
import authLayoutImage from "@/assets/svgs/My-password-pana.svg"
import { ReactNode } from "react"

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="bg-bg-light grid w-full items-center lg:h-screen lg:grid-cols-2">
      <section className="bg-primary/30 h-full w-screen items-center justify-center overflow-hidden lg:order-2 lg:grid lg:w-full 2xl:justify-start 2xl:px-40">
        <Image
          className="lg:w-4/ mx-auto aspect-square h-[40vh] w-full lg:h-auto lg:w-[200%] lg:min-w-[500px] 2xl:mx-0"
          alt="lady with key"
          src={authLayoutImage}
        />
      </section>
      <section className="w-full justify-self-center p-6 2xl:px-40">
        {children}
      </section>
    </main>
  )
}

export default AuthLayout
