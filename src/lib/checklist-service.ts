import type { FormData } from "@/types/form-data"
import type { Checklist } from "@/types/checklist"

// Simulación de base de datos en memoria
let checklists: Checklist[] = []
let nextId = 1

// Función para generar un ID único
const generateId = () => {
  return `checklist_${nextId++}`
}

// Función para obtener todos los checklists con filtros
export async function fetchChecklists({
  page = 1,
  limit = 10,
  search = "",
  userId = null,
  status = null,
  dateFrom = null,
  dateTo = null,
  department = null,
}: {
  page?: number
  limit?: number
  search?: string
  userId?: string | null
  status?: string | null
  dateFrom?: Date | null
  dateTo?: Date | null
  department?: string | null
}) {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filtrar checklists
  let filtered = [...checklists]

  // Filtrar por búsqueda
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (checklist) =>
        checklist.formData.emprendimiento.toLowerCase().includes(searchLower) ||
        checklist.formData.unidadFuncional.toLowerCase().includes(searchLower) ||
        checklist.formData.comprador.nombre.toLowerCase().includes(searchLower),
    )
  }

  // Filtrar por usuario
  if (userId) {
    filtered = filtered.filter(
      (checklist) => checklist.createdBy === userId || checklist.approvals.some((a) => a.userId === userId),
    )
  }

  // Filtrar por estado
  if (status) {
    filtered = filtered.filter((checklist) => checklist.status === status)
  }

  // Filtrar por fechas
  if (dateFrom) {
    filtered = filtered.filter((checklist) => new Date(checklist.createdAt) >= dateFrom)
  }

  if (dateTo) {
    filtered = filtered.filter((checklist) => new Date(checklist.createdAt) <= dateTo)
  }

  // Filtrar por departamento
  if (department) {
    filtered = filtered.filter((checklist) => checklist.approvals.some((a) => a.department === department))
  }

  // Ordenar por fecha de actualización (más reciente primero)
  filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  // Paginar resultados
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedResults = filtered.slice(start, end)

  return {
    checklists: paginatedResults,
    total: filtered.length,
  }
}

// Función para obtener un checklist por ID
export async function getChecklist(id: string) {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300))

  const checklist = checklists.find((c) => c.id === id)

  if (!checklist) {
    throw new Error("Checklist not found")
  }

  return checklist
}

// Función para guardar un checklist (crear o actualizar)
export async function saveChecklist({
  id,
  formData,
  status = "draft",
  userId,
}: {
  id?: string | null
  formData: FormData
  status?: string
  userId?: string | null
}) {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 700))

  const now = new Date().toISOString()

  if (id) {
    // Actualizar checklist existente
    const index = checklists.findIndex((c) => c.id === id)

    if (index === -1) {
      throw new Error("Checklist not found")
    }

    const updatedChecklist = {
      ...checklists[index],
      formData,
      status,
      updatedAt: now,
    }

    checklists[index] = updatedChecklist
    return updatedChecklist
  } else {
    // Crear nuevo checklist
    const newChecklist: Checklist = {
      id: generateId(),
      formData,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      createdBy: userId || "unknown",
      createdByName: "Usuario",
      approvals: [
        { department: "contaduria", departmentName: "Contaduría", approved: false, rejected: false },
        { department: "legales", departmentName: "Legales", approved: false, rejected: false },
        { department: "tesoreria", departmentName: "Tesorería", approved: false, rejected: false },
        { department: "gerenciaComercial", departmentName: "Gerencia Comercial", approved: false, rejected: false },
        { department: "gerencia", departmentName: "Gerencia", approved: false, rejected: false },
        { department: "arquitecto", departmentName: "Arquitecto", approved: false, rejected: false },
      ],
    }

    checklists.push(newChecklist)
    return newChecklist
  }
}

// Función para enviar un checklist para aprobación
export async function submitChecklist({
  id,
  formData,
  userId,
}: {
  id?: string | null
  formData: FormData
  userId?: string | null
}) {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Si no hay ID, primero guardar como borrador
  if (!id) {
    const savedChecklist = await saveChecklist({ formData, userId })
    id = savedChecklist.id
  }

  // Actualizar estado a "submitted"
  const index = checklists.findIndex((c) => c.id === id)

  if (index === -1) {
    throw new Error("Checklist not found")
  }

  const now = new Date().toISOString()

  const updatedChecklist = {
    ...checklists[index],
    formData,
    status: "in_review",
    updatedAt: now,
  }

  checklists[index] = updatedChecklist
  return updatedChecklist
}

// Función para aprobar un checklist
export async function approveChecklist(
  id: string,
  {
    department,
    comments,
    userId,
    userName,
  }: {
    department: string
    comments: string
    userId: string
    userName: string
  },
) {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 600))

  const index = checklists.findIndex((c) => c.id === id)

  if (index === -1) {
    throw new Error("Checklist not found")
  }

  const now = new Date().toISOString()
  const checklist = { ...checklists[index] }

  // Actualizar la aprobación del departamento
  const approvalIndex = checklist.approvals.findIndex((a) => a.department === department)

  if (approvalIndex === -1) {
    throw new Error("Department not found")
  }

  checklist.approvals[approvalIndex] = {
    ...checklist.approvals[approvalIndex],
    approved: true,
    rejected: false,
    comments,
    userId,
    user: userName,
    approvedAt: now,
  }

  // Verificar si todos los departamentos han aprobado
  const allApproved = checklist.approvals.every((a) => a.approved)

  if (allApproved) {
    checklist.status = "approved"
  }

  checklist.updatedAt = now
  checklists[index] = checklist

  return checklist
}

// Función para rechazar un checklist
export async function rejectChecklist(
  id: string,
  {
    department,
    comments,
    userId,
    userName,
  }: {
    department: string
    comments: string
    userId: string
    userName: string
  },
) {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 600))

  const index = checklists.findIndex((c) => c.id === id)

  if (index === -1) {
    throw new Error("Checklist not found")
  }

  const now = new Date().toISOString()
  const checklist = { ...checklists[index] }

  // Actualizar la aprobación del departamento
  const approvalIndex = checklist.approvals.findIndex((a) => a.department === department)

  if (approvalIndex === -1) {
    throw new Error("Department not found")
  }

  checklist.approvals[approvalIndex] = {
    ...checklist.approvals[approvalIndex],
    approved: false,
    rejected: true,
    comments,
    userId,
    user: userName,
    approvedAt: now,
  }

  // Cambiar estado a rechazado
  checklist.status = "rejected"
  checklist.updatedAt = now

  checklists[index] = checklist

  return checklist
}

// Función para eliminar un checklist
export async function deleteChecklist(id: string) {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = checklists.findIndex((c) => c.id === id)

  if (index === -1) {
    throw new Error("Checklist not found")
  }

  checklists.splice(index, 1)

  return { success: true }
}

// Función para obtener estadísticas
export async function getChecklistStats() {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Contar por estado
  const statusCounts = {
    draft: 0,
    submitted: 0,
    in_review: 0,
    approved: 0,
    rejected: 0,
  }

  checklists.forEach((checklist) => {
    if (statusCounts[checklist.status as keyof typeof statusCounts] !== undefined) {
      statusCounts[checklist.status as keyof typeof statusCounts]++
    }
  })

  // Datos de ejemplo para estadísticas mensuales
  const monthlyStats = [
    { name: "Ene", creados: 4, aprobados: 2, rechazados: 1 },
    { name: "Feb", creados: 6, aprobados: 3, rechazados: 2 },
    { name: "Mar", creados: 8, aprobados: 5, rechazados: 1 },
    { name: "Abr", creados: 10, aprobados: 7, rechazados: 0 },
    { name: "May", creados: 7, aprobados: 4, rechazados: 2 },
    { name: "Jun", creados: 9, aprobados: 6, rechazados: 1 },
  ]

  // Datos de ejemplo para estadísticas por departamento
  const departmentStats = [
    { name: "Contaduría", aprobados: 15, pendientes: 5 },
    { name: "Legales", aprobados: 12, pendientes: 8 },
    { name: "Tesorería", aprobados: 10, pendientes: 10 },
    { name: "Gerencia Comercial", aprobados: 18, pendientes: 2 },
    { name: "Gerencia", aprobados: 14, pendientes: 6 },
    { name: "Arquitecto", aprobados: 16, pendientes: 4 },
  ]

  return {
    totalChecklists: checklists.length,
    pendingApprovals: checklists.filter((c) => c.status === "in_review").length,
    approvedCount: statusCounts.approved,
    inReviewCount: statusCounts.in_review,
    rejectedCount: statusCounts.rejected,
    statusCounts,
    monthlyStats,
    departmentStats,
  }
}

// Inicializar con algunos datos de ejemplo
const initializeData = () => {
  const now = new Date().toISOString()
  const yesterday = new Date(Date.now() - 86400000).toISOString()
  const lastWeek = new Date(Date.now() - 86400000 * 7).toISOString()

  checklists = [
    {
      id: generateId(),
      formData: {
        fechaFirma: "2023-06-15",
        emprendimiento: "Torre Mirador",
        quienVende: "Desarrollos Urbanos S.A.",
        unidadFuncional: "UF 1201",
        m2: {
          totales: "120.5",
          cubierta: "105.3",
          semiCubierta: "15.2",
          palierPrivado: "0",
          amenities: "0",
        },
        tipoDocumento: "boleto",
        precio: {
          valorVentaTotal: "250000",
          valorUF: "230000",
          valorCHBaulera: "20000",
          valorVentaA: "250000",
          valorM2: "2075",
          valorM2Neto: "2000",
          formaPago: "30% al contado, saldo en 36 cuotas",
        },
        comprador: {
          nombre: "Juan Pérez",
          dni: "28456789",
          direccion: "Av. Libertador 1234, CABA",
          cuit: "20-28456789-0",
          mail: "juan.perez@email.com",
          telefono: "1155667788",
        },
        sellos: {
          montoTotal: "USD 7.500",
          quienAbona: "Comprador",
        },
        honorarios: {
          montoTotal: "$120.000",
          quienAbona: "Comprador",
        },
      },
      status: "approved",
      createdAt: lastWeek,
      updatedAt: yesterday,
      createdBy: "user1",
      createdByName: "Administrador",
      approvals: [
        {
          department: "contaduria",
          departmentName: "Contaduría",
          approved: true,
          rejected: false,
          user: "Contador",
          userId: "user2",
          approvedAt: yesterday,
          comments: "Aprobado sin observaciones",
        },
        {
          department: "legales",
          departmentName: "Legales",
          approved: true,
          rejected: false,
          user: "Abogado",
          userId: "user3",
          approvedAt: yesterday,
          comments: "Documentación en regla",
        },
        {
          department: "tesoreria",
          departmentName: "Tesorería",
          approved: true,
          rejected: false,
          user: "Tesorero",
          userId: "user4",
          approvedAt: yesterday,
        },
        {
          department: "gerenciaComercial",
          departmentName: "Gerencia Comercial",
          approved: true,
          rejected: false,
          user: "Gerente Comercial",
          userId: "user5",
          approvedAt: yesterday,
        },
        {
          department: "gerencia",
          departmentName: "Gerencia",
          approved: true,
          rejected: false,
          user: "Gerente General",
          userId: "user6",
          approvedAt: yesterday,
        },
        {
          department: "arquitecto",
          departmentName: "Arquitecto",
          approved: true,
          rejected: false,
          user: "Arquitecto",
          userId: "user7",
          approvedAt: yesterday,
        },
      ],
    },
    {
      id: generateId(),
      formData: {
        fechaFirma: "2023-06-20",
        emprendimiento: "Edificio Parque",
        quienVende: "Desarrollos Urbanos S.A.",
        unidadFuncional: "UF 502",
        m2: {
          totales: "85.3",
          cubierta: "75.1",
          semiCubierta: "10.2",
          palierPrivado: "0",
          amenities: "0",
        },
        tipoDocumento: "reserva",
        precio: {
          valorVentaTotal: "180000",
          valorUF: "170000",
          valorCHBaulera: "10000",
          valorVentaA: "180000",
          valorM2: "2110",
          valorM2Neto: "2000",
          formaPago: "20% al contado, saldo en 24 cuotas",
        },
        comprador: {
          nombre: "María González",
          dni: "30123456",
          direccion: "Callao 567, CABA",
          cuit: "27-30123456-9",
          mail: "maria.gonzalez@email.com",
          telefono: "1144556677",
        },
        sellos: {
          montoTotal: "USD 5.400",
          quienAbona: "Comprador",
        },
        honorarios: {
          montoTotal: "$90.000",
          quienAbona: "Comprador",
        },
      },
      status: "in_review",
      createdAt: yesterday,
      updatedAt: now,
      createdBy: "user1",
      createdByName: "Administrador",
      approvals: [
        {
          department: "contaduria",
          departmentName: "Contaduría",
          approved: true,
          rejected: false,
          user: "Contador",
          userId: "user2",
          approvedAt: now,
          comments: "Aprobado",
        },
        {
          department: "legales",
          departmentName: "Legales",
          approved: true,
          rejected: false,
          user: "Abogado",
          userId: "user3",
          approvedAt: now,
          comments: "Aprobado",
        },
        { department: "tesoreria", departmentName: "Tesorería", approved: false, rejected: false },
        { department: "gerenciaComercial", departmentName: "Gerencia Comercial", approved: false, rejected: false },
        { department: "gerencia", departmentName: "Gerencia", approved: false, rejected: false },
        { department: "arquitecto", departmentName: "Arquitecto", approved: false, rejected: false },
      ],
    },
    {
      id: generateId(),
      formData: {
        fechaFirma: "2023-06-25",
        emprendimiento: "Residencial del Bosque",
        quienVende: "Desarrollos Urbanos S.A.",
        unidadFuncional: "UF 301",
        m2: {
          totales: "95.7",
          cubierta: "85.5",
          semiCubierta: "10.2",
          palierPrivado: "0",
          amenities: "0",
        },
        tipoDocumento: "boleto",
        precio: {
          valorVentaTotal: "200000",
          valorUF: "190000",
          valorCHBaulera: "10000",
          valorVentaA: "200000",
          valorM2: "2090",
          valorM2Neto: "2000",
          formaPago: "40% al contado, saldo en 12 cuotas",
        },
        comprador: {
          nombre: "Carlos Rodríguez",
          dni: "25789456",
          direccion: "Córdoba 1234, CABA",
          cuit: "20-25789456-7",
          mail: "carlos.rodriguez@email.com",
          telefono: "1122334455",
        },
        sellos: {
          montoTotal: "USD 6.000",
          quienAbona: "Comprador",
        },
        honorarios: {
          montoTotal: "$100.000",
          quienAbona: "Comprador",
        },
      },
      status: "rejected",
      createdAt: lastWeek,
      updatedAt: yesterday,
      createdBy: "user1",
      createdByName: "Administrador",
      approvals: [
        {
          department: "contaduria",
          departmentName: "Contaduría",
          approved: false,
          rejected: true,
          user: "Contador",
          userId: "user2",
          approvedAt: yesterday,
          comments: "Faltan datos de la forma de pago",
        },
        { department: "legales", departmentName: "Legales", approved: false, rejected: false },
        { department: "tesoreria", departmentName: "Tesorería", approved: false, rejected: false },
        { department: "gerenciaComercial", departmentName: "Gerencia Comercial", approved: false, rejected: false },
        { department: "gerencia", departmentName: "Gerencia", approved: false, rejected: false },
        { department: "arquitecto", departmentName: "Arquitecto", approved: false, rejected: false },
      ],
    },
    {
      id: generateId(),
      formData: {
        fechaFirma: "",
        emprendimiento: "Torre Central",
        quienVende: "Desarrollos Urbanos S.A.",
        unidadFuncional: "UF 801",
        m2: {
          totales: "110.2",
          cubierta: "95.0",
          semiCubierta: "15.2",
          palierPrivado: "0",
          amenities: "0",
        },
        tipoDocumento: "boleto",
        precio: {
          valorVentaTotal: "220000",
          valorUF: "200000",
          valorCHBaulera: "20000",
          valorVentaA: "220000",
          valorM2: "2000",
          valorM2Neto: "1900",
          formaPago: "50% al contado, saldo en 6 cuotas",
        },
        comprador: {
          nombre: "Ana Martínez",
          dni: "27654321",
          direccion: "Santa Fe 789, CABA",
          cuit: "27-27654321-8",
          mail: "ana.martinez@email.com",
          telefono: "1133445566",
        },
        sellos: {
          montoTotal: "USD 6.600",
          quienAbona: "Comprador",
        },
        honorarios: {
          montoTotal: "$110.000",
          quienAbona: "Comprador",
        },
      },
      status: "draft",
      createdAt: now,
      updatedAt: now,
      createdBy: "user1",
      createdByName: "Administrador",
      approvals: [
        { department: "contaduria", departmentName: "Contaduría", approved: false, rejected: false },
        { department: "legales", departmentName: "Legales", approved: false, rejected: false },
        { department: "tesoreria", departmentName: "Tesorería", approved: false, rejected: false },
        { department: "gerenciaComercial", departmentName: "Gerencia Comercial", approved: false, rejected: false },
        { department: "gerencia", departmentName: "Gerencia", approved: false, rejected: false },
        { department: "arquitecto", departmentName: "Arquitecto", approved: false, rejected: false },
      ],
    },
  ]
}

// Inicializar datos de ejemplo
initializeData()

