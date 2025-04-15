"use client" // Error boundaries must be Client Components

import Fixing from "@/assets/svgs/Computer-troubleshooting-pana.svg"
import { Button } from "@/components/global/Button"
import { H1 } from "@/components/global/Text"
import Image from "next/image"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center px-4 py-10 text-center">
      <H1 className="text-destructive text-2xl font-semibold">
        Something went wrong
      </H1>

      <Image
        src={Fixing}
        alt="Fixing the page"
        className="mt-6 w-full max-w-sm"
        priority
      />

      <p className="text-text-muted mt-4">
        {error.name} <br />
        {error.message}
        {/* An unexpected error occurred. Please try again. */}
      </p>

      <Button onClick={reset} className="mt-6">
        Try again
      </Button>

      {/* <p className="text-muted-foreground mt-8 text-xs">
        Illustration by{" "}
        <a
          href="https://storyset.com/web"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Storyset
        </a>
      </p> */}
    </div>
  )
}
