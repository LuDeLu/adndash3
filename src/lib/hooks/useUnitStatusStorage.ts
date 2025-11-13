"use client"

import { useState, useEffect } from "react"

interface UnitStatus {
  id: string
  status: "DISPONIBLE" | "bloqueado" | "reservado" | "VENDIDO"
  changedAt: string
  changedBy: string
  notes?: string
}

export function useUnitStatusStorage(projectId: string) {
  const STORAGE_KEY = `dome-${projectId}-statuses`

  const [statuses, setStatusesState] = useState<{ [key: string]: UnitStatus }>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setStatusesState(JSON.parse(stored))
      } catch (error) {
        console.error(" Error al cargar estados:", error)
      }
    }
    setIsLoaded(true)
  }, [STORAGE_KEY])

  const updateStatus = (unitId: string, newStatus: UnitStatus["status"], changedBy: string, notes?: string) => {
    setStatusesState((prev) => {
      const newData = {
        ...prev,
        [unitId]: {
          id: unitId,
          status: newStatus,
          changedAt: new Date().toISOString(),
          changedBy,
          notes,
        },
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
      return newData
    })
  }

  const getStatus = (unitId: string): UnitStatus | null => statuses[unitId] || null

  const getAllStatuses = () => statuses

  return {
    statuses,
    updateStatus,
    getStatus,
    getAllStatuses,
    isLoaded,
  }
}
