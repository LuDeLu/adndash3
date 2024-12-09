"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'

// Importamos el icono de marcador por defecto de Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Configuramos el icono por defecto
const icon = new Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

type LocationMapProps = {
  projectName: string
}

export default function LocationMap({ projectName }: LocationMapProps) {
  // Coordenadas de ejemplo (puedes cambiarlas según la ubicación real del proyecto)
  const latitude = -34.6037
  const longitude = -58.3816

  return (
    <div className="h-[400px] w-full">
      <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} icon={icon}>
          <Popup>
            {projectName}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

