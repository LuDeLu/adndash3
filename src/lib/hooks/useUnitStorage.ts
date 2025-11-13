"use client"

import { useState, useCallback, useEffect } from "react"

interface UnitOwner {
  name: string
  email: string
  phone: string
  type: string
  assignedAt: string
}

interface UnitStatus {
  id: string
  status: "DISPONIBLE" | "RESERVADO" | "VENDIDO" | "BLOQUEADO"
  changedAt: string
  changedBy?: string
  notes?: string
}

export function useUnitStorage(projectName: string) {
  const [unitOwners, setUnitOwners] = useState<{ [key: string]: UnitOwner }>({})
  const [unitStatuses, setUnitStatuses] = useState<{ [key: string]: UnitStatus }>({})

  useEffect(() => {
    const savedOwners = localStorage.getItem(`${projectName}-owners`)
    const savedStatuses = localStorage.getItem(`${projectName}-statuses`)

    if (savedOwners) {
      try {
        setUnitOwners(JSON.parse(savedOwners))
      } catch (error) {
        console.error(" Error parsing saved owners:", error)
      }
    }

    if (savedStatuses) {
      try {
        setUnitStatuses(JSON.parse(savedStatuses))
      } catch (error) {
        console.error(" Error parsing saved statuses:", error)
      }
    }
  }, [projectName])

  const addOwner = useCallback(
    (unitId: string, owner: UnitOwner) => {
      setUnitOwners((prev) => {
        const updated = { ...prev, [unitId]: owner }
        localStorage.setItem(`${projectName}-owners`, JSON.stringify(updated))
        return updated
      })
    },
    [projectName],
  )

  const updateStatus = useCallback(
    (unitId: string, status: UnitStatus) => {
      setUnitStatuses((prev) => {
        const updated = { ...prev, [unitId]: status }
        localStorage.setItem(`${projectName}-statuses`, JSON.stringify(updated))
        return updated
      })
    },
    [projectName],
  )

  const getOwner = useCallback(
    (unitId: string) => {
      return unitOwners[unitId] || null
    },
    [unitOwners],
  )

  const getStatus = useCallback(
    (unitId: string) => {
      return unitStatuses[unitId] || null
    },
    [unitStatuses],
  )

  const clearData = useCallback(() => {
    localStorage.removeItem(`${projectName}-owners`)
    localStorage.removeItem(`${projectName}-statuses`)
    setUnitOwners({})
    setUnitStatuses({})
  }, [projectName])

  const exportData = useCallback(() => {
    const data = {
      project: projectName,
      owners: unitOwners,
      statuses: unitStatuses,
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }, [projectName, unitOwners, unitStatuses])

  return {
    unitOwners,
    unitStatuses,
    addOwner,
    updateStatus,
    getOwner,
    getStatus,
    clearData,
    exportData,
  }
}
