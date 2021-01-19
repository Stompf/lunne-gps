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
        center={getCenter()}
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

function getCenter(): LatLngTuple {
    return [55.70931748427305, 13.20301329459559];
}

function getMarkers(map: ResponseUploadGpx | null) {
    if (!map || !map.waypoints) {
        return null;
    }

    return map.waypoints.map((wpt) => (
        <Marker key={wpt.name} position={[wpt.lat, wpt.long]}>
            <Popup>{wpt.name}</Popup>
        </Marker>
    ));
}

function getPolylines(map: ResponseUploadGpx | null) {
    if (!map || !map.mapTracks) {
        return null;
    }

    return map.mapTracks.map((trk) => (
        <Polyline
            key={trk.name}
            pathOptions={{ color: trk.color ?? 'red' }}
            positions={[
                trk.trkSegs.map((trkSeg) => ({
                    lat: trkSeg.lat,
                    lng: trkSeg.long,
                })),
            ]}
        />
    ));
}
