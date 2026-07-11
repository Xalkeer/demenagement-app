"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Tableau de Bord", icon: "📊" },
    { href: "/calendar", label: "Calendrier", icon: "📅" },
    { href: "/lists", label: "Listes", icon: "📝" },
  ];

  return (
    <nav className="flex justify-center mb-8">
      <div className="bg-[#23201f] border border-orange-900/20 rounded-full p-1.5 flex gap-2 shadow-lg">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md shadow-orange-900/20"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
