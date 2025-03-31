import Image from "next/image"
import authLayoutImage from "@/assets/svgs/My-password-pana.svg"
import { ReactNode } from "react"

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="bg-color-bg-light grid w-full items-center lg:h-screen lg:grid-cols-2">
      <section className="bg-primary/30 hidden h-full w-screen items-center justify-center overflow-hidden lg:order-2 lg:grid lg:w-full 2xl:justify-start 2xl:px-40">
        <Image
          className="mx-auto aspect-square w-4/5 lg:w-[200%] lg:min-w-[500px] 2xl:mx-0"
          alt="lady with key"
          src={authLayoutImage}
        />
      </section>
      <section className="w-full justify-self-center p-6 py-20 2xl:px-40">
        {children}
      </section>
    </main>
  )
}

export default AuthLayout
