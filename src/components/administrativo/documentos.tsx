"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, ChevronDown, Folder, File, Eye, Download, Trash2, Share2, Building, Users, FileText, Image as ImageIcon, BarChart, DollarSign, PieChart, TrendingUp, Calendar } from 'lucide-react'

interface Document {
  id: string
  name: string
  uploadDate: Date
  size: number
  type: string
  url: string
  area: 'ventas' | 'finanzas' | 'marketing'
}

interface Folder {
  id: string
  name: string
  type: 'project' | 'client' | 'floor' | 'area'
  documents: Document[]
  subfolders?: Folder[]
  area?: 'ventas' | 'finanzas' | 'marketing'
}

const generateMonthlyExpenses = (clientName: string, months: number = 4) => {
  const expenses: Document[] = []
  const currentDate = new Date()
  
  for (let i = 0; i < months; i++) {
    const date = new Date(currentDate)
    date.setMonth(currentDate.getMonth() - i)
    expenses.push({
      id: `exp-${clientName}-${i}`,
      name: `Expensas ${date.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}.pdf`,
      uploadDate: date,
      size: 500000,
      type: 'application/pdf',
      url: '/placeholder.svg?height=100&width=100',
      area: 'finanzas'
    })
  }
  return expenses
}

const generateFloorDocuments = (floorNumber: number): Document[] => [
  {
    id: `floor-${floorNumber}-plan`,
    name: `Plano Piso ${floorNumber}.dwg`,
    uploadDate: new Date(),
    size: 2500000,
    type: 'application/acad',
    url: '/placeholder.svg?height=100&width=100',
    area: 'ventas'
  },
  {
    id: `floor-${floorNumber}-img-1`,
    name: `Foto Departamento ${floorNumber}A.jpg`,
    uploadDate: new Date(),
    size: 1500000,
    type: 'image/jpeg',
    url: '/placeholder.svg?height=100&width=100',
    area: 'marketing'
  },
  {
    id: `floor-${floorNumber}-img-2`,
    name: `Foto Departamento ${floorNumber}B.jpg`,
    uploadDate: new Date(),
    size: 1500000,
    type: 'image/jpeg',
    url: '/placeholder.svg?height=100&width=100',
    area: 'marketing'
  },
  {
    id: `floor-${floorNumber}-info`,
    name: `Información Piso ${floorNumber}.pdf`,
    uploadDate: new Date(),
    size: 800000,
    type: 'application/pdf',
    url: '/placeholder.svg?height=100&width=100',
    area: 'ventas'
  }
]

const generateBuildingFolders = (buildingName: string): Folder => {
  const floors: Folder[] = []
  for (let i = 1; i <= 6; i++) {
    floors.push({
      id: `${buildingName}-floor-${i}`,
      name: `Piso ${i}`,
      type: 'floor',
      documents: generateFloorDocuments(i)
    })
  }
  
  return {
    id: buildingName,
    name: buildingName,
    type: 'project',
    documents: [
      {
        id: `${buildingName}-brochure`,
        name: 'Brochure.pdf',
        uploadDate: new Date(),
        size: 5000000,
        type: 'application/pdf',
        url: '/placeholder.svg?height=100&width=100',
        area: 'marketing'
      },
      {
        id: `${buildingName}-renders`,
        name: 'Renders.zip',
        uploadDate: new Date(),
        size: 25000000,
        type: 'application/zip',
        url: '/placeholder.svg?height=100&width=100',
        area: 'marketing'
      },
      {
        id: `${buildingName}-specs`,
        name: 'Especificaciones Técnicas.pdf',
        uploadDate: new Date(),
        size: 3000000,
        type: 'application/pdf',
        url: '/placeholder.svg?height=100&width=100',
        area: 'ventas'
      }
    ],
    subfolders: floors
  }
}

