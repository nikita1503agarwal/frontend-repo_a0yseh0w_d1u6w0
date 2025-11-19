import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus } from 'lucide-react'
import { apiGet, apiPost } from '../lib/api'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ first_name: '', last_name: '', basic_salary: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => { refresh() }, [])
  function refresh(){ apiGet('/employees').then(setEmployees).catch(()=>setEmployees([])) }

  async function addEmployee(e){
    e.preventDefault()
    setLoading(true)
    try {
      await apiPost('/employees', { ...form, basic_salary: parseFloat(form.basic_salary) || 0 })
      setForm({ first_name: '', last_name: '', basic_salary: 0 })
      setOpen(false)
      refresh()
    } catch(err){
      alert(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-600" />
          <div className="font-semibold text-slate-800">Employees</div>
        </div>
        <button onClick={()=>setOpen(true)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>
      <div className="p-4">
        {employees.length === 0 ? (
          <div className="text-slate-500 text-sm">No employees yet. Add one to get started.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map(emp => (
              <motion.div key={emp._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg border bg-white">
                <div className="font-semibold text-slate-800">{emp.first_name} {emp.last_name}</div>
                <div className="text-sm text-slate-500">Basic: KES {Number(emp.basic_salary||0).toLocaleString()}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4" onClick={()=>setOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e=>e.stopPropagation()}>
            <div className="p-4 border-b font-semibold">Add Employee</div>
            <form onSubmit={addEmployee} className="p-4 space-y-3">
              <div>
                <label className="block text-sm text-slate-600">First name</label>
                <input value={form.first_name} onChange={e=>setForm(f=>({...f, first_name:e.target.value}))} className="w-full border rounded-md px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm text-slate-600">Last name</label>
                <input value={form.last_name} onChange={e=>setForm(f=>({...f, last_name:e.target.value}))} className="w-full border rounded-md px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm text-slate-600">Basic salary (monthly)</label>
                <input type="number" step="0.01" value={form.basic_salary} onChange={e=>setForm(f=>({...f, basic_salary:e.target.value}))} className="w-full border rounded-md px-3 py-2" required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={()=>setOpen(false)} className="px-3 py-1.5 rounded-md border">Cancel</button>
                <button disabled={loading} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white">{loading? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
