// import { useEffect } from 'react'; // Not currently used
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAvailability } from '../hooks/useAvailability';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapPage = () => {
  const { chargers } = useAvailability();

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <Navbar />
      <div className="h-[calc(100vh-6rem)] w-full relative">
        <MapContainer
          center={[38.9072, -77.0369]}
          zoom={11}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {chargers.map((charger) => (
            <Marker
              key={charger.id}
              position={[charger.latitude, charger.longitude]}
              icon={defaultIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-2">{charger.host.name}</h3>
                  <p className="text-sm text-gray-700 mb-1">{charger.address}</p>
                  <p className="text-sm text-gray-600 mb-2">{charger.city}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-electric-green/20 text-electric-green rounded text-xs font-medium">
                      {charger.connector}
                    </span>
                    <span className="text-xs text-gray-600">{charger.powerKW} kW</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    ${charger.pricePerKwh.toFixed(2)}/kWh
                  </p>
                  <Link
                    to={`/charger/${charger.id}`}
                    className="block w-full text-center px-3 py-1 bg-electric-green text-gray-900 rounded text-sm font-medium hover:bg-electric-green/90 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
