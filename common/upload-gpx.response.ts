import { MapTrack } from '../pages/api/models/database/map-track';
import { Waypoint } from '../pages/api/models/database/waypoint';

export interface ResponseUploadGpx {
    mapTracks: MapTrack[];
    waypoints: Waypoint[];
}
