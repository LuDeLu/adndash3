"use client"

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import type { FormData } from "@/types/form-data"

interface PDFDocumentProps {
  formData: FormData
}

// Register font
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf" },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    width: "40%",
  },
  value: {
    width: "60%",
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },
  tableCell: {
    padding: 5,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  checkboxRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  checkboxGroup: {
    flexDirection: "column",
    alignItems: "center",
    width: "16%",
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 5,
  },
  checkboxLabel: {
    fontSize: 8,
    textAlign: "center",
  },
})

export function PDFDocument({ formData }: PDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>FORMULARIO DE APROBACIÓN - CHECK LIST</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha de Firma:</Text>
          <Text style={styles.value}>{formData.fechaFirma}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>1. Emprendimiento:</Text>
            <Text style={styles.value}>{formData.emprendimiento}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>2. Quien Vende:</Text>
            <Text style={styles.value}>{formData.quienVende}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>3. Unidad Funcional:</Text>
            <Text style={styles.value}>{formData.unidadFuncional}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>4. M2 Totales según plano vigente: {formData.m2.totales} mts2</Text>
          <View style={{ marginLeft: 20 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Sup. Cubierta:</Text>
              <Text style={styles.value}>{formData.m2.cubierta} mts2</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sup. Semi cubierta:</Text>
              <Text style={styles.value}>{formData.m2.semiCubierta} mts2</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Palier Privado:</Text>
              <Text style={styles.value}>{formData.m2.palierPrivado} mts2</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sup. Amenities:</Text>
              <Text style={styles.value}>{formData.m2.amenities} mts2</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>5. Tipo de Documento:</Text>
          <View style={{ marginLeft: 20 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Reserva Seña:</Text>
              <Text style={styles.value}>{formData.tipoDocumento === "reserva" ? "X" : ""}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Boleto:</Text>
              <Text style={styles.value}>{formData.tipoDocumento === "boleto" ? "X" : ""}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cesión:</Text>
              <Text style={styles.value}>{formData.tipoDocumento === "cesion" ? "X" : ""}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Mutuo:</Text>
              <Text style={styles.value}>{formData.tipoDocumento === "mutuo" ? "X" : ""}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Locación de Obra:</Text>
              <Text style={styles.value}>{formData.tipoDocumento === "locacion" ? "X" : ""}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Otros:</Text>
              <Text style={styles.value}>{formData.tipoDocumento === "otros" ? "X" : ""}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>6. Precio y Formas de Pago:</Text>
          <View style={{ marginLeft: 20 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Valor de Venta Total:</Text>
              <Text style={styles.value}>USD {formData.precio.valorVentaTotal}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>UF/UFs:</Text>
              <Text style={styles.value}>USD {formData.precio.valorUF}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>CHs + Baulera:</Text>
              <Text style={styles.value}>USD {formData.precio.valorCHBaulera}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Valor de Venta "A":</Text>
              <Text style={styles.value}>USD {formData.precio.valorVentaA}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>US$/M2:</Text>
              <Text style={styles.value}>USD {formData.precio.valorM2}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>US$/M2 (neto):</Text>
              <Text style={styles.value}>{formData.precio.valorM2Neto || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Forma de Pago:</Text>
              <Text style={styles.value}>{formData.precio.formaPago}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>7. Datos del Comprador:</Text>
          <View style={{ marginLeft: 20 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre y Apellido:</Text>
              <Text style={styles.value}>{formData.comprador.nombre}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>DNI:</Text>
              <Text style={styles.value}>{formData.comprador.dni}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Dirección:</Text>
              <Text style={styles.value}>{formData.comprador.direccion}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>CUIT:</Text>
              <Text style={styles.value}>{formData.comprador.cuit}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Mail:</Text>
              <Text style={styles.value}>{formData.comprador.mail}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{formData.comprador.telefono}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>8. Sellos:</Text>
          <View style={{ marginLeft: 20 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Monto Total:</Text>
              <Text style={styles.value}>{formData.sellos.montoTotal}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Quien lo abona:</Text>
              <Text style={styles.value}>{formData.sellos.quienAbona}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>9. Honorarios de Certificación de Firmas:</Text>
          <View style={{ marginLeft: 20 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Monto Total:</Text>
              <Text style={styles.value}>{formData.honorarios.montoTotal}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Quien lo abona:</Text>
              <Text style={styles.value}>{formData.honorarios.quienAbona}</Text>
            </View>
          </View>
        </View>

        <View style={styles.checkboxRow}>
          <View style={styles.checkboxGroup}>
            <Text style={styles.checkboxLabel}>Contaduría</Text>
            <View style={styles.checkbox}></View>
          </View>
          <View style={styles.checkboxGroup}>
            <Text style={styles.checkboxLabel}>Legales</Text>
            <View style={styles.checkbox}></View>
          </View>
          <View style={styles.checkboxGroup}>
            <Text style={styles.checkboxLabel}>Tesorería</Text>
            <View style={styles.checkbox}></View>
          </View>
          <View style={styles.checkboxGroup}>
            <Text style={styles.checkboxLabel}>Gerencia Comercial</Text>
            <View style={styles.checkbox}></View>
          </View>
          <View style={styles.checkboxGroup}>
            <Text style={styles.checkboxLabel}>Gerencia</Text>
            <View style={styles.checkbox}></View>
          </View>
          <View style={styles.checkboxGroup}>
            <Text style={styles.checkboxLabel}>Arquitecto</Text>
            <View style={styles.checkbox}></View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

