import { LatLong } from '../lat-long';

export const WaypointVersion = 1;

export interface Waypoint extends LatLong {
    name: string;
    version: number;
    gpxVersion: string;
}