const sampleFolders: Folder[] = [
  {
    id: 'projects',
    name: 'Proyectos',
    type: 'project',
    documents: [],
    subfolders: [
      generateBuildingFolders('DOME Palermo Apartments'),
      generateBuildingFolders('DOME Palermo Residence'),
      generateBuildingFolders('DOME Suites & Residence')
    ]
  },
  {
    id: 'clients',
    name: 'Clientes',
    type: 'client',
    documents: [],
    subfolders: [
      {
        id: 'client-1',
        name: 'María González',
        type: 'client',
        documents: [
          {
            id: 'contract-1',
            name: 'Contrato.pdf',
            uploadDate: new Date(),
            size: 1500000,
            type: 'application/pdf',
            url: '/placeholder.svg?height=100&width=100',
            area: 'ventas'
          },
          {
            id: 'invoice-1',
            name: 'Factura.pdf',
            uploadDate: new Date(),
            size: 500000,
            type: 'application/pdf',
            url: '/placeholder.svg?height=100&width=100',
            area: 'finanzas'
          },
          ...generateMonthlyExpenses('María González')
        ]
      },
      {
        id: 'client-2',
        name: 'Ana López',
        type: 'client',
        documents: [
          {
            id: 'contract-2',
            name: 'Contrato.pdf',
            uploadDate: new Date(),
            size: 1500000,
            type: 'application/pdf',
            url: '/placeholder.svg?height=100&width=100',
            area: 'ventas'
          },
          {
            id: 'invoice-2',
            name: 'Factura.pdf',
            uploadDate: new Date(),
            size: 500000,
            type: 'application/pdf',
            url: '/placeholder.svg?height=100&width=100',
            area: 'finanzas'
          },
          ...generateMonthlyExpenses('Ana López')
        ]
      },
      {
        id: 'client-3',
        name: 'Carlos Pérez',
        type: 'client',
        documents: [
          {
            id: 'contract-3',
            name: 'Contrato.pdf',
            uploadDate: new Date(),
            size: 1500000,
            type: 'application/pdf',
            url: '/placeholder.svg?height=100&width=100',
            area: 'ventas'
          },
          {
            id: 'invoice-3',
            name: 'Factura.pdf',
            uploadDate: new Date(),
            size: 500000,
            type: 'application/pdf',
            url: '/placeholder.svg?height=100&width=100',
            area: 'finanzas'
          },
          ...generateMonthlyExpenses('Carlos Pérez')
        ]
      }
    ]
  },
  {
    id: 'ventas',
    name: 'Ventas',
    type: 'area',
    area: 'ventas',
    documents: [
      {
        id: 'sales-report-2023',
        name: 'Reporte de Ventas 2023.xlsx',
        uploadDate: new Date(),
        size: 2500000,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        url: '/placeholder.svg?height=100&width=100',
        area: 'ventas'
      },
      {
        id: 'sales-forecast-2024',
        name: 'Pronóstico de Ventas 2024.pdf',
        uploadDate: new Date(),
        size: 1800000,
        type: 'application/pdf',
        url: '/placeholder.svg?height=100&width=100',
        area: 'ventas'
      },
      {
        id: 'client-database',
        name: 'Base de Datos de Clientes.xlsx',
        uploadDate: new Date(),
        size: 3500000,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        url: '/placeholder.svg?height=100&width=100',
        area: 'ventas'
      },
      {
        id: 'sales-training-manual',
        name: 'Manual de Capacitación en Ventas.pdf',
        uploadDate: new Date(),
        size: 5000000,
        type: 'application/pdf',
        url: '/placeholder.svg?height=100&width=100',
        area: 'ventas'
      }
    ]
  },
  {
    id: 'finanzas',
    name: 'Finanzas',
    type: 'area',
    area: 'finanzas',
    documents: [
      {
        id: 'annual-budget-2023',
        name: 'Presupuesto Anual 2023.xlsx',
        uploadDate: new Date(),
        size: 3000000,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        url: '/placeholder.svg?height=100&width=100',
        area: 'finanzas'
      },
      {
        id: 'financial-statements-2023',
        name: 'Estados Financieros 2023.pdf',
        uploadDate: new Date(),
        size: 4500000,
        type: 'application/pdf',
        url: '/placeholder.svg?height=100&width=100',
        area: 'finanzas'
      },
      {
        id: 'tax-report-2023',
        name: 'Informe de Impuestos 2023.pdf',
        uploadDate: new Date(),
        size: 2800000,
        type: 'application/pdf',
        url: '/placeholder.svg?height=100&width=100',
        area: 'finanzas'
      },
      {
        id: 'cash-flow-projection',
        name: 'Proyección de Flujo de Caja 2024.xlsx',
        uploadDate: new Date(),
        size: 1500000,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        url: '/placeholder.svg?height=100&width=100',
        area: 'finanzas'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    type: 'area',
    area: 'marketing',
    documents: [
      {
        id: 'marketing-plan-2024',
        name: 'Plan de Marketing 2024.pptx',
        uploadDate: new Date(),
        size: 5500000,
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        url: '/placeholder.svg?height=100&width=100',
        area: 'marketing'
      },
      {
        id: 'brand-guidelines',
        name: 'Guía de Marca DOME.pdf',
        uploadDate: new Date(),
        size: 8000000,
        type: 'application/pdf',
        url: '/placeholder.svg?height=100&width=100',
        area: 'marketing'
      },
      {
        id: 'social-media-calendar',
        name: 'Calendario de Redes Sociales 2024.xlsx',
        uploadDate: new Date(),
        size: 2000000,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        url: '/placeholder.svg?height=100&width=100',
        area: 'marketing'
      },
      {
        id: 'campaign-analytics-2023',
        name: 'Análisis de Campañas 2023.pdf',
        uploadDate: new Date(),
        size: 3500000,
        type: 'application/pdf',
        url: '/placeholder.svg?height=100&width=100',
        area: 'marketing'
      }
    ]
  }
]

const FolderComponent: React.FC<{
  folder: Folder
  onAddDocument: (folderId: string, document: Document) => void
  onDeleteDocument: (folderId: string, documentId: string) => void
  uploadProgress: { [key: string]: number }
  activeArea: string
}> = ({ folder, onAddDocument, onDeleteDocument, uploadProgress, activeArea }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onabort = () => console.log('File reading was aborted')
      reader.onerror = () => console.log('File reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
        const newDocument: Document = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          uploadDate: new Date(),
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          area: folder.area || 'ventas'
        }
        onAddDocument(folder.id, newDocument)
      }
      reader.readAsArrayBuffer(file)
    })
  }, [folder.id, onAddDocument, folder.area])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const shareDocument = (document: Document) => {
    console.log(`Sharing  document: ${document.name}`)
  }

  const getFolderIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Building className="mr-2 h-4 w-4" />
      case 'client':
        return <Users className="mr-2 h-4 w-4" />
      case 'area':
        if (folder.area === 'ventas') return <TrendingUp className="mr-2 h-4 w-4" />
        if (folder.area === 'finanzas') return <DollarSign className="mr-2 h-4 w-4" />
        if (folder.area === 'marketing') return <BarChart className="mr-2 h-4 w-4" />
        return <Folder className="mr-2 h-4 w-4" />
      default:
        return <Folder className="mr-2 h-4 w-4" />
    }
  }

  const getFileIcon = (type: string) => {
    if (type.includes('sheet')) return <FileText className="mr-2 h-4 w-4 text-green-500" />
    if (type.includes('pdf')) return <FileText className="mr-2 h-4 w-4 text-red-500" />
    if (type.includes('presentation')) return <FileText className="mr-2 h-4 w-4 text-orange-500" />
    if (type.startsWith('image/')) return <ImageIcon className="mr-2 h-4 w-4 text-blue-500" />
    return <File className="mr-2 h-4 w-4" />
  }

  const filteredDocuments = folder.documents.filter(
    doc => activeArea === 'all' || doc.area === activeArea
  )

  const shouldRender = activeArea === 'all' || folder.area === activeArea || folder.type !== 'area'

  if (!shouldRender) return null

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-gray-700 dark:hover:bg-gray-800 rounded">
        {isExpanded ? <ChevronDown className="mr-2" /> : <ChevronRight className="mr-2" />}
        {getFolderIcon(folder.type)}
        <span>{folder.name}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-6">
          {folder.subfolders?.map(subfolder => (
            <FolderComponent
              key={subfolder.id}
              folder={subfolder}
              onAddDocument={onAddDocument}
              onDeleteDocument={onDeleteDocument}
              uploadProgress={uploadProgress}
              activeArea={activeArea}
            />
          ))}
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 my-2 text-center cursor-pointer hover:border-primary transition-colors">
            <input {...getInputProps()} />
            <p className="text-sm">Arrastra archivos aquí o haz clic para seleccionar</p>
          </div>
          {filteredDocuments.map(doc => (
            <Card key={doc.id} className="mb-2">
              <CardHeader className="py-2">
                <CardTitle className="text-sm flex items-center">
                  {getFileIcon(doc.type)}
                  {doc.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                {uploadProgress[doc.id] !== undefined && uploadProgress[doc.id] < 100 && (
                  <Progress value={uploadProgress[doc.id]} className="mb-2" />
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(doc.uploadDate).toLocaleDateString()} - {(doc.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </CardContent>
              <CardFooter className="py-2 flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => window.open(doc.url, '_blank')}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => window.open(doc.url, '_blank')}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteDocument(folder.id, doc.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => shareDocument(doc)}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function DocumentManagement() {
  const [folders, setFolders] = useState<Folder[]>(sampleFolders)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [activeArea, setActiveArea] = useState<string>('all')

  const addDocumentToFolder = (folderId: string, document: Document) => {
    setFolders(prevFolders => {
      const updateFolder = (folder: Folder): Folder => {
        if (folder.id === folderId) {
          return { ...folder, documents: [...folder.documents, document] }
        }
        if (folder.subfolders) {
          return { ...folder, subfolders: folder.subfolders.map(updateFolder) }
        }
        return folder
      }
      return prevFolders.map(updateFolder)
    })
    simulateUpload(document.id)
  }

  const deleteDocument = (folderId: string, documentId: string) => {
    setFolders(prevFolders => {
      const updateFolder = (folder: Folder): Folder => {
        if (folder.id === folderId) {
          return { ...folder, documents: folder.documents.filter(doc => doc.id !== documentId) }
        }
        if (folder.subfolders) {
          return { ...folder, subfolders: folder.subfolders.map(updateFolder) }
        }
        return folder
      }
      return prevFolders.map(updateFolder)
    })
  }

  const simulateUpload = (documentId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(prev => ({ ...prev, [documentId]: progress }))
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 500)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sistema de Gestión Documental</h1>
      
      <Tabs value={activeArea} onValueChange={setActiveArea} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="finanzas">Finanzas</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map(folder => (
          <FolderComponent
            key={folder.id}
            folder={folder}
            onAddDocument={addDocumentToFolder}
            onDeleteDocument={deleteDocument}
            uploadProgress={uploadProgress}
            activeArea={activeArea}
          />
        ))}
      </div>
    </div>
  )
}
