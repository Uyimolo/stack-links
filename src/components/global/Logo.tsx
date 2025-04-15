import { SquareStackIcon } from "lucide-react"
import React from "react"

export const Logo = () => {
  return (
    <div className="flex gap-1">
      <SquareStackIcon className="text-primary" />
      <p className="text-secondary font-inter text-2xl font-bold">Stacklinks</p>
    </div>
  )
}

export const LogoSmall = () => {
  return (
    <div className="bg-primary aspect-square w-fit gap-1 rounded-lg p-2 font-semibold">
      <SquareStackIcon className="text-primary" />
    </div>
  )
}
