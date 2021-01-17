import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { ResponseUploadGpx } from '../common/responseUploadMap';

interface MapProps {
    map: ResponseUploadGpx | null;
}

const Map: React.FC<MapProps> = ({ map }) => (
    <MapContainer
        center={[55.70931748427305, 13.20301329459559]}
        zoom={10}
        scrollWheelZoom
        style={{ height: 700, width: '100%' }}
    >
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {getMarkers(map)}
    </MapContainer>
);
export default Map;

function getMarkers(map: ResponseUploadGpx | null) {
    if (!map || !map.wpt) {
        return null;
    }

    return (
        <Marker position={[Number(map.wpt.lat), Number(map.wpt.long)]}>
            <Popup>{map.wpt.name}</Popup>
        </Marker>
    );
}
