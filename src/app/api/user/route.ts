import { NextResponse } from "next/server"
import prisma from "@/lib/db";

export const GET = async () => {
    // This was the original logic in merchant-app
    try {
        await prisma.user.create({
            data: {
                email: "merchant@example.com",
                name: "Merchant User",
                number: "9999999999",
                password: "password"
            }
        })
    } catch (e) {
        // user might already exist
    }

    return NextResponse.json({
        message: "Merchant user initialized"
    })
}