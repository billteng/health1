import axios from 'axios'
import type { Patient } from './types'

const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api'

const client = axios.create({ baseURL: API, timeout: 5000 })

export async function fetchPatients(): Promise<Patient[]> {
  const res = await client.get('/patients')
  return res.data as Patient[]
}

export async function createPatient(p: Omit<Patient, 'id'|'created_at'>): Promise<Patient> {
  const res = await client.post('/patients', p)
  return res.data as Patient
}

export async function updatePatient(p: Patient): Promise<Patient> {
  const res = await client.put(`/patients/${p.id}`, p)
  return res.data as Patient
}

export async function deletePatient(id: number): Promise<void> {
  await client.delete(`/patients/${id}`)
}
