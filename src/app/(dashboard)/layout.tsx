import DashboardLayoutComp from "@/components/dashboard/DashboardLayoutComp"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayoutComp>{children}</DashboardLayoutComp>
}
