import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon in react-leaflet
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

const MapComponent = ({ properties, singleMode = false, center = [27.7172, 85.3240], zoom = 13 }) => {
  const navigate = useNavigate();

  // If single property and has coords, center on it
  const mapCenter = singleMode && properties[0]?.latitude && properties[0]?.longitude
    ? [parseFloat(properties[0].latitude), parseFloat(properties[0].longitude)]
    : center;

  const validProperties = properties.filter(p => p.latitude && p.longitude);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-0 relative">
      <MapContainer 
        center={mapCenter} 
        zoom={singleMode && validProperties.length > 0 ? 15 : zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {singleMode ? (
          validProperties.map(property => (
            <Marker key={property.id} position={[parseFloat(property.latitude), parseFloat(property.longitude)]}>
              <Popup>
                <div className="font-sans font-semibold">
                  {property.title}
                </div>
              </Popup>
            </Marker>
          ))
        ) : (
          <MarkerClusterGroup>
            {validProperties.map(property => (
              <Marker key={property.id} position={[parseFloat(property.latitude), parseFloat(property.longitude)]}>
                <Popup>
                  <div className="flex flex-col gap-2 w-48 cursor-pointer font-sans" onClick={() => navigate(`/properties/${property.id}`)}>
                    <img src={property.image_url} alt={property.title} className="w-full h-24 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{property.title}</h4>
                      <p className="text-blue-600 font-semibold text-sm">Rs. {property.price.toLocaleString()}</p>
                      <p className="text-slate-500 text-xs line-clamp-1">{property.location}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
