import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { LatLngTuple } from 'leaflet';
import { ResponseUploadGpx } from '../common/upload-gpx.response';

interface MapProps {
    map: ResponseUploadGpx | null;
}

const Map: React.FC<MapProps> = ({ map }) => (
    <MapContainer
        center={getCenter(map)}
        zoom={10}
        scrollWheelZoom
        style={{ height: 700, width: '100%' }}
    >
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {getMarkers(map)}
        {getPolylines(map)}
    </MapContainer>
);
export default Map;

function getCenter(map: ResponseUploadGpx | null): LatLngTuple {
    if (!map || !map.wpt) {
        return [55.70931748427305, 13.20301329459559];
    }

    console.log('changed!');
    return [map.wpt.lat, map.wpt.long];
}

function getMarkers(map: ResponseUploadGpx | null) {
    if (!map || !map.wpt) {
        return null;
    }

    return (
        <Marker position={[map.wpt.lat, map.wpt.long]}>
            <Popup>{map.wpt.name}</Popup>
        </Marker>
    );
}

function getPolylines(map: ResponseUploadGpx | null) {
    if (!map || !map.trk) {
        return null;
    }

    return (
        <Polyline
            pathOptions={{ color: 'red' }}
            positions={[
                map.trk.map((trk) => ({
                    lat: trk.lat,
                    lng: trk.long,
                })),
            ]}
        />
    );
}
