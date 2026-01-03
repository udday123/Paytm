"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            message: "You must be logged in to send money"
        }
    }

    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
        return {
            message: "Recipient user not found"
        }
    }

    if (Number(from) === toUser.id) {
        return {
            message: "You cannot send money to yourself"
        }
    }

    try {
        await prisma.$transaction(async (txn) => {
            // 1. Lock sender's balance
            await txn.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

            const fromBalance = await txn.balance.findFirst({
                where: { userId: Number(from) },
            });

            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error("Insufficient funds");
            }

            // 2. Ensure recipient has a balance record (to avoid foreign key/null errors)
            const toBalance = await txn.balance.findFirst({
                where: { userId: toUser.id }
            });

            if (!toBalance) {
                // If the user somehow doesn't have a balance record, create one
                await txn.balance.create({
                    data: {
                        userId: toUser.id,
                        amount: 0,
                        locked: 0
                    }
                });
            }

            // 3. Perform the transfer
            await txn.balance.update({
                where: { userId: Number(from) },
                data: { amount: { decrement: amount } },
            });

            await txn.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } },
            });

            // 4. Record the transaction
            await txn.p2pTransfer.create({
                data: {
                    fromUserId: Number(from),
                    toUserId: toUser.id,
                    amount,
                    timestamp: new Date()
                }
            });
        });

        return {
            success: true
        };
    } catch (e: any) {
        console.error("P2P Transfer Error:", e);
        return {
            message: e.message || "An error occurred during transfer"
        }
    }
}