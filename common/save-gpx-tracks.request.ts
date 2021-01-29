import { MapTrackBeforeSave } from '../pages/api/models/database/map-track';

export interface SaveGpxTracksRequest {
    collectionName: string;
    mapTracks: MapTrackBeforeSave[];
}
