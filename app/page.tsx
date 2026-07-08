import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Decorative Grid Overlay (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold text-lg tracking-tighter">
            R
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block">RUBENIUS</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase -mt-1 block">Display Suite</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">System Online</span>
        </div>
      </header>

      {/* Hero Section & Navigation Grid */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 py-12 md:py-24 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl text-left md:text-center md:mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
            Welcome to <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">Rubenius</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            A real-time digital media broadcast and display controller network. Choose a module below to get started.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full mt-12 md:mt-16">
          {/* Card 1: Control Center */}
          <Link
            href="/control-center"
            className="group relative flex flex-col justify-between p-6 sm:p-8 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/[0.02] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="5" y="2" width="14" height="20" rx="3" />
                  <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h6M9 10h6M12 14h.01" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mt-6 text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors duration-300">
                Control Center
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Activate experiences, manage video playback, trigger slide transitions, and control display device power states in real-time.
              </p>
            </div>
            <div className="relative z-10 mt-8 flex items-center text-sm font-bold text-emerald-500 gap-1 group-hover:translate-x-1 transition-transform duration-300">
              Launch Controller 
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Card 2: CMS Admin */}
          <Link
            href="/admin"
            className="group relative flex flex-col justify-between p-6 sm:p-8 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 hover:-translate-y-1 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/[0.02] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mt-6 text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors duration-300">
                Media CMS Admin
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload new videos and image assets, monitor physical display device connections, track server analytics, and manage S3 storage usage.
              </p>
            </div>
            <div className="relative z-10 mt-8 flex items-center text-sm font-bold text-indigo-500 gap-1 group-hover:translate-x-1 transition-transform duration-300">
              Manage Content
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Card 3: Live Display */}
          <Link
            href="/preview"
            className="group relative flex flex-col justify-between p-6 sm:p-8 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm hover:shadow-xl hover:border-purple-500/30 dark:hover:border-purple-500/20 transition-all duration-300 hover:-translate-y-1 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/[0.02] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mt-6 text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors duration-300">
                Live Preview Screen
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Open the live fullscreen receiver display screen. This page receives the commands and renders the selected media for public viewing.
              </p>
            </div>
            <div className="relative z-10 mt-8 flex items-center text-sm font-bold text-purple-500 gap-1 group-hover:translate-x-1 transition-transform duration-300">
              Launch Broadcast
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-400 dark:text-slate-600 font-medium">
        &copy; {new Date().getFullYear()} Rubenius Screen Controller Network. All rights reserved.
      </footer>
    </main>
  );
}

