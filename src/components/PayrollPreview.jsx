import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, Receipt, Banknote } from 'lucide-react'
import { apiGet, apiPost } from '../lib/api'

const periodOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
  { value: 'yearly', label: 'Yearly' },
]

export default function PayrollPreview() {
  const [employees, setEmployees] = useState([])
  const [selectedEmp, setSelectedEmp] = useState('')
  const [periodType, setPeriodType] = useState('monthly')
  const [start, setStart] = useState(() => new Date().toISOString().slice(0,10))
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0,10))
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet('/employees').then(setEmployees).catch(() => setEmployees([]))
  }, [])

  async function runPreview() {
    setError('')
    if (!selectedEmp) { setError('Select an employee'); return }
    setLoading(true)
    try {
      const data = await apiPost('/payroll/preview', {
        employee_id: selectedEmp,
        period_type: periodType,
        period_start: start,
        period_end: end,
      })
      setPreview(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-slate-600" />
          <div className="font-semibold text-slate-800">Payroll Preview</div>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <label className="block text-sm text-slate-600">Employee</label>
          <select value={selectedEmp} onChange={e=>setSelectedEmp(e.target.value)} className="w-full border rounded-md px-3 py-2">
            <option value="">Select employee</option>
            {employees.map(e => (
              <option key={e._id} value={e._id}>{e.first_name} {e.last_name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          <label className="block text-sm text-slate-600">Period</label>
          <select value={periodType} onChange={e=>setPeriodType(e.target.value)} className="w-full border rounded-md px-3 py-2">
            {periodOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600">Start</label>
            <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">End</label>
            <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </div>
        </div>
        <div className="md:col-span-3 flex gap-3">
          <button onClick={runPreview} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{loading ? 'Calculating…' : 'Preview Payslip'}</button>
          {error && <div className="text-red-600 text-sm self-center">{error}</div>}
        </div>
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25 }} className="p-4 bg-gradient-to-br from-slate-50 to-white border-t">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card label="Gross Pay" value={`KES ${preview.gross_pay.toLocaleString()}`} icon={Banknote} />
              <Card label="PAYE" value={`KES ${preview.paye.toLocaleString()}`} />
              <Card label="NHIF" value={`KES ${preview.nhif.toLocaleString()}`} />
              <Card label="NSSF" value={`KES ${preview.nssf.toLocaleString()}`} />
            </div>
            <div className="mt-4 p-4 rounded-lg border bg-white">
              <div className="font-semibold text-slate-700 mb-2">Breakdown</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Basic Salary</div>
                  <div className="font-medium">KES {preview.basic_salary.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-500">Other Deductions</div>
                  <div className="font-medium">KES {Object.values(preview.other_deductions||{}).reduce((a,b)=>a+b,0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-500">Allowances</div>
                  <div className="font-medium">KES {Object.values(preview.allowances||{}).reduce((a,b)=>a+b,0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-500">Loan Deduction</div>
                  <div className="font-medium">KES {preview.loan_deduction.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-4 border-t pt-3 flex items-center justify-between">
                <div className="text-slate-600">Total Deductions</div>
                <div className="font-semibold">KES {preview.total_deductions.toLocaleString()}</div>
              </div>
              <div className="mt-2 text-lg font-bold text-emerald-700">Net Pay: KES {preview.net_pay.toLocaleString()}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Card({ label, value, icon: Icon }) {
  return (
    <div className="p-4 rounded-lg border bg-white">
      <div className="text-slate-500 text-sm">{label}</div>
      <div className="text-lg font-bold text-slate-800 flex items-center gap-2">{Icon && <Icon className="w-4 h-4 text-slate-400" />} {value}</div>
    </div>
  )
}
