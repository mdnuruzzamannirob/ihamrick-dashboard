"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Video,
  Mic,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Manage Blog", href: "/manage-blog" },
  { icon: Video, label: "Manage Videos", href: "/manage-videos" },
  { icon: Mic, label: "Manage Podcasts", href: "/manage-podcasts" },
  {
    icon: BookOpen,
    label: "Manage Publications",
    href: "/manage-publications",
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-neutral-900 p-2 text-white lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-neutral-900 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          {/* Logo/Title */}
          <div className="mb-8 px-3 pt-4">
            <h1 className="text-lg font-poppins font-semibold text-neutral-400">
              Dashboard
            </h1>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 font-poppins py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white text-neutral-900"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}

            {/* Settings with Dropdown */}
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-poppins font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white">
              <Settings className="h-5 w-5" />
              Settings
              <ChevronDown className="ml-auto h-4 w-4" />
            </button>
          </nav>

          {/* Log Out */}
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-poppins font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white">
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>
    </div>
  );
}
