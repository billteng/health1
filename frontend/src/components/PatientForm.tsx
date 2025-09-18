import React from 'react'
import { Patient } from '../types'

type Props = {
  patient?: Patient
  onCreate?: (p: Omit<Patient, 'id'>) => Promise<void>
  onUpdate?: (p: Patient) => Promise<void>
  onCancel?: () => void
}

function formatDateForInput(value?: string) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toISOString().slice(0, 10)
}

export default function PatientForm({ patient, onCreate, onUpdate, onCancel }: Props) {
  const [first_name, setFirstName] = React.useState('')
  const [middle_name, setMiddleName] = React.useState('')
  const [last_name, setLastName] = React.useState('')
  const [date_of_birth, setDateOfBirth] = React.useState('') // YYYY-MM-DD for <input type="date">
  const [status, setStatus] = React.useState('Inquiry')
  const [address, setAddress] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  // populate form when editing a patient
  React.useEffect(() => {
    if (patient) {
      setFirstName(patient.first_name || '')
      setMiddleName(patient.middle_name || '')
      setLastName(patient.last_name || '')
      setDateOfBirth(formatDateForInput(patient.date_of_birth))
      setStatus(patient.status || 'Inquiry')
      setAddress(patient.address || '')
    } else {
      // clear for new
      setFirstName('')
      setMiddleName('')
      setLastName('')
      setDateOfBirth('')
      setStatus('Inquiry')
      setAddress('')
    }
  }, [patient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      first_name: first_name.trim(),
      middle_name: middle_name.trim() || null,
      last_name: last_name.trim(),
      date_of_birth: date_of_birth || null, // keep null if empty
      status,
      address: address.trim(),
    }

    try {
      if (patient && onUpdate) {
        await onUpdate({ ...patient, ...payload } as Patient)
      } else if (onCreate) {
        await onCreate(payload as Omit<Patient, 'id'>)
      }
      if (onCancel) onCancel()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="patient-form" onSubmit={handleSubmit}>
      <div className="row">
        <label>First</label>
        <input value={first_name} onChange={e=>setFirstName(e.target.value)} required />
      </div>

      <div className="row">
        <label>Middle</label>
        <input value={middle_name ?? ''} onChange={e=>setMiddleName(e.target.value)} />
      </div>

      <div className="row">
        <label>Last</label>
        <input value={last_name} onChange={e=>setLastName(e.target.value)} required />
      </div>

      <div className="row">
        <label>DOB</label>
        <input type="date" value={date_of_birth} onChange={e=>setDateOfBirth(e.target.value)} />
      </div>

      <div className="row">
        <label>Status</label>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option>Inquiry</option>
          <option>Onboarding</option>
          <option>Active</option>
          <option>Churned</option>
        </select>
      </div>

      <div className="row">
        <label>Address</label>
        <textarea value={address} onChange={e=>setAddress(e.target.value)} />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn secondary" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : patient ? 'Update' : 'Create'}</button>
      </div>
    </form>
  )
}
