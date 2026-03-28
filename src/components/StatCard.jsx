export default function StatCard({ label, value, sub, color }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col gap-1 border-l-4 ${color}`}>
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-3xl font-bold text-slate-800">{value}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  )
}
