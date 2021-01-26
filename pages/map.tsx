import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { LatLngTuple } from 'leaflet';
import { ResponseUploadGpx } from '../common/upload-gpx.response';

const trackColors: Record<string, string> = {};

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
    if (!map || !map.mapTracks) {
        return null;
    }

    return map.mapTracks.map((trk) => (
        <Marker key={trk.name} position={[trk.parking.lat, trk.parking.long]}>
            <Popup>{`${trk.name} - ${trk.parking.lat} ${trk.parking.long}`}</Popup>
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
            pathOptions={{ color: getColor(trk.name) }}
            positions={[
                trk.trkSegs.map((trkSeg) => ({
                    lat: trkSeg.lat,
                    lng: trkSeg.long,
                })),
            ]}
        />
    ));
}

function getColor(trkName: string) {
    while (!trackColors[trkName]) {
        // const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        let randomColor = '#';
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 3; i++)
            // eslint-disable-next-line no-restricted-properties
            randomColor += `0${Math.floor((Math.random() * Math.pow(16, 2)) / 2).toString(
                16
            )}`.slice(-2);

        const alreadyUsed = Object.values(trackColors).some((color) => color === randomColor);
        if (!alreadyUsed) {
            console.log(randomColor);
            trackColors[trkName] = randomColor;
        }
    }

    return trackColors[trkName];
}
