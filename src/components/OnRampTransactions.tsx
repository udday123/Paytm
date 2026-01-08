import { Card } from "@/components/card";

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center py-12 text-slate-500 italic">
                No recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="space-y-4">
            {transactions.map((t, i) => <div key={i} className="flex justify-between items-center border-b border-slate-700/50 pb-3 last:border-0 last:pb-0">
                <div className="flex gap-4 items-center">
                    <div className="bg-slate-800 p-2 rounded-lg">
                        <BankIcon />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-200">
                            Added INR
                        </div>
                        <div className="text-slate-500 text-xs">
                            {t.time.toDateString()} • {t.provider}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-bold text-slate-100 italic">
                        + Rs {t.amount / 100}
                    </div>
                    <div className={`text-[10px] px-2 py-0.5 rounded-full inline-block ${t.status === 'Success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        t.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                            'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                        {t.status}
                    </div>
                </div>

            </div>)}
        </div>
    </Card>
}

function BankIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v14.25m16.5-14.25v14.25M5.25 5.25h13.5m-13.5 3h13.5m-13.5 3h13.5m-13.5 3h13.5m-13.5 3h13.5" />
    </svg>
}