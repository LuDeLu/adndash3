"use client"
import type { ReactNode } from "react"

// Componente simplificado que no depende de react-grid-layout
export interface GridLayoutProps {
  children: ReactNode
  className: string
  layout: Array<{
    i: string
    x: number
    y: number
    w: number
    h: number
  }>
  cols: number
  rowHeight: number
  width: number
  onLayoutChange: (layout: any) => void
  draggableHandle: string
}

export const GridLayout = ({ children, className }: Partial<GridLayoutProps>) => {
  return <div className={`grid grid-cols-12 gap-4 ${className}`}>{children}</div>
}

export interface GridItemProps {
  children: ReactNode
}

export const GridItem = ({ children }: GridItemProps) => {
  return <div className="h-full w-full overflow-hidden">{children}</div>
}

