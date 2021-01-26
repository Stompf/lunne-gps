import { LatLong } from '../lat-long';

export const MapTrackVersion = 1;

export interface MapTrack {
    name: string;
    version: number;
    gpxVersion: string;
    trkSegs: TrackSeg[];
    totalLengthKilometers: number;
    color: string;
    parking: LatLong;
}

export interface TrackSeg extends LatLong {
    elevation: number;
    time: string;
}
