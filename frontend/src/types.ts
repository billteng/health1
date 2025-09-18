export type PatientStatus = 'Inquiry' | 'Onboarding' | 'Active' | 'Churned'

export interface Patient {
  id: number
  first_name: string
  middle_name?: string | null
  last_name: string
  date_of_birth?: string | null
  status: PatientStatus
  address?: string | null
  created_at?: string
}
