import { LatLong } from '../lat-long';

export const MapTrackVersion = 1;

export type MapTrackBeforeSave = Omit<MapTrack, 'collection'>;

export interface MapTrack {
    name: string;
    version: number;
    gpxVersion: string;
    trkSegs: TrackSeg[];
    totalLengthKilometers: number;
    color: string;
    parking: LatLong;
    collection: string;
}

export interface TrackSeg extends LatLong {
    elevation: number;
    time: string;
}
