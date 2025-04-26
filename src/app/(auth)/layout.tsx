"use client";

import LayoutImage from "@/components/auth/AuthLayout";
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <LayoutImage>{children}</LayoutImage>;
}
