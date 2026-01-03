import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { Card } from "@repo/ui/card";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getStats() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    const sentTransfers = await prisma.p2pTransfer.aggregate({
        where: { fromUserId: userId },
        _sum: { amount: true }
    });

    const receivedTransfers = await prisma.p2pTransfer.aggregate({
        where: { toUserId: userId },
        _sum: { amount: true }
    });

    const onRampSum = await prisma.onRampTransaction.aggregate({
        where: { userId: userId, status: "Success" },
        _sum: { amount: true }
    });

    return {
        totalSent: sentTransfers._sum.amount || 0,
        totalReceived: receivedTransfers._sum.amount || 0,
        totalOnRamp: onRampSum._sum.amount || 0
    }
}

async function getRecentTransactions() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    const p2p = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        },
        orderBy: { timestamp: 'desc' },
        take: 5
    });

    return p2p.map(t => ({
        id: t.id,
        amount: t.amount,
        time: t.timestamp,
        type: t.fromUserId === userId ? 'Sent' : 'Received',
        label: t.fromUserId === userId ? 'P2P Sent' : 'P2P Received'
    }));
}

export default async function () {
    const balance = await getBalance();
    const stats = await getStats();
    const recentTransactions = await getRecentTransactions();

    return <div className="w-full pr-8">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Dashboard
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg">
                <div className="text-indigo-100 text-sm font-medium mb-1">Total Balance</div>
                <div className="text-3xl font-bold">Rs {(balance.amount + balance.locked) / 100}</div>
                <div className="mt-4 text-xs text-indigo-200">Includes Rs {balance.locked / 100} locked</div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-sm font-medium mb-1">Total Sent</div>
                <div className="text-3xl font-bold text-red-400">Rs {stats.totalSent / 100}</div>
                <div className="mt-4 text-xs text-slate-500">P2P Transfers sent</div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-sm font-medium mb-1">Total Received</div>
                <div className="text-3xl font-bold text-green-400">Rs {(stats.totalReceived + stats.totalOnRamp) / 100}</div>
                <div className="mt-4 text-xs text-slate-500">Includes P2P + On-Ramp</div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
            </div>
            <div>
                <Card title="Quick Activity">
                    <div className="space-y-4">
                        {recentTransactions.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 italic">
                                No recent activity found
                            </div>
                        ) : (
                            recentTransactions.map(t => (
                                <div key={t.id} className="flex justify-between items-center p-3 hover:bg-slate-700/50 rounded-lg transition-colors">
                                    <div className="flex gap-4 items-center">
                                        <div className={`p-2 rounded-full ${t.type === 'Sent' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                            {t.type === 'Sent' ? <ArrowUpRightIcon /> : <ArrowDownLeftIcon />}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-200">{t.label}</div>
                                            <div className="text-xs text-slate-500">{t.time.toDateString()}</div>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${t.type === 'Sent' ? 'text-red-400' : 'text-green-400'}`}>
                                        {t.type === 'Sent' ? '-' : '+'} Rs {t.amount / 100}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    </div>
}

function ArrowUpRightIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
}

function ArrowDownLeftIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25" />
    </svg>
}