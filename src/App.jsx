import Topbar from './components/Topbar'
import Employees from './components/Employees'
import PayrollPreview from './components/PayrollPreview'
import { motion } from 'framer-motion'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Topbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1"><Employees /></div>
          <div className="lg:col-span-2"><PayrollPreview /></div>
        </motion.div>
      </main>
      <footer className="py-6 text-center text-slate-500 text-sm">Tailored for Kenya • Currency: KES • PAYE, NHIF, NSSF</footer>
    </div>
  )
}

export default App
