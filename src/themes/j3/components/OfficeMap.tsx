import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

// Navy pin built with a divIcon, so no image assets are needed (Leaflet's default icon breaks under bundlers).
const pin = L.divIcon({
  className: '',
  iconSize: [36, 46],
  iconAnchor: [18, 44],
  popupAnchor: [0, -40],
  html: `<svg width="36" height="46" viewBox="0 0 36 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18 1C9 1 2 8 2 17c0 12 16 28 16 28s16-16 16-28C34 8 27 1 18 1z" fill="#0F2B48" stroke="#fff" stroke-width="2"/>
    <circle cx="18" cy="17" r="6.5" fill="#fff"/></svg>`,
})

/** Interactive OpenStreetMap of the editorial office. Loaded lazily so Leaflet stays out of the main bundle. */
export default function OfficeMap({ lat, lng, name, address }: { lat: number; lng: number; name: string; address: string }) {
  const directions = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  return (
    // `isolate z-0` keeps Leaflet's internal z-indexes inside this box so the map never covers the header or drawers.
    <div className="relative isolate z-0 h-full min-h-[300px] overflow-hidden rounded-none border border-mauve-200">
      <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} className="h-full min-h-[300px] w-full" aria-label={`Map showing ${name}`}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={pin}>
          <Popup><strong>{name}</strong><br />{address}<br /><a href={directions} target="_blank" rel="noreferrer">Get directions</a></Popup>
        </Marker>
      </MapContainer>
      <a href={directions} target="_blank" rel="noreferrer" className="absolute bottom-3 left-3 z-[400] rounded-none border border-iris-700 bg-white px-4 py-2 font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-700 hover:bg-iris-700 hover:text-white">Get directions ↗<span className="sr-only"> (opens in a new tab)</span></a>
    </div>
  )
}
