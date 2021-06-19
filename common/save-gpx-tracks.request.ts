import { GeoJsonObject } from 'geojson';

export interface SaveGpxTracksRequest {
    collectionName: string;
    collectionHash: string;
    mapTracks: GeoJsonObject;
}
