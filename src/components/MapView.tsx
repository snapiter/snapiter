'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface MapViewProps {
  className?: string;
}

const MapComponent = dynamic(
  () => import('@vis.gl/react-maplibre').then((mod) => mod.Map),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    ),
  }
);

export default function MapView({ className }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Import CSS dynamically on client side
    import('maplibre-gl/dist/maplibre-gl.css');
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapComponent
        initialViewState={{
          longitude: -74.006,
          latitude: 40.7128,
          zoom: 12
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        attributionControl={false}
      />
    </div>
  );
}