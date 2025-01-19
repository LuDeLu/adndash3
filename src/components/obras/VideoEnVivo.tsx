import type React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Proyecto } from "@/types/index"

export const VideoEnVivo: React.FC<{ proyecto: Proyecto }> = ({ proyecto }) => (
  <Card>
    <CardHeader>
      <CardTitle>Video en Vivo</CardTitle>
      <CardDescription>Transmisión en vivo de la obra</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="aspect-video">
        <iframe src={proyecto.videoEnVivo} className="w-full h-full" allowFullScreen></iframe>
      </div>
    </CardContent>
  </Card>
)
