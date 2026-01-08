import prisma from "@/lib/db";
import { AddMoney } from "@/components/AddMoneyCard";
import { BalanceCard } from "@/components/BalanceCard";
import { OnRampTransactions } from "@/components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getBalance() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return { amount: 0, locked: 0 };
    }

    const userId = Number(session.user.id);
    if (isNaN(userId)) {
        return { amount: 0, locked: 0 };
    }

    const balance = await prisma.balance.findFirst({
        where: { userId }
    });

    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) return [];

    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        },
        orderBy: {
            startTime: 'desc'
        },
        take: 5
    });

    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function () {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return <div className="w-full pr-8">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transfers
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
                <AddMoney userId={userId} />
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-300 text-sm">
                    <div className="font-bold mb-1">💡 Pro Tip</div>
                    You can add funds via HDFC, Axis, or SBI Net Banking. Funds are credited instantly in most cases.
                </div>
            </div>
            <div className="space-y-6">
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <OnRampTransactions transactions={transactions} />
            </div>
        </div>
    </div>
}