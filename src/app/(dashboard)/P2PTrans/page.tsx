import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { P2PClient } from "@/components/P2PClient";

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

export default async function () {
    const balance = await getBalance();

    return <div className="w-full pr-8">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            P2P Transfers
        </div>
        <P2PClient balance={balance.amount} />
    </div>
}