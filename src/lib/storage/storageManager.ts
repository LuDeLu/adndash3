interface ProjectData {
  projectId: string
  owners: { [key: string]: any }
  statuses: { [key: string]: any }
  lastUpdated: string
}

export const storageManager = {
  // Exportar todos los datos de un proyecto
  exportProjectData: (projectId: string): ProjectData => {
    const owners = localStorage.getItem(`dome-${projectId}-owners`)
    const statuses = localStorage.getItem(`dome-${projectId}-statuses`)

    return {
      projectId,
      owners: owners ? JSON.parse(owners) : {},
      statuses: statuses ? JSON.parse(statuses) : {},
      lastUpdated: new Date().toISOString(),
    }
  },

  // Importar datos de un proyecto
  importProjectData: (data: ProjectData) => {
    localStorage.setItem(`dome-${data.projectId}-owners`, JSON.stringify(data.owners))
    localStorage.setItem(`dome-${data.projectId}-statuses`, JSON.stringify(data.statuses))
  },

  // Descargar como archivo JSON
  downloadProjectAsJSON: (projectId: string) => {
    const data = storageManager.exportProjectData(projectId)
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `dome-${projectId}-backup-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  },

  // Limpiar todos los datos de un proyecto
  clearProjectData: (projectId: string) => {
    localStorage.removeItem(`dome-${projectId}-owners`)
    localStorage.removeItem(`dome-${projectId}-statuses`)
  },

  // Sincronizar datos entre pestañas
  setupCrossTabSync: (projectId: string, callback: () => void) => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        (e.key?.includes(`dome-${projectId}-owners`) || e.key?.includes(`dome-${projectId}-statuses`)) &&
        e.newValue
      ) {
        callback()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  },
}
