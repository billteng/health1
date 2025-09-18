import React from 'react'
import usePatients from './hooks/usePatients'
import { Patient } from './types'
import PatientForm from './components/PatientForm'
import PatientTable from './components/PatientTable'
import Sidebar from './components/Sidebar'

export default function App(){
  const { filtered, query, setQuery, create, update, remove } = usePatients()
  const [editing, setEditing] = React.useState<Patient | null>(null)
  const [showNew, setShowNew] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<number[]>([])
  const searchRef = React.useRef<HTMLInputElement | null>(null)

  // selection helper used by PatientTable checkboxes
  const handleSelectionChange = (ids: number[]) => {
    setSelectedIds(ids)
  }

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert('Please select one or more patients to delete (use the checkboxes).')
      return
    }
    const ok = confirm(`Delete ${selectedIds.length} patient(s)? This action cannot be undone.`)
    if (!ok) return
    try {
      // delete sequentially to avoid exhausting DB connections; can run in parallel if preferred
      for (const id of selectedIds) {
        await remove(id)
      }
      setSelectedIds([])
    } catch (err) {
      console.error('delete failed', err)
      alert('Failed to delete selected patients.')
    }
  }

  return (
    <div className="app">
      <Sidebar
        onNew={()=>setShowNew(true)}
        onSearchMode={()=>{ searchRef.current?.focus() }}
        onEditMode={()=>setEditMode(m=>!m)}
        onDelete={handleDelete}
        editMode={editMode}
      />
      <main className="content">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h1>Patient Dashboard</h1>
          <div className="controls">
            <input ref={searchRef} className="search" placeholder="Search patients" value={query} onChange={e=>setQuery(e.target.value)} />
          </div>
        </div>

        <div className="panel">
          <PatientTable
            patients={filtered}
            onEdit={(p: Patient)=>setEditing(p)}
            editMode={editMode}
            onRowClick={(p: Patient)=>{ if(editMode) setEditing(p) }}
            selectedIds={selectedIds}
            onSelectionChange={handleSelectionChange}
            onDeleteRow={async (id:number) => {
              const ok = confirm('Delete this patient?')
              if (!ok) return
              await remove(id)
              setSelectedIds(prev => prev.filter(x => x !== id))
            }}
          />
        </div>

        {showNew && (
          <div className="modal show">
            <div className="panel">
              <h3>New Patient</h3>
              <PatientForm onCreate={create} onCancel={()=>setShowNew(false)} />
            </div>
          </div>
        )}

        {editing && (
          <div className="modal show">
            <div className="panel">
              <h3>Edit Patient</h3>
              <PatientForm patient={editing} onCancel={()=>setEditing(null)} onUpdate={async (p)=>{ await update(p); setEditing(null)}} />
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
