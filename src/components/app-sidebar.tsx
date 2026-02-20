"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Package,
  Briefcase,
  Wrench,
  Megaphone,
  ChevronUp,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainNav = [
  {
    title: "Main Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

const costNav = [
  {
    title: "Operating Costs",
    href: "/operating-costs",
    icon: Receipt,
  },
  {
    title: "Direct Costs",
    href: "/direct-costs",
    icon: Package,
  },
  {
    title: "Collateral Costs",
    href: "/collateral-costs",
    icon: Briefcase,
  },
  {
    title: "Production Services",
    href: "/production-services",
    icon: Wrench,
  },
  {
    title: "Marketing Costs",
    href: "/marketing-costs",
    icon: Megaphone,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      {/* ── Header / Logo ── */}
      <SidebarHeader className="px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold leading-tight">
              FinPlanner
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              Pro Plan
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent>
        {/* Main group */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Costs & Expenses group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Costs &amp; Expenses
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {costNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer / User ── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-12">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
                AM
              </div>
              <div className="flex flex-1 flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium leading-tight">
                  Alex Morgan
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  CFO
                </span>
              </div>
              <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
