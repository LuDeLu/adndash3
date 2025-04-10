/**
* Servicio para comunicarse con la API del backend
*/

import type { FormData } from "@/types/form-data"
import type { ApprovalTicket } from "@/types/approval-ticket"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://adndashboard.squareweb.app/api"

// Función auxiliar para manejar errores de fetch
async function handleResponse(response: Response) {
 if (!response.ok) {
   const errorData = await response.json().catch(() => ({}))
   throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
 }
 return response.json()
}

// Obtener todos los tickets
export async function getAllTickets(): Promise<ApprovalTicket[]> {
 const response = await fetch(`${API_URL}/checklist`, {
   headers: {
     Authorization: `Bearer ${localStorage.getItem("token")}`,
   },
 })
 return handleResponse(response)
}

// Obtener un ticket por ID
export async function getTicketById(id: string): Promise<ApprovalTicket> {
 const response = await fetch(`${API_URL}/checklist/${id}`, {
   headers: {
     Authorization: `Bearer ${localStorage.getItem("token")}`,
   },
 })
 return handleResponse(response)
}

// Crear un nuevo ticket
export async function createTicket(formData: FormData, title?: string): Promise<ApprovalTicket> {
 const response = await fetch(`${API_URL}/checklist`, {
   method: "POST",
   headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${localStorage.getItem("token")}`,
   },
   body: JSON.stringify({
     title: title || `Aprobación ${formData.tipoDocumento || "Documento"}`,
     formData: formData, // Asegúrate de que esto sea un objeto, no una cadena
   }),
 })
 return handleResponse(response)
}

// Actualizar un ticket
export async function updateTicket(id: string, data: Partial<ApprovalTicket>): Promise<ApprovalTicket> {
 const response = await fetch(`${API_URL}/checklist/${id}`, {
   method: "PUT",
   headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${localStorage.getItem("token")}`,
   },
   body: JSON.stringify(data),
 })
 return handleResponse(response)
}

// Eliminar un ticket
export async function deleteTicket(id: string): Promise<{ message: string }> {
 const response = await fetch(`${API_URL}/checklist/${id}`, {
   method: "DELETE",
   headers: {
     Authorization: `Bearer ${localStorage.getItem("token")}`,
   },
 })
 return handleResponse(response)
}

// Aprobar o rechazar un ticket
export async function approveTicket(
 id: string,
 department: string,
 approved: boolean,
 comentarios?: string,
): Promise<ApprovalTicket> {
 const response = await fetch(`${API_URL}/checklist/${id}/approve`, {
   method: "POST",
   headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${localStorage.getItem("token")}`,
   },
   body: JSON.stringify({
     department,
     approved,
     comentarios,
   }),
 })
 return handleResponse(response)
}

// Buscar tickets
export async function searchTickets(term: string): Promise<ApprovalTicket[]> {
 const response = await fetch(`${API_URL}/checklist/search?term=${encodeURIComponent(term)}`, {
   headers: {
     Authorization: `Bearer ${localStorage.getItem("token")}`,
   },
 })
 return handleResponse(response)
}

// Obtener estadísticas de tickets
export async function getTicketStats(): Promise<any> {
 const response = await fetch(`${API_URL}/checklist/stats`, {
   headers: {
     Authorization: `Bearer ${localStorage.getItem("token")}`,
   },
 })
 return handleResponse(response)
}

// Generar PDF para un ticket
export async function generatePDF(formData: FormData): Promise<Blob> {
  const response = await fetch(`${API_URL}/checklist/generate-pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ formData }),
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
  }
  
  return response.blob()
}