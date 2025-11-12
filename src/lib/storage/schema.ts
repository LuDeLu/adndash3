// Tipos y esquemas para el almacenamiento local

export interface UnitOwner {
  name: string
  email: string
  phone: string
  type: string
  assignedAt?: string
}

export interface UnitStatus {
  id: string
  status: "DISPONIBLE" | "bloqueado" | "reservado" | "VENDIDO"
  changedAt: string
  changedBy: string
  notes?: string
}

export interface ProjectStorageData {
  projectId: string
  owners: Record<string, UnitOwner>
  statuses: Record<string, UnitStatus>
  lastUpdated: string
}

export const PROJECTS = {
  BERUTI: "beruti",
  BOULEVARD: "boulevard",
  LAGOS: "lagos",
  RESI: "resi",
  SUITES: "suites",
  APART: "apart",
} as const
