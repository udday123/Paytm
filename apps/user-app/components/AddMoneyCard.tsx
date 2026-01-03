"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/createOnramtxn";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

type SimulationStep = "IDLE" | "INITIATING" | "BANK_PAGE" | "WEBHOOK_SENDING" | "SUCCESS";

export const AddMoney = ({ userId }: { userId: string }) => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [amount, setAmount] = useState(0);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");

    // Simulation states
    const [step, setStep] = useState<SimulationStep>("IDLE");
    const [token, setToken] = useState("");

    const onAddMoney = async () => {
        setStep("INITIATING");
        try {
            const response = await createOnRampTransaction(amount * 100, provider);
            if (response.token) {
                setToken(response.token);
                // Artificial delay for "User friendliness"
                setTimeout(() => setStep("BANK_PAGE"), 1000);
            }
        } catch (e) {
            setStep("IDLE");
            alert("Failed to initiate transaction");
        }
    };

    const simulateBankApproval = async () => {
        setStep("WEBHOOK_SENDING");

        // Simulating the bank-to-server call using our internal API route
        try {
            const response = await fetch("/api/webhook/hdfc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: token,
                    user_identifier: userId,
                    amount: amount.toString()
                })
            });

            if (response.ok) {
                setTimeout(() => {
                    setStep("SUCCESS");
                }, 1500);
            } else {
                alert("Webhook simulation failed. Is the webhook server running on port 3003?");
                setStep("BANK_PAGE");
            }
        } catch (e) {
            alert("Network error. Make sure the bank-webhook server is running on localhost:3003 and has CORS enabled.");
            setStep("BANK_PAGE");
        }
    };

    if (step === "IDLE") {
        return <Card title="Add Money">
            <div className="w-full">
                <TextInput label={"Amount"} placeholder={"Amount"} onChange={(value) => {
                    setAmount(Number(value))
                }} />
                <div className="py-4 text-left font-medium text-slate-300">
                    Select Bank
                </div>
                <Select onSelect={(value) => {
                    setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
                    setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "")
                }} options={SUPPORTED_BANKS.map(x => ({
                    key: x.name,
                    value: x.name
                }))} />
                <div className="flex justify-center pt-6">
                    <Button onClick={onAddMoney}>
                        Add Money
                    </Button>
                </div>
            </div>
        </Card>
    }

    return <Card title="Payment Simulation">
        <div className="w-full py-4">
            <div className="relative">
                {/* Stepper Visualization */}
                <div className="flex flex-col gap-6">
                    <StepItem
                        title="1. Initiate Transaction"
                        status={step === "INITIATING" ? "active" : "done"}
                        description="Creating processing record in DB..."
                    />
                    <StepItem
                        title={`2. ${provider} Approval`}
                        status={step === "BANK_PAGE" ? "active" : (step === "INITIATING" ? "pending" : "done")}
                        description="User authenticates and approves on bank portal."
                    />
                    <StepItem
                        title="3. Webhook Callback"
                        status={step === "WEBHOOK_SENDING" ? "active" : (step === "SUCCESS" ? "done" : "pending")}
                        description="Bank sends secure JSON to our server."
                    />
                    <StepItem
                        title="4. Success"
                        status={step === "SUCCESS" ? "active" : "pending"}
                        description="Balance updated and status set to 'Success'."
                    />
                </div>

                {step === "BANK_PAGE" && (
                    <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                        <div className="text-sm text-indigo-300 mb-4">
                            You are now on the simulated <strong>{provider}</strong> secure page.
                        </div>
                        <Button onClick={simulateBankApproval}>
                            Approve Payment (Simulated)
                        </Button>
                    </div>
                )}

                {step === "WEBHOOK_SENDING" && (
                    <div className="mt-8 p-4 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-green-400 overflow-x-auto">
                        <div className="mb-2 text-slate-500">// Sending Webhook Request</div>
                        <div>POST /hdfcWebhook</div>
                        <div>Body: {JSON.stringify({ token, user_identifier: userId, amount: amount.toString() }, null, 2)}</div>
                        <div className="mt-2 animate-pulse">Waiting for response...</div>
                    </div>
                )}

                {step === "SUCCESS" && (
                    <div className="mt-8 text-center animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckIcon />
                        </div>
                        <div className="text-xl font-bold text-slate-100">Rs {amount} Added!</div>
                        <div className="text-sm text-slate-400 mb-6">Your balance has been updated successfully.</div>
                        <Button onClick={() => window.location.reload()}>
                            Close & Refresh
                        </Button>
                    </div>
                )}
            </div>
        </div>
    </Card>
}

function StepItem({ title, status, description }: { title: string, status: "pending" | "active" | "done", description: string }) {
    return <div className="flex gap-4 items-start">
        <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 ${status === "done" ? "bg-green-500 border-green-500 text-white" :
            status === "active" ? "border-indigo-500 text-indigo-500 animate-pulse" :
                "border-slate-700 text-slate-700"
            }`}>
            {status === "done" ? <CheckIcon small /> : <div className="w-2 h-2 rounded-full bg-current" />}
        </div>
        <div>
            <div className={`font-bold ${status === "pending" ? "text-slate-600" : "text-slate-200"}`}>{title}</div>
            <div className="text-xs text-slate-500">{description}</div>
        </div>
    </div>
}

function CheckIcon({ small }: { small?: boolean }) {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={small ? "w-4 h-4" : "w-8 h-8"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
}