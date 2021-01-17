import { LatLong } from '../lat-long';

export interface MapTrack {
    name: string;
    version: number;
    parking: LatLong;
    trkSegs: TrackSeg[];
    totalLengthKilometers: number;
    color: string;
}

interface TrackSeg extends LatLong {
    elevation: number;
    time: string;
}
