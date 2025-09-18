import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Patient } from '../types'
import * as api from '../api'

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return v
}

export default function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [query, setQuery] = useState('')
  const dq = useDebounced(query, 250)

  const load = useCallback(async () => {
    const data = await api.fetchPatients()
    setPatients(data)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    if (!dq) return patients
    const q = dq.toLowerCase()
    return patients.filter(p => [p.first_name, p.middle_name || '', p.last_name, p.address || ''].join(' ').toLowerCase().includes(q))
  }, [patients, dq])

  const create = useCallback(async (p: Omit<Patient,'id'|'created_at'>) => {
    const res = await api.createPatient(p)
    setPatients(prev => [res, ...prev])
    return res
  }, [])

  const update = useCallback(async (p: Patient) => {
    const res = await api.updatePatient(p)
    setPatients(prev => prev.map(x => x.id === res.id ? res : x))
    return res
  }, [])

  const remove = useCallback(async (id: number) => {
    await api.deletePatient(id)
    setPatients(prev => prev.filter(p => p.id !== id))
  }, [])

  return { patients, filtered, query, setQuery, load, create, update, remove }
}
