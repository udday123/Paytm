import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const paymentInformation: {
            token: string;
            userId: string;
            amount: string
        } = {
            token: body.token,
            userId: body.user_identifier,
            amount: body.amount
        };

        if (!paymentInformation.token || !paymentInformation.userId || !paymentInformation.amount) {
            return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
        }

        const existingTxn = await db.onRampTransaction.findUnique({
            where: { token: paymentInformation.token }
        });

        if (!existingTxn) {
            return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
        }

        if (existingTxn.status === "Success") {
            return NextResponse.json({ message: "Transaction already processed" });
        }

        await db.$transaction([
            db.balance.update({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount) * 100
                    }
                }
            }),
            db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ]);

        return NextResponse.json({
            message: "Captured successfully"
        });
    } catch (e) {
        console.error("Webhook error:", e);
        return NextResponse.json({
            message: "Error while processing webhook"
        }, { status: 500 });
    }
}
