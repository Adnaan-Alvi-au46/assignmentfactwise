import { useState, useMemo, useRef, useCallback } from 'react'
import { employees } from './data/employees'
import StatCard from './components/StatCard'
import EmployeeGrid from './components/EmployeeGrid'

const DEPARTMENTS = ['All', ...Array.from(new Set(employees.map(e => e.department))).sort()]

export default function App() {
  const [quickFilter, setQuickFilter] = useState('')
  const [activeDept, setActiveDept] = useState('All')
  const gridRef = useRef()

  const onExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv({ fileName: 'employees.csv' })
  }, [])

  const filtered = useMemo(() =>
    activeDept === 'All' ? employees : employees.filter(e => e.department === activeDept),
    [activeDept]
  )

  const totalPayroll = employees.reduce((s, e) => s + e.salary, 0)
  const avgRating = (employees.reduce((s, e) => s + e.performanceRating, 0) / employees.length).toFixed(1)
  const activeCount = employees.filter(e => e.isActive).length
  const totalProjects = employees.reduce((s, e) => s + e.projectsCompleted, 0)

  const deptColors = {
    Engineering: 'border-blue-500',
    Marketing: 'border-purple-500',
    Sales: 'border-orange-500',
    HR: 'border-pink-500',
    Finance: 'border-teal-500',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 sm:px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">FW</div>
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-none">FactWise</h1>
            <p className="text-xs text-slate-400 mt-0.5">Employee Dashboard</p>
          </div>
        </div>
        <span className="text-xs text-slate-400 hidden sm:block">{employees.length} employees · {DEPARTMENTS.length - 1} departments</span>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-screen-2xl mx-auto flex flex-col gap-5 sm:gap-6">

        {/* Stat Cards — 2 cols on mobile, 4 on md+ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Total Employees" value={employees.length} sub={`${activeCount} active`} color="border-blue-500" />
          <StatCard label="Total Payroll" value={`$${(totalPayroll / 1_000_000).toFixed(2)}M`} sub="annual" color="border-emerald-500" />
          <StatCard label="Avg Performance" value={avgRating} sub="out of 5.0" color="border-amber-500" />
          <StatCard label="Projects Completed" value={totalProjects} sub="across all teams" color="border-purple-500" />
        </div>

        {/* Toolbar */}
        {/* On mobile: dept pills wrap, search + export stack below */}
        {/* On desktop: everything on one line */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

          {/* Dept filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dept:</span>
            {DEPARTMENTS.map(dept => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  activeDept === dept
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {dept}
                {dept !== 'All' && (
                  <span className="ml-1 opacity-60">{employees.filter(e => e.department === dept).length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Search + Export — pushed right on desktop, full-width row on mobile */}
          <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm flex-1 sm:flex-none">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Quick search employees..."
                value={quickFilter}
                onChange={e => setQuickFilter(e.target.value)}
                className="text-sm outline-none text-slate-700 placeholder-slate-400 w-full sm:w-56 lg:w-72"
              />
              {quickFilter && (
                <button onClick={() => setQuickFilter('')} className="text-slate-400 hover:text-slate-600 text-xs flex-shrink-0">✕</button>
              )}
            </div>

            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0"
            >
              <span className="hidden sm:inline">↓</span> Export CSV
            </button>
          </div>
        </div>

        {/* Department summary bar */}
        {activeDept !== 'All' && (
          <div className={`bg-white rounded-xl border-l-4 ${deptColors[activeDept] || 'border-slate-400'} border border-slate-100 px-4 sm:px-5 py-3 grid grid-cols-2 sm:flex sm:gap-8 gap-y-2 text-sm shadow-sm`}>
            <div><span className="text-slate-400">Employees: </span><span className="font-semibold text-slate-700">{filtered.length}</span></div>
            <div><span className="text-slate-400">Avg Salary: </span><span className="font-semibold text-slate-700">${Math.round(filtered.reduce((s,e)=>s+e.salary,0)/filtered.length).toLocaleString()}</span></div>
            <div><span className="text-slate-400">Avg Rating: </span><span className="font-semibold text-slate-700">{(filtered.reduce((s,e)=>s+e.performanceRating,0)/filtered.length).toFixed(1)}</span></div>
            <div><span className="text-slate-400">Projects: </span><span className="font-semibold text-slate-700">{filtered.reduce((s,e)=>s+e.projectsCompleted,0)}</span></div>
          </div>
        )}

        {/* Grid — horizontally scrollable on mobile */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[640px]">
            <EmployeeGrid rowData={filtered} quickFilter={quickFilter} gridRef={gridRef} />
          </div>
        </div>

      </main>
    </div>
  )
}
