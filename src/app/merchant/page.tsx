"use client";

import { useBalance } from "@/hooks/useBalance";

export default function () {
    const balance = useBalance();
    return <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Merchant Dashboard</h1>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            hi there {balance}
        </div>
    </div>
}
