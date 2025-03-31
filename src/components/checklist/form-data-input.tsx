"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { FormData } from "@/types/form-data"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FormDataInputProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  showRequired?: boolean
}

export function FormDataInput({ formData, onChange, showRequired = false }: FormDataInputProps) {
  // Handle simple field changes
  const handleChange = (field: keyof FormData, value: any) => {
    onChange({ [field]: value })
  }

  // Handle nested field changes with type safety
  const handleNestedChange = (section: keyof FormData, field: string, value: any) => {
    if (typeof formData[section] === "object" && formData[section] !== null) {
      onChange({
        [section]: {
          ...formData[section],
          [field]: value,
        },
      })
    }
  }

  const RequiredLabel = ({ children }: { children: React.ReactNode }) =>
    showRequired ? (
      <span className="flex items-center gap-1">
        {children} <span className="text-red-500">*</span>
      </span>
    ) : (
      <>{children}</>
    )

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center mb-4">FORMULARIO DE APROBACIÓN - CHECK LIST</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fechaFirma">Fecha de Firma</Label>
          <Input
            id="fechaFirma"
            type="date"
            value={formData.fechaFirma || ""}
            onChange={(e) => handleChange("fechaFirma", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="emprendimiento">
            <RequiredLabel>1. Emprendimiento</RequiredLabel>
          </Label>
          <Input
            id="emprendimiento"
            value={formData.emprendimiento || ""}
            onChange={(e) => handleChange("emprendimiento", e.target.value)}
            placeholder="Nombre del emprendimiento"
            className={showRequired ? "border-blue-200 focus:border-blue-500" : ""}
          />
        </div>

        <div>
          <Label htmlFor="quienVende">
            <RequiredLabel>2. Quien Vende</RequiredLabel>
          </Label>
          <Input
            id="quienVende"
            value={formData.quienVende || ""}
            onChange={(e) => handleChange("quienVende", e.target.value)}
            placeholder="Nombre del vendedor"
            className={showRequired ? "border-blue-200 focus:border-blue-500" : ""}
          />
        </div>

        <div>
          <Label htmlFor="unidadFuncional">
            <RequiredLabel>3. Unidad Funcional</RequiredLabel>
          </Label>
          <Input
            id="unidadFuncional"
            value={formData.unidadFuncional || ""}
            onChange={(e) => handleChange("unidadFuncional", e.target.value)}
            placeholder="Descripción de la unidad funcional"
            className={showRequired ? "border-blue-200 focus:border-blue-500" : ""}
          />
        </div>
      </div>

      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>4. M2 Totales según plano vigente</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-4">
              <div>
                <Label htmlFor="m2Totales">M2 Totales</Label>
                <Input
                  id="m2Totales"
                  value={formData.m2?.totales || ""}
                  onChange={(e) => handleNestedChange("m2", "totales", e.target.value)}
                  placeholder="Ej: 186.58"
                />
              </div>
              <div>
                <Label htmlFor="supCubierta">Sup. Cubierta</Label>
                <Input
                  id="supCubierta"
                  value={formData.m2?.cubierta || ""}
                  onChange={(e) => handleNestedChange("m2", "cubierta", e.target.value)}
                  placeholder="Ej: 146.46"
                />
              </div>
              <div>
                <Label htmlFor="supSemiCubierta">Sup. Semi cubierta</Label>
                <Input
                  id="supSemiCubierta"
                  value={formData.m2?.semiCubierta || ""}
                  onChange={(e) => handleNestedChange("m2", "semiCubierta", e.target.value)}
                  placeholder="Ej: 20.79"
                />
              </div>
              <div>
                <Label htmlFor="palierPrivado">Palier Privado</Label>
                <Input
                  id="palierPrivado"
                  value={formData.m2?.palierPrivado || ""}
                  onChange={(e) => handleNestedChange("m2", "palierPrivado", e.target.value)}
                  placeholder="Ej: 2.60"
                />
              </div>
              <div>
                <Label htmlFor="supAmenities">Sup. Amenities</Label>
                <Input
                  id="supAmenities"
                  value={formData.m2?.amenities || ""}
                  onChange={(e) => handleNestedChange("m2", "amenities", e.target.value)}
                  placeholder="Ej: 16.73"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div>
        <Label>5. Tipo de Documento</Label>
        <RadioGroup
          value={formData.tipoDocumento || ""}
          onValueChange={(value) => handleChange("tipoDocumento", value)}
          className="mt-2 space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="reserva" id="reserva" />
            <Label htmlFor="reserva">Reserva Seña</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="boleto" id="boleto" />
            <Label htmlFor="boleto">Boleto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cesion" id="cesion" />
            <Label htmlFor="cesion">Cesión</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mutuo" id="mutuo" />
            <Label htmlFor="mutuo">Mutuo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="locacion" id="locacion" />
            <Label htmlFor="locacion">Locación de Obra (Contratistas – Proveedores)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="otros" id="otros" />
            <Label htmlFor="otros">Otros</Label>
          </div>
        </RadioGroup>
      </div>

      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>6. Precio y Formas de Pago</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-4">
              <div>
                <Label htmlFor="valorVentaTotal">Valor de Venta Total</Label>
                <Input
                  id="valorVentaTotal"
                  value={formData.precio?.valorVentaTotal || ""}
                  onChange={(e) => handleNestedChange("precio", "valorVentaTotal", e.target.value)}
                  placeholder="USD"
                />
              </div>
              <div>
                <Label htmlFor="valorUF">UF/UFs</Label>
                <Input
                  id="valorUF"
                  value={formData.precio?.valorUF || ""}
                  onChange={(e) => handleNestedChange("precio", "valorUF", e.target.value)}
                  placeholder="USD"
                />
              </div>
              <div>
                <Label htmlFor="valorCHBaulera">CHs + Baulera</Label>
                <Input
                  id="valorCHBaulera"
                  value={formData.precio?.valorCHBaulera || ""}
                  onChange={(e) => handleNestedChange("precio", "valorCHBaulera", e.target.value)}
                  placeholder="USD"
                />
              </div>
              <div>
                <Label htmlFor="valorVentaA">Valor de Venta A</Label>
                <Input
                  id="valorVentaA"
                  value={formData.precio?.valorVentaA || ""}
                  onChange={(e) => handleNestedChange("precio", "valorVentaA", e.target.value)}
                  placeholder="USD"
                />
              </div>
              <div>
                <Label htmlFor="valorM2">US$/M2</Label>
                <Input
                  id="valorM2"
                  value={formData.precio?.valorM2 || ""}
                  onChange={(e) => handleNestedChange("precio", "valorM2", e.target.value)}
                  placeholder="USD"
                />
              </div>
              <div>
                <Label htmlFor="valorM2Neto">US$/M2 (neto)</Label>
                <Input
                  id="valorM2Neto"
                  value={formData.precio?.valorM2Neto || ""}
                  onChange={(e) => handleNestedChange("precio", "valorM2Neto", e.target.value)}
                  placeholder="USD"
                />
              </div>
              <div>
                <Label htmlFor="formaPago">Forma de Pago</Label>
                <Textarea
                  id="formaPago"
                  value={formData.precio?.formaPago || ""}
                  onChange={(e) => handleNestedChange("precio", "formaPago", e.target.value)}
                  rows={4}
                  placeholder="Detalle la forma de pago (cuotas, montos, plazos, etc.)"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>7. Datos del Comprador</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-4">
              <div>
                <Label htmlFor="nombreComprador">Nombre y Apellido</Label>
                <Input
                  id="nombreComprador"
                  value={formData.comprador?.nombre || ""}
                  onChange={(e) => handleNestedChange("comprador", "nombre", e.target.value)}
                  placeholder="Nombre completo del comprador"
                />
              </div>
              <div>
                <Label htmlFor="dniComprador">DNI</Label>
                <Input
                  id="dniComprador"
                  value={formData.comprador?.dni || ""}
                  onChange={(e) => handleNestedChange("comprador", "dni", e.target.value)}
                  placeholder="Número de DNI"
                />
              </div>
              <div>
                <Label htmlFor="direccionComprador">Dirección</Label>
                <Input
                  id="direccionComprador"
                  value={formData.comprador?.direccion || ""}
                  onChange={(e) => handleNestedChange("comprador", "direccion", e.target.value)}
                  placeholder="Dirección completa"
                />
              </div>
              <div>
                <Label htmlFor="cuitComprador">CUIT</Label>
                <Input
                  id="cuitComprador"
                  value={formData.comprador?.cuit || ""}
                  onChange={(e) => handleNestedChange("comprador", "cuit", e.target.value)}
                  placeholder="Número de CUIT"
                />
              </div>
              <div>
                <Label htmlFor="mailComprador">Mail</Label>
                <Input
                  id="mailComprador"
                  value={formData.comprador?.mail || ""}
                  onChange={(e) => handleNestedChange("comprador", "mail", e.target.value)}
                  placeholder="Correo electrónico"
                />
              </div>
              <div>
                <Label htmlFor="telefonoComprador">Teléfono</Label>
                <Input
                  id="telefonoComprador"
                  value={formData.comprador?.telefono || ""}
                  onChange={(e) => handleNestedChange("comprador", "telefono", e.target.value)}
                  placeholder="Número de teléfono"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>8. Sellos</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-4">
              <div>
                <Label htmlFor="montoSellos">Monto Total</Label>
                <Input
                  id="montoSellos"
                  value={formData.sellos?.montoTotal || ""}
                  onChange={(e) => handleNestedChange("sellos", "montoTotal", e.target.value)}
                  placeholder="Ej: USD 8.793 / TC 933,50 / $ 8.208.265,5.-"
                />
              </div>
              <div>
                <Label htmlFor="quienAbona">Quien lo abona</Label>
                <Input
                  id="quienAbona"
                  value={formData.sellos?.quienAbona || ""}
                  onChange={(e) => handleNestedChange("sellos", "quienAbona", e.target.value)}
                  placeholder="Ej: Comprador"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>9. Honorarios de Certificación de Firmas</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-4">
              <div>
                <Label htmlFor="montoHonorarios">Monto Total</Label>
                <Input
                  id="montoHonorarios"
                  value={formData.honorarios?.montoTotal || ""}
                  onChange={(e) => handleNestedChange("honorarios", "montoTotal", e.target.value)}
                  placeholder="Ej: $90.000"
                />
              </div>
              <div>
                <Label htmlFor="quienAbonaHonorarios">Quien lo abona</Label>
                <Input
                  id="quienAbonaHonorarios"
                  value={formData.honorarios?.quienAbona || ""}
                  onChange={(e) => handleNestedChange("honorarios", "quienAbona", e.target.value)}
                  placeholder="Ej: Cliente"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

