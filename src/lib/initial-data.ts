import type { FormData } from "@/types/form-data"

export const initialFormData: FormData = {
  fechaFirma: "",
  emprendimiento: "",
  quienVende: "",
  unidadFuncional: "",
  m2: {
    totales: "",
    cubierta: "",
    semiCubierta: "",
    palierPrivado: "",
    amenities: "",
  },
  tipoDocumento: "",
  precio: {
    valorVentaTotal: "",
    valorUF: "",
    valorCHBaulera: "",
    valorVentaA: "",
    valorM2: "",
    valorM2Neto: "",
    formaPago: "",
  },
  comprador: {
    nombre: "",
    dni: "",
    direccion: "",
    cuit: "",
    mail: "",
    telefono: "",
  },
  sellos: {
    montoTotal: "",
    quienAbona: "",
  },
  honorarios: {
    montoTotal: "",
    quienAbona: "",
  },
}
