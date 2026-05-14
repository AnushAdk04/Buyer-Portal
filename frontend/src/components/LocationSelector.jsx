import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const LocationSelector = ({ lat, lng, onLocationSelect }) => {
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState(lat && lng ? [parseFloat(lat), parseFloat(lng)] : null);

  useEffect(() => {
    if (lat && lng) setPosition([parseFloat(lat), parseFloat(lng)]);
  }, [lat, lng]);

  useEffect(() => {
    if (position && onLocationSelect) {
      onLocationSelect({ lat: position[0], lng: position[1] });
    }
  }, [position]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const { data } = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
      if (data && data.length > 0) {
        const result = data[0];
        setPosition([parseFloat(result.lat), parseFloat(result.lon)]);
      } else {
        toast.error('Location not found');
      }
    } catch (err) {
      toast.error('Geocoding failed');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Search map location (e.g. Kathmandu)" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
        />
        <button type="button" onClick={handleSearch} className="px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors">
          <FiSearch />
        </button>
      </div>
      <div className="h-[200px] sm:h-[250px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative z-0">
        <MapContainer center={position || [27.7172, 85.3240]} zoom={position ? 15 : 12} style={{ height: '100%', width: '100%', zIndex: 0 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">Click on the map to drop a pin, or search for an address above.</p>
    </div>
  );
};

export default LocationSelector;
