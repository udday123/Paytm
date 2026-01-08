import express from "express";
import db from "@repo/db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for simulation calls from frontend

app.post("/hdfcWebhook", async (req, res) => {
    console.log("Webhook received:", req.body);

    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    if (!paymentInformation.token || !paymentInformation.userId || !paymentInformation.amount) {
        return res.status(400).json({ message: "Invalid payload" });
    }

    try {
        const existingTxn = await db.onRampTransaction.findUnique({
            where: { token: paymentInformation.token }
        });

        if (!existingTxn) {
            console.log("Transaction not found for token:", paymentInformation.token);
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (existingTxn.status === "Success") {
            return res.json({ message: "Transaction already processed" });
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

        console.log("Transaction processed successfully for user:", paymentInformation.userId);
        res.json({
            message: "Captured successfully"
        });
    } catch (e) {
        console.error("Webhook error:", e);
        res.status(500).json({
            message: "Error while processing webhook"
        });
    }
});

export default app;

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () => {
        console.log(`Bank webhook server running on port ${PORT}`);
    });
}
