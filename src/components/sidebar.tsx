"use client";

import { useState } from "react";
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
import SidebarButton from "@/components/sidebar-button";
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileText, label: "Manage Blog" },
  { icon: Video, label: "Manage Videos" },
  { icon: Mic, label: "Manage Podcasts" },
  { icon: BookOpen, label: "Manage Publications" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activebar, setActivebar] = useState("dashboard");

  const handleActiveBar = (key: string) => {
    setActivebar(key);
  };

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
            {/* {menuItems.map((item) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-poppins font-medium transition-colors ${
                  item.active
                    ? "bg-white text-neutral-900"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))} */}
            <SidebarButton
              item={{ icon: LayoutDashboard, label: "Dashboard" }}
              onClick={handleActiveBar}
              active={activebar === "Dashboard"}
            />
            <SidebarButton
              item={{ icon: FileText, label: "Manage Blog" }}
              onClick={handleActiveBar}
              active={activebar === "Manage Blog"}
            />
            <SidebarButton
              item={{ icon: Video, label: "Manage Videos" }}
              onClick={handleActiveBar}
              active={activebar === "Manage Videos"}
            />
            <SidebarButton
              item={{ icon: Mic, label: "Manage Podcasts" }}
              onClick={handleActiveBar}
              active={activebar === "Manage Podcasts"}
            />
            <SidebarButton
              item={{ icon: BookOpen, label: "Manage Publications" }}
              onClick={handleActiveBar}
              active={activebar === "Manage Publications"}
            />

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
