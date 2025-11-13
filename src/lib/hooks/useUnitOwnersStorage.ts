"use client"

import { useState, useEffect } from "react"

interface UnitOwner {
  name: string
  email: string
  phone: string
  type: string
  assignedAt?: string
}

export function useUnitOwnersStorage(projectId: string) {
  const STORAGE_KEY = `dome-${projectId}-owners`

  const [unitOwners, setUnitOwnersState] = useState<{ [key: string]: UnitOwner }>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar datos al montar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUnitOwnersState(JSON.parse(stored))
      } catch (error) {
        console.error(" Error al cargar propietarios:", error)
      }
    }
    setIsLoaded(true)
  }, [STORAGE_KEY])

  // Guardar cambios en localStorage
  const setUnitOwners = (data: { [key: string]: UnitOwner } | ((prev: any) => any)) => {
    setUnitOwnersState((prev) => {
      const newData = typeof data === "function" ? data(prev) : data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
      return newData
    })
  }

  // Métodos útiles
  const addOwner = (unitNumber: string, owner: UnitOwner) => {
    setUnitOwners((prev) => ({
      ...prev,
      [unitNumber]: {
        ...owner,
        assignedAt: new Date().toISOString(),
      },
    }))
  }

  const removeOwner = (unitNumber: string) => {
    setUnitOwners((prev) => {
      const newData = { ...prev }
      delete newData[unitNumber]
      return newData
    })
  }

  const getOwner = (unitNumber: string) => unitOwners[unitNumber] || null

  const updateOwner = (unitNumber: string, updates: Partial<UnitOwner>) => {
    setUnitOwners((prev) => ({
      ...prev,
      [unitNumber]: {
        ...prev[unitNumber],
        ...updates,
      },
    }))
  }

  return {
    unitOwners,
    setUnitOwners,
    addOwner,
    removeOwner,
    getOwner,
    updateOwner,
    isLoaded,
  }
}
