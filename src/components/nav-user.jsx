"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpenIcon,
  ChevronsUpDownIcon,
  HomeIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { signout } from "@/app/login/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Inline 3-way theme picker (System / Light / Dark) that lives inside the menu.
// next-themes is undefined on the server, so the selection only binds after
// mount to avoid a hydration mismatch.
function ThemeControl() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Mount guard so the active theme only binds client-side (see ThemeControl note).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const value = mounted && theme ? [theme] : [];

  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      spacing={0}
      value={value}
      onValueChange={(next) => next[0] && setTheme(next[0])}
      aria-label="Theme"
    >
      <ToggleGroupItem value="system" aria-label="Match system">
        <MonitorIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="light" aria-label="Light">
        <SunIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark">
        <MoonIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

// One label-left / icon-right row that navigates somewhere and closes the menu.
function LinkRow({ href, icon: Icon, children, external }) {
  const link = external ? (
    <a href={href} target="_blank" rel="noreferrer" />
  ) : (
    <Link href={href} />
  );
  return (
    <DropdownMenuItem render={link} className="gap-2 py-1.5">
      <span className="flex-1">{children}</span>
      <Icon className="text-muted-foreground" />
    </DropdownMenuItem>
  );
}

export function NavUser({ user }) {
  const { isMobile } = useSidebar();

  const email = user?.email ?? "";
  const fullName = user?.user_metadata?.full_name;
  const displayName = fullName || (email ? email.split("@")[0] : "Account");
  const initial = (fullName || email || "?")[0].toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg">{initial}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-64 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="start"
            sideOffset={4}
          >
            {/* account header */}
            <div className="flex items-start justify-between gap-2 px-1.5 py-1.5">
              <div className="grid min-w-0">
                <span className="truncate text-sm font-medium">
                  {displayName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {email}
                </span>
              </div>
              <Link
                href="/dashboard/settings"
                aria-label="Account settings"
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <SettingsIcon className="size-4" />
              </Link>
            </div>

            <DropdownMenuSeparator />

            {/* theme — interactive, does not close the menu */}
            <div className="flex items-center justify-between gap-2 px-1.5 py-1.5 text-sm">
              <span>Theme</span>
              <ThemeControl />
            </div>

            <LinkRow href="/" icon={HomeIcon}>
              Home Page
            </LinkRow>
            <LinkRow href="/docs" icon={BookOpenIcon}>
              Docs
            </LinkRow>

            <DropdownMenuItem
              className="gap-2 py-1.5"
              onClick={() =>
                signout().catch(() =>
                  toast.error("Couldn't sign out. Please try again."),
                )
              }
            >
              <span className="flex-1">Log out</span>
              <LogOutIcon className="text-muted-foreground" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
