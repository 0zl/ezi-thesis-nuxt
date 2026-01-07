"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Activity, History, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 w-64 border-r bg-white dark:bg-stone-950 min-h-screen hidden lg:block", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6 px-4">
            <div className="p-1.5 bg-teal-600 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-teal-950 dark:text-teal-50">
              Posyandu
            </h2>
          </div>
          
          <div className="space-y-1">
            <Link 
                href="/dashboard"
                className={cn(buttonVariants({ variant: pathname === "/dashboard" ? "secondary" : "ghost" }), "w-full justify-start")}
            >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
            </Link>
            <Link
                href="/dashboard/balita"
                className={cn(buttonVariants({ variant: pathname === "/dashboard/balita" ? "secondary" : "ghost" }), "w-full justify-start")}
            >
                <History className="mr-2 h-4 w-4" />
                Data Balita
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
