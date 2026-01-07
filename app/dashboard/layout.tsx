import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Activity } from "lucide-react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-stone-50/50 dark:bg-stone-900/50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-white dark:bg-stone-950 px-4 flex items-center lg:hidden justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-teal-600" />
                    <span className="font-bold">Dashboard</span>
                </div>
                <MobileNav />
          </header>
          <main className="flex-1 p-8 pt-6">
              {children}
          </main>
      </div>
    </div>
  );
}
