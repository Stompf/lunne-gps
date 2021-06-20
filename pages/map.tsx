import React from 'react';
import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-draw/dist/leaflet.draw.css';
import { LatLngTuple, Layer } from 'leaflet';
// import TextPath from 'react-leaflet-textpath';
import { ResponseUploadMap } from '../common/upload-map.response';
import { Feature, Geometry } from 'geojson';
import { EditControl } from 'react-leaflet-draw';

// const trackColors: Record<string, string> = {};

interface MapProps {
    map: ResponseUploadMap | null;
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
        {map?.geoJson && (
            <FeatureGroup>
                <EditControl position="topright" draw={{}} />
                <GeoJSON key={map?.name} data={map.geoJson} onEachFeature={onEachFeature} />
            </FeatureGroup>
        )}
        {/* {getMarkers(map)}
        {getPolylines(map)} */}
    </MapContainer>
);
export default Map;

function onEachFeature(feature: Feature<Geometry, any>, layer: Layer) {
    const properties = [feature.properties.name];

    if (feature.properties.totalDistance) {
        properties.push(`${feature.properties.totalDistance}km`);
    }

    layer.bindPopup(properties.join(' - '));
}

function getCenter(): LatLngTuple {
    return [55.70931748427305, 13.20301329459559];
}

// function getMarkers(map: ResponseUploadGpx | null) {
//     if (!map || !map.mapTracks) {
//         return null;
//     }

//     return map.mapTracks.map((trk) => (
//         <Marker key={`${trk.name}-parking`} position={[trk.parking.lat, trk.parking.long]}>
//             <Popup>
//                 <p>{trk.name}</p>
//                 <p>{`${trk.totalLengthKilometers}km`}</p>
//                 <a
//                     href={`http://www.google.com/maps/place/${trk.parking.lat},${trk.parking.long}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                 >
//                     Link
//                 </a>
//             </Popup>
//         </Marker>
//     ));
// }

// function getPolylines(map: ResponseUploadGpx | null) {
//     if (!map || !map.mapTracks) {
//         return null;
//     }

//     return map.mapTracks.map((trk) => (
//         <TextPath
//             key={trk.name}
//             positions={[
//                 trk.trkSegs.map((trkSeg) => ({
//                     lat: trkSeg.lat,
//                     lng: trkSeg.long,
//                 })),
//             ]}
//             text=" > "
//             center
//             offset={30}
//             attributes={{
//                 'font-size': 30,
//             }}
//             repeat
//             pathOptions={{ color: getColor(trk.name) }}
//         />
//     ));

// return map.mapTracks.map((trk) => (
//     <Polyline
//         key={trk.name}
//         pathOptions={{ color: getColor(trk.name) }}
//         positions={[
//             trk.trkSegs.map((trkSeg) => ({
//                 lat: trkSeg.lat,
//                 lng: trkSeg.long,
//             })),
//         ]}
//     >
//         <Tooltip sticky>{trk.name}</Tooltip>
//     </Polyline>
// ));
// }

// function getColor(trkName: string) {
//     while (!trackColors[trkName]) {
//         // const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
//         let randomColor = '#';
//         // eslint-disable-next-line no-plusplus
//         for (let i = 0; i < 3; i++)
//             // eslint-disable-next-line no-restricted-properties
//             randomColor += `0${Math.floor((Math.random() * Math.pow(16, 2)) / 2).toString(
//                 16
//             )}`.slice(-2);

//         const alreadyUsed = Object.values(trackColors).some((color) => color === randomColor);
//         if (!alreadyUsed) {
//             trackColors[trkName] = randomColor;
//         }
//     }

//     return trackColors[trkName];
// }
