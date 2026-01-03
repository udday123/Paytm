import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'
import { authOptions } from "./lib/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] justify-center items-center bg-background text-white">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6">
        <div className="container mx-auto flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              The Future of Digital Payments
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl dark:text-gray-400">
              Fast, secure, and seamless transactions at your fingertips. Experience the next generation of wallet technology.
            </p>
          </div>
          <div className="space-x-4 pt-8">
            <a
              href="/api/auth/signin"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started
            </a>
            <a
              href="#"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-800 bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2 p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors">
              <h3 className="text-xl font-bold">Instant Transfers</h3>
              <p className="text-gray-400">Send money to anyone, anywhere, instantly. No delays, no hidden fees.</p>
            </div>
            <div className="space-y-2 p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors">
              <h3 className="text-xl font-bold">Bank Grade Security</h3>
              <p className="text-gray-400">Your data and funds are protected by industry-leading encryption and security protocols.</p>
            </div>
            <div className="space-y-2 p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors">
              <h3 className="text-xl font-bold">Global Reach</h3>
              <p className="text-gray-400">Transact in multiple currencies across borders without the hassle.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
