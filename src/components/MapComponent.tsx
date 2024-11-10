// 'use client'

// import React, { useEffect, useRef } from 'react'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'

// // Define colors for polylines
// const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1', '#F1FF33']

// export default function MapComponent({ 
//   routes = [], 
//   selectedRouteIndex = null, 
//   highestCarbonRouteIndex,
//   onSourceLocationChange
// }) {
//   const mapRef = useRef(null)
//   const leafletMap = useRef(null)
//   const polylines = useRef([])
//   const sourceMarker = useRef(null)

//   useEffect(() => {
//     if (typeof window !== 'undefined' && mapRef.current) {
//       // Initialize the map if it's not already initialized
//       if (!leafletMap.current) {
//         leafletMap.current = L.map(mapRef.current).setView([51.505, -0.09], 13)

//         // Add OpenStreetMap tiles
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '© OpenStreetMap contributors',
//         }).addTo(leafletMap.current)
//       }

//       const map = leafletMap.current

//       // Clear previous polylines
//       polylines.current.forEach(polyline => map.removeLayer(polyline))
//       polylines.current = []

//       // Add new route polylines
//       if (routes.length > 0) {
//         const bounds = L.latLngBounds()

//         routes.forEach((route, index) => {
//           if (route && route.length > 0) {
//             let color = colors[index % colors.length]
//             if (index === highestCarbonRouteIndex) {
//               color = '#FF0000' // Red color for highest carbon emission route
//             }
//             const polyline = L.polyline(route, { 
//               color, 
//               weight: selectedRouteIndex === null || selectedRouteIndex === index ? 5 : 2,
//               opacity: selectedRouteIndex === null || selectedRouteIndex === index ? 1 : 0.5
//             }).addTo(map)
//             polylines.current.push(polyline)
//             route.forEach((coord) => bounds.extend(coord))
//           }
//         })

//         map.fitBounds(bounds)
//       }
//     }
//   }, [routes, selectedRouteIndex, highestCarbonRouteIndex])

//   return (
//     <div className="relative w-full h-full">
//       <div id="map" ref={mapRef} className="w-full h-full"></div>
//     </div>
//   )
// }
'use client'

import React, { useEffect, useRef } from 'react'
import L, { Map, LatLngExpression, Polyline } from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapComponentProps {
  highestCarbonRouteIndex: number | null;
  routes: LatLngExpression[][]; // Array of routes, where each route is an array of coordinates
  selectedRouteIndex: number | null; // Selected route index
}

// Define colors for polylines
const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1', '#F1FF33']

const MapComponent: React.FC<MapComponentProps> = ({
  routes = [],
  selectedRouteIndex = null,
  highestCarbonRouteIndex,
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<Map | null>(null)
  const polylines = useRef<Polyline[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      // Initialize the map if it's not already initialized
      if (!leafletMap.current) {
        leafletMap.current = L.map(mapRef.current).setView([51.505, -0.09], 13)

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(leafletMap.current)
      }

      const map = leafletMap.current

      // Clear previous polylines
      polylines.current.forEach(polyline => map.removeLayer(polyline))
      polylines.current = []

      // Add new route polylines
      if (routes.length > 0) {
        const bounds = L.latLngBounds(routes[0] || [])

        routes.forEach((route, index) => {
          if (route && route.length > 0) {
            let color = colors[index % colors.length]
            if (index === highestCarbonRouteIndex) {
              color = '#FF0000' // Red color for highest carbon emission route
            }
            const polyline = L.polyline(route, { 
              color, 
              weight: selectedRouteIndex === null || selectedRouteIndex === index ? 5 : 2,
              opacity: selectedRouteIndex === null || selectedRouteIndex === index ? 1 : 0.5
            }).addTo(map)
            polylines.current.push(polyline)
            route.forEach((coord) => bounds.extend(coord))
          }
        })

        map.fitBounds(bounds)
      }
    }
  }, [routes, selectedRouteIndex, highestCarbonRouteIndex])

  return (
    <div className="relative w-full h-full">
      <div id="map" ref={mapRef} className="w-full h-full"></div>
    </div>
  )
}

export default MapComponent
