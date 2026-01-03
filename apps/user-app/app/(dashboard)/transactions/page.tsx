import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { Card } from "@repo/ui/card";

async function getTransactions() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    // Fetch On-ramp transactions
    const onRamp = await prisma.onRampTransaction.findMany({
        where: { userId: userId },
        orderBy: { startTime: 'desc' }
    });

    // Fetch P2P transfers (Sent and Received)
    const p2p = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        },
        orderBy: { timestamp: 'desc' }
    });

    const combined = [
        ...onRamp.map(t => ({
            id: `onramp-${t.id}`,
            amount: t.amount,
            time: t.startTime,
            type: 'Add Money',
            status: t.status,
            category: 'onramp',
            description: `Via ${t.provider}`
        })),
        ...p2p.map(t => ({
            id: `p2p-${t.id}`,
            amount: t.amount,
            time: t.timestamp,
            type: t.fromUserId === userId ? 'Sent' : 'Received',
            status: 'Success',
            category: 'p2p',
            description: t.fromUserId === userId ? 'P2P Transfer Sent' : 'P2P Transfer Received'
        }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime());

    return combined;
}

export default async function () {
    const transactions = await getTransactions();

    return <div className="w-full pr-8">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transactions
        </div>

        <div className="space-y-4">
            {transactions.length === 0 ? (
                <Card title="History">
                    <div className="text-center py-12 text-slate-500">
                        No transactions found in your history.
                    </div>
                </Card>
            ) : (
                transactions.map(t => (
                    <div key={t.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${t.type === 'Sent' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                {t.type === 'Sent' ? <ArrowUpRightIcon /> : <ArrowDownLeftIcon />}
                            </div>
                            <div>
                                <div className="font-bold text-slate-100">{t.type}</div>
                                <div className="text-sm text-slate-400">{t.description}</div>
                                <div className="text-xs text-slate-500 mt-1">{t.time.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-lg font-bold ${t.type === 'Sent' ? 'text-red-400' : 'text-green-400'}`}>
                                {t.type === 'Sent' ? '-' : '+'} Rs {t.amount / 100}
                            </div>
                            <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${t.status === 'Success' ? 'bg-green-500/10 text-green-500' :
                                    t.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-red-500/10 text-red-500'
                                }`}>
                                {t.status}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
}

function ArrowUpRightIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
}

function ArrowDownLeftIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25" />
    </svg>
}