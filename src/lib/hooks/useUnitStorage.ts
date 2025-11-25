"use client"

import { useState, useCallback, useEffect, useRef } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://adndashboard.squareweb.app/api"

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

interface ProjectData {
  project: string
  owners: { [key: string]: UnitOwner }
  statuses: { [key: string]: UnitStatus }
  updatedAt: string
  createdAt: string
}

export function useUnitStorage(projectName: string) {
  const [unitOwners, setUnitOwners] = useState<{ [key: string]: UnitOwner }>({})
  const [unitStatuses, setUnitStatuses] = useState<{ [key: string]: UnitStatus }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get auth token from localStorage
  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }, [])

  // Fetch data from backend
  const fetchProjectData = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      // Fallback to localStorage if not authenticated
      const savedOwners = localStorage.getItem(`${projectName}-owners`)
      const savedStatuses = localStorage.getItem(`${projectName}-statuses`)

      if (savedOwners) {
        try {
          setUnitOwners(JSON.parse(savedOwners))
        } catch (e) {
          console.error("Error parsing local owners:", e)
        }
      }

      if (savedStatuses) {
        try {
          setUnitStatuses(JSON.parse(savedStatuses))
        } catch (e) {
          console.error("Error parsing local statuses:", e)
        }
      }

      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/project-data/${projectName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setUnitOwners(result.data.owners || {})
          setUnitStatuses(result.data.statuses || {})
          setLastSync(new Date().toISOString())
          setError(null)

          // Also save to localStorage as backup
          localStorage.setItem(`${projectName}-owners`, JSON.stringify(result.data.owners || {}))
          localStorage.setItem(`${projectName}-statuses`, JSON.stringify(result.data.statuses || {}))
        }
      } else {
        // Fallback to localStorage on API error
        console.warn("API error, falling back to localStorage")
        const savedOwners = localStorage.getItem(`${projectName}-owners`)
        const savedStatuses = localStorage.getItem(`${projectName}-statuses`)

        if (savedOwners) setUnitOwners(JSON.parse(savedOwners))
        if (savedStatuses) setUnitStatuses(JSON.parse(savedStatuses))
      }
    } catch (err) {
      console.error("Error fetching project data:", err)
      setError("Error al cargar datos del proyecto")

      // Fallback to localStorage
      const savedOwners = localStorage.getItem(`${projectName}-owners`)
      const savedStatuses = localStorage.getItem(`${projectName}-statuses`)

      if (savedOwners) setUnitOwners(JSON.parse(savedOwners))
      if (savedStatuses) setUnitStatuses(JSON.parse(savedStatuses))
    } finally {
      setIsLoading(false)
    }
  }, [projectName, getAuthToken])

  // Initial load and auto-refresh setup
  useEffect(() => {
    fetchProjectData()

    // Auto-refresh every 30 seconds to keep data in sync across users
    syncIntervalRef.current = setInterval(() => {
      fetchProjectData()
    }, 30000)

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [fetchProjectData])

  // Add or update owner - syncs with backend
  const addOwner = useCallback(
    async (unitId: string, owner: UnitOwner) => {
      const token = getAuthToken()

      // Optimistic update
      setUnitOwners((prev) => {
        const updated = { ...prev, [unitId]: owner }
        localStorage.setItem(`${projectName}-owners`, JSON.stringify(updated))
        return updated
      })

      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/project-data/${projectName}/owner`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ unitId, owner }),
          })

          if (!response.ok) {
            console.error("Error syncing owner to backend")
          }
        } catch (err) {
          console.error("Error adding owner:", err)
        }
      }
    },
    [projectName, getAuthToken],
  )

  // Remove owner from a unit
  const removeOwner = useCallback(
    async (unitId: string) => {
      const token = getAuthToken()

      // Optimistic update
      setUnitOwners((prev) => {
        const updated = { ...prev }
        delete updated[unitId]
        localStorage.setItem(`${projectName}-owners`, JSON.stringify(updated))
        return updated
      })

      if (token) {
        try {
          await fetch(`${API_BASE_URL}/project-data/${projectName}/owner/${unitId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        } catch (err) {
          console.error("Error removing owner:", err)
        }
      }
    },
    [projectName, getAuthToken],
  )

  // Update unit status - syncs with backend
  const updateStatus = useCallback(
    async (unitId: string, status: UnitStatus) => {
      const token = getAuthToken()

      // Optimistic update
      setUnitStatuses((prev) => {
        const updated = { ...prev, [unitId]: status }
        localStorage.setItem(`${projectName}-statuses`, JSON.stringify(updated))
        return updated
      })

      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/project-data/${projectName}/status`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ unitId, status }),
          })

          if (!response.ok) {
            console.error("Error syncing status to backend")
          }
        } catch (err) {
          console.error("Error updating status:", err)
        }
      }
    },
    [projectName, getAuthToken],
  )

  // Get owner for a specific unit
  const getOwner = useCallback(
    (unitId: string) => {
      return unitOwners[unitId] || null
    },
    [unitOwners],
  )

  // Get status for a specific unit
  const getStatus = useCallback(
    (unitId: string) => {
      return unitStatuses[unitId] || null
    },
    [unitStatuses],
  )

  // Clear all data (local and backend)
  const clearData = useCallback(async () => {
    const token = getAuthToken()

    localStorage.removeItem(`${projectName}-owners`)
    localStorage.removeItem(`${projectName}-statuses`)
    setUnitOwners({})
    setUnitStatuses({})

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/project-data/${projectName}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ owners: {}, statuses: {} }),
        })
      } catch (err) {
        console.error("Error clearing data:", err)
      }
    }
  }, [projectName, getAuthToken])

  // Export data as JSON string
  const exportData = useCallback(() => {
    const data = {
      project: projectName,
      owners: unitOwners,
      statuses: unitStatuses,
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }, [projectName, unitOwners, unitStatuses])

  // Manual refresh
  const refresh = useCallback(() => {
    setIsLoading(true)
    fetchProjectData()
  }, [fetchProjectData])

  return {
    unitOwners,
    unitStatuses,
    addOwner,
    removeOwner,
    updateStatus,
    getOwner,
    getStatus,
    clearData,
    exportData,
    refresh,
    isLoading,
    error,
    lastSync,
  }
}
