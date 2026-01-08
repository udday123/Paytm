import { Button } from "./button";

interface AppbarProps {
    user?: {
        name?: string | null;
    },
    onSignin: () => void,
    onSignout: () => void
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="flex justify-between border-b px-8 py-3 border-slate-800 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                P
            </div>
            <div className="text-2xl font-black tracking-tight text-white italic">
                Wallet
            </div>
        </div>
        <div className="flex gap-4 items-center">
            {user && (
                <div className="text-sm text-slate-400 mr-2 flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {user.name || "User"}
                </div>
            )}
            <Button onClick={user ? onSignout : onSignin}>
                {user ? "Logout" : "Login"}
            </Button>
        </div>
    </div>
}