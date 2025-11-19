import { Menu, Settings, Wallet, Banknote } from 'lucide-react'

export default function Topbar() {
  return (
    <div className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-md hover:bg-slate-100">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="font-semibold text-slate-800">PayKen HR</div>
          <span className="text-xs text-slate-500 border border-slate-200 rounded px-1.5 py-0.5">KES</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            <Wallet className="w-4 h-4" />
            Run Payroll
          </button>
          <button className="p-2 rounded-md hover:bg-slate-100">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
