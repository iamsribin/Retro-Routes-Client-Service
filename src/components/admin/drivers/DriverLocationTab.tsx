import { TabsContent } from "@/components/ui/tabs";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface DriverInterface {
  name: string;
  location: {
    longitude: string;
    latitude: string;
  };
}

interface DriverLocationTabProps {
  driver: DriverInterface;
}

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const DriverLocationTab = ({ driver }: DriverLocationTabProps) => {
  return (
    <TabsContent value="map" className="p-6">
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-gray-800 font-medium mb-4">Driver Location</h3>
        {driver.location && driver.location.latitude && driver.location.longitude ? (
          <MapContainer
            center={[parseFloat(driver.location.latitude), parseFloat(driver.location.longitude)]}
            zoom={13}
            style={{ height: "400px", width: "100%", borderRadius: "12px" }}
            className="rounded-xl overflow-hidden"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[parseFloat(driver.location.latitude), parseFloat(driver.location.longitude)]}>
              <Popup>{driver.name}'s Location</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
            Location data not available
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default DriverLocationTab;