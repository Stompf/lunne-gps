import { MapTrackBeforeSave } from '../pages/api/models/database/map-track';

export interface ResponseUploadGpx {
    mapTracks: MapTrackBeforeSave[];
}
