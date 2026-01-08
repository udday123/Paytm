"use server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createOnRampTransaction(amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return {
            message: "User not logged in"
        }
    }

    const token = (Math.random() * 1000).toString(); // Better token simulation

    await prisma.onRampTransaction.create({
        data: {
            userId: Number(session.user.id),
            amount: amount,
            status: "Processing",
            startTime: new Date(),
            provider,
            token: token
        }
    });

    return {
        message: "Transaction initiated",
        token: token // Returning token so we can simulate the bank webhook
    };
}