"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { CowData } from "@/lib/useHerdState";

function createIcon(cowId: string, color: string, isEscalated: boolean, isFlagged: boolean) {
  return new L.DivIcon({
    className: "bg-transparent border-0",
    html: `
      <div class="relative flex items-center justify-center">
        ${isEscalated ? `
          <div class="absolute inset-0 bg-red-500/60 rounded-full blur-[14px] animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] scale-[2.2]"></div>
          <div class="absolute inset-0 bg-red-500/40 rounded-full blur-[6px] scale-[1.6]"></div>
        ` : ''}

        ${isFlagged ? `
          <div class="absolute inset-0 bg-amber-400/50 rounded-full blur-[8px] animate-pulse scale-[1.5]"></div>
        ` : ''}
        
        <!-- Glass Marker Core -->
        <div class="relative w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-125" style="background: linear-gradient(135deg, ${color}ee, ${color}cc); border: 2.5px solid rgba(255,255,255,0.85);">
           <span class="text-[10px] font-black text-white drop-shadow-md">#${cowId}</span>
        </div>

        <!-- Sleek Label below -->
        <div class="absolute -bottom-6 whitespace-nowrap px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[8px] font-black tracking-widest text-white shadow-xl uppercase">
           ${isEscalated ? 'Tier 3' : isFlagged ? 'Tier 2' : 'Tier 1'}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

const statusColors = {
    normal: "#2E7D32", // Green
    flagged: "#F9A825", // Amber/Yellow
    escalated: "#C62828", // Red
};

type MapComponentProps = {
  selectedNode: string | null;
  setSelectedNode: (cowId: string | null) => void;
  cows: CowData[];
};

function LocationUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 29.9695) {
      map.flyTo(center, 21, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function MapComponent({ selectedNode, setSelectedNode, cows }: MapComponentProps) {
  const [position, setPosition] = useState<[number, number]>([29.9695, 76.8226]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.log("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <MapContainer 
      center={position} 
      zoom={20} 
      zoomControl={false}
      scrollWheelZoom={true} 
      style={{ height: "100%", width: "100%", borderRadius: "2rem" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; Google'
        url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
        subdomains={['mt0','mt1','mt2','mt3']}
        maxZoom={26}
        maxNativeZoom={20}
      />
      <LocationUpdater center={position} />
      
      {cows.map(cow => {
        const lat = position[0] + cow.latOffset;
        const lng = position[1] + cow.lngOffset;
        const color = statusColors[cow.status];
        const isEscalated = cow.status === "escalated";
        const isFlagged = cow.status === "flagged";
        const icon = createIcon(cow.id, color, isEscalated, isFlagged);

        return (
          <Marker 
            key={cow.id}
            position={[lat, lng]} 
            icon={icon}
            eventHandlers={{ click: () => setSelectedNode(cow.id) }}
          />
        );
      })}
    </MapContainer>
  );
}
