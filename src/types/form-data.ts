export interface FormData {
  fechaFirma: string
  emprendimiento: string
  quienVende: string
  unidadFuncional: string
  tipoDocumento: string
  m2: {
    totales: string
    cubierta: string
    semiCubierta: string
    palierPrivado: string
    amenities: string
  }
  precio: {
    valorVentaTotal: string
    valorUF: string
    valorCHBaulera: string
    valorVentaA: string
    valorM2: string
    valorM2Neto: string
    formaPago: string
  }
  comprador: {
    nombre: string
    dni: string
    direccion: string
    cuit: string
    mail: string
    telefono: string
  }
  sellos: {
    montoTotal: string
    quienAbona: string
  }
  honorarios: {
    montoTotal: string
    quienAbona: string
  }

  // Añade esta línea para permitir el acceso con índice de tipo string
  [key: string]: any
}

