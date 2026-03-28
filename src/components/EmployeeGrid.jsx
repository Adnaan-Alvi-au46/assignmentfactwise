import { useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

function StatusRenderer({ value }) {
  return value
    ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Active</span>
    : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Inactive</span>
}

function RatingRenderer({ value }) {
  const stars = Math.round(value)
  const color = value >= 4.5 ? 'text-emerald-500' : value >= 4.0 ? 'text-blue-500' : 'text-amber-500'
  return (
    <span className={`font-semibold ${color}`}>
      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      <span className="text-slate-500 font-normal text-xs ml-1">{value}</span>
    </span>
  )
}

function SalaryRenderer({ value }) {
  return <span className="font-medium text-slate-700">${value.toLocaleString()}</span>
}

function SkillsRenderer({ value }) {
  return (
    <div className="flex gap-1 flex-wrap py-1">
      {value.map(s => (
        <span key={s} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{s}</span>
      ))}
    </div>
  )
}

function DeptRenderer({ value }) {
  const colors = {
    Engineering: 'bg-blue-100 text-blue-700',
    Marketing: 'bg-purple-100 text-purple-700',
    Sales: 'bg-orange-100 text-orange-700',
    HR: 'bg-pink-100 text-pink-700',
    Finance: 'bg-teal-100 text-teal-700',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[value] || 'bg-slate-100 text-slate-600'}`}>
      {value}
    </span>
  )
}

function NameRenderer({ data }) {
  const initials = `${data.firstName[0]}${data.lastName[0]}`
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500']
  const color = colors[data.id % colors.length]
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full ${color} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
        {initials}
      </div>
      <div className="leading-tight min-w-0">
        <div className="font-medium text-slate-800 text-sm truncate">{data.firstName} {data.lastName}</div>
        <div className="text-xs text-slate-400 truncate">{data.email}</div>
      </div>
    </div>
  )
}

export default function EmployeeGrid({ rowData, quickFilter, gridRef }) {
  const columnDefs = useMemo(() => [
    {
      headerName: 'Employee',
      field: 'firstName',
      cellRenderer: NameRenderer,
      minWidth: 200,
      pinned: 'left',
      sortable: true,
      filter: false,
      menuTabs: [],
      valueGetter: p => `${p.data.firstName} ${p.data.lastName}`,
    },
    {
      headerName: 'Department',
      field: 'department',
      cellRenderer: DeptRenderer,
      width: 140,
      sortable: true,
      filter: false,
      menuTabs: [],
    },
    {
      headerName: 'Position',
      field: 'position',
      minWidth: 170,
      sortable: true,
      filter: false,
      menuTabs: [],
    },
    {
      headerName: 'Location',
      field: 'location',
      width: 130,
      sortable: true,
      filter: false,
      menuTabs: [],
    },
    {
      headerName: 'Salary',
      field: 'salary',
      cellRenderer: SalaryRenderer,
      width: 120,
      sortable: true,
      filter: false,
      menuTabs: [],
    },
    {
      headerName: 'Rating',
      field: 'performanceRating',
      cellRenderer: RatingRenderer,
      width: 170,
      sortable: true,
      filter: false,
      menuTabs: [],
    },
    {
      headerName: 'Projects',
      field: 'projectsCompleted',
      width: 105,
      sortable: true,
      filter: false,
      menuTabs: [],
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: 'Age',
      field: 'age',
      width: 85,
      sortable: true,
      filter: false,
      menuTabs: [],
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: 'Hire Date',
      field: 'hireDate',
      width: 120,
      sortable: true,
      filter: false,
      menuTabs: [],
    },
    {
      headerName: 'Skills',
      field: 'skills',
      cellRenderer: SkillsRenderer,
      minWidth: 230,
      sortable: false,
      filter: false,
      menuTabs: [],
      autoHeight: true,
    },
    {
      headerName: 'Manager',
      field: 'manager',
      width: 155,
      sortable: true,
      filter: false,
      menuTabs: [],
      valueFormatter: p => p.value || '—',
    },
    {
      headerName: 'Status',
      field: 'isActive',
      cellRenderer: StatusRenderer,
      width: 105,
      sortable: true,
      filter: false,
      menuTabs: [],
    },
  ], [])

  const defaultColDef = useMemo(() => ({
    resizable: true,
    suppressMovable: false,
    floatingFilter: false,
  }), [])

  return (
    /* Responsive wrapper: full width, height adapts on mobile */
    <div className="w-full overflow-hidden rounded-xl shadow-sm border border-slate-200">
      <div
        className="ag-theme-alpine"
        style={{ width: '100%', height: 'clamp(400px, 60vh, 580px)' }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilter}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20]}
          rowSelection="multiple"
          animateRows={true}
          suppressCellFocus={false}
        />
      </div>
    </div>
  )
}
