"use client";
import React, { useState } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { SidebarBody, SidebarLink, Sidebar } from "../third-party/Sidebar";
import {
  Activity,
  Grid2X2,
  LifeBuoy,
  ListTree,
  Package,
  SettingsIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

export function SidebarDemo() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home", href: "/", icon: <Activity className="h-5 w-5" /> },
    { label: "Items", href: "/items", icon: <ListTree className="h-5 w-5" /> },
    {
      label: "Categories",
      href: "/categories",
      icon: <Grid2X2 className="h-5 w-5" />,
    },
    {
      label: "Orders",
      href: "/orders",
      icon: <Package className="h-5 w-5" />,
    },
    {
      label: "Support",
      href: "/support",
      icon: <LifeBuoy className="h-5 w-5" />,
    },
    {
      label: "Banner Settings",
      href: "/banner",
      icon: <SettingsIcon className="h-5 w-5" />,
    },
    { label: "Logout", href: "#", icon: <IconArrowLeft className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen flex-col border-r border-gray-300 dark:border-gray-800">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => {
                const isActive = pathname === link.href;

                return (
                  <SidebarLink key={idx} link={link} isActive={isActive} />
                );
              })}
            </div>
          </div>
          {/* Profile Link */}
          <div className="p-4 border-t">
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="/next.svg"
                    className="h-7 w-7 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre dark:text-white"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </Link>
  );
};
