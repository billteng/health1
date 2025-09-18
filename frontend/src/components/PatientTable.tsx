import React from 'react'
import { Patient } from '../types'

type Props = {
  patients: Patient[]
  onEdit: (p: Patient) => void
  editMode?: boolean
  onRowClick?: (p: Patient) => void
  selectedIds?: number[]
  onSelectionChange?: (ids: number[]) => void
  onDeleteRow?: (id: number) => Promise<void>
}

export default function PatientTable({
  patients,
  onEdit,
  editMode = false,
  onRowClick,
  selectedIds = [],
  onSelectionChange,
  onDeleteRow
}: Props) {
  const allVisibleSelected = patients.length > 0 && patients.every(p => selectedIds.includes(p.id))
  const toggleSelectAll = () => {
    if (!onSelectionChange) return
    if (allVisibleSelected) {
      // unselect all visible
      const remaining = selectedIds.filter(id => !patients.some(p => p.id === id))
      onSelectionChange(remaining)
    } else {
      // select all visible (merge with existing)
      const newIds = Array.from(new Set([...selectedIds, ...patients.map(p => p.id)]))
      onSelectionChange(newIds)
    }
  }

  const toggleRow = (id: number) => {
    if (!onSelectionChange) return
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(x => x !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  return (
    <table className="patient-table">
      <thead>
        <tr>
          <th style={{width:40}}>
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleSelectAll}
              aria-label="Select all visible patients"
            />
          </th>
          <th>Name</th>
          <th>DOB</th>
          <th>Status</th>
          <th>Address</th>
          <th style={{width:120}}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map(p => {
          const selected = selectedIds.includes(p.id)
          return (
            <tr
              key={p.id}
              style={editMode ? { cursor: 'pointer' } : undefined}
              onClick={() => { if (editMode && onRowClick) onRowClick(p) }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={e => { e.stopPropagation(); toggleRow(p.id) }}
                  aria-label={`Select ${p.first_name} ${p.last_name}`}
                />
              </td>
              <td>
                <div style={{fontWeight:600}}>{p.first_name} {p.middle_name ? `${p.middle_name} ` : ''}{p.last_name}</div>
              </td>
              <td>{p.date_of_birth}</td>
              <td>{p.status}</td>
              <td className="muted">{p.address}</td>
              <td>
                <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
                  <button className="btn secondary" onClick={(e)=>{ e.stopPropagation(); onEdit(p) }}>Edit</button>
                  {onDeleteRow && <button className="btn danger" onClick={async (e)=>{ e.stopPropagation(); await onDeleteRow(p.id) }}>Delete</button>}
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
