"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { p2pTransfer } from "../app/lib/p2pTransfer";
import { useState } from "react";

export function P2PClient({ balance }: { balance: number }) {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });
    const [loading, setLoading] = useState(false);

    const handleTransfer = async () => {
        const transferAmount = Number(amount) * 100;

        if (!number || !amount) {
            setStatus({ type: 'error', message: "Please fill in all fields" });
            return;
        }

        if (transferAmount > balance) {
            setStatus({ type: 'error', message: `Insufficient funds. Your balance is Rs ${balance / 100}` });
            return;
        }

        setLoading(true);
        setStatus({ type: null, message: "" });

        try {
            const res = await p2pTransfer(number, transferAmount);
            if (res?.message) {
                setStatus({ type: 'error', message: res.message });
            } else {
                setStatus({ type: 'success', message: `Successfully sent Rs ${amount} to ${number}!` });
                setNumber("");
                setAmount("");
                // Refresh page after success to update balance
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (e) {
            setStatus({ type: 'error', message: "An unexpected error occurred" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center flex-col items-center">
            <div className="max-w-md w-full mb-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl flex justify-between items-center text-slate-300">
                    <div className="text-sm font-medium">Available Balance</div>
                    <div className="text-xl font-bold text-white">Rs {balance / 100}</div>
                </div>
            </div>

            <div className="max-w-md w-full">
                <Card title="Send Money">
                    <div className="space-y-4 py-4">
                        <TextInput
                            label={"Recipient Phone Number"}
                            placeholder={"Enter 10 digit number"}
                            onChange={(value) => setNumber(value)}
                        />

                        <TextInput
                            label={"Amount"}
                            placeholder={"Enter amount in Rs"}
                            onChange={(value) => setAmount(value)}
                        />

                        {status.type && (
                            <div className={`p-3 rounded-lg text-sm font-medium animate-in fade-in zoom-in duration-300 ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}>
                                {status.message}
                            </div>
                        )}

                        <div className="pt-4">
                            <Button onClick={handleTransfer}>
                                {loading ? 'Processing...' : 'Send Money'}
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className="mt-8 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                    <div className="flex gap-3">
                        <InfoIcon />
                        <div className="text-sm text-indigo-300">
                            <span className="font-bold">Note:</span> P2P transfers are instant. Ensure the phone number is correct as transactions cannot be reversed once approved.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.835a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
}
