"use client"
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({ href, title, icon }: { href: string; title: string; icon: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname()
    const selected = pathname === href

    return <div
        className={`flex items-center gap-3 cursor-pointer p-4 px-6 mx-2 my-1 rounded-xl transition-all duration-300 relative group
            ${selected ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}
        onClick={() => {
            router.push(href);
        }}
    >
        {selected && (
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
        )}

        <div className={`transition-transform duration-300 ${selected ? "scale-110" : "group-hover:translate-x-1"}`}>
            {icon}
        </div>
        <div className={`font-semibold transition-all duration-300 ${selected ? "tracking-wide" : "group-hover:translate-x-1"}`}>
            {title}
        </div>
    </div>
}