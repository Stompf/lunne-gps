import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { parseXML } from '../../common/parseXML';
import { ResponseUploadGpx } from '../../common/upload-gpx.response';
import { MapTrack, MapTrackVersion, TrackSeg } from './models/database/map-track';
import { Waypoint, WaypointVersion } from './models/database/waypoint';
import { Gpx, GpxRoot, Track, TrackPoint, Wpt } from './models/gpx';
import { distance } from './services/geo-utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const obj: GpxRoot = parseXML('upload', req.body);

    const mapTracks = getMapTracks(obj.gpx);
    const waypoints = getWaypoints(obj.gpx);

    const response: ResponseUploadGpx = {
        mapTracks,
        waypoints,
    };

    res.status(200).json(response);
};

function getMapTracks(gpx: Gpx): MapTrack[] {
    const { trk, array = [] } = gpx;

    if (trk) {
        return [mapTrk(trk, gpx)];
    }

    return array
        .filter(isTrack)
        .map(mapToTrack)
        .map((track) => mapTrk(track, gpx));
}

function getWaypoints(gpx: Gpx): Waypoint[] {
    const { wpt, array = [] } = gpx;

    if (wpt) {
        return [mapWaypoint(wpt, gpx)];
    }

    return array
        .filter(isWpt)
        .map(mapToWpt)
        .map((waypoint) => mapWaypoint(waypoint, gpx));
}

function mapWaypoint(wpt: Wpt, gpx: Gpx): Waypoint {
    return {
        gpxVersion: gpx.version,
        lat: Number(wpt.lat),
        long: Number(wpt.lon),
        name: wpt.name.data,
        version: WaypointVersion,
    };
}

function mapTrk(trk: Track, gpx: Gpx): MapTrack {
    const trkSegs = getTrks(trk.trkseg.array);

    const totalLengthKilometers = trkSegs.reduce((prev, curr, index) => {
        if (index === 0) {
            return 0;
        }

        const prevTrk = trkSegs[index - 1];
        return prev + distance(prevTrk.lat, prevTrk.long, curr.lat, curr.long, 'K');
    }, 0);

    const name = getName(trk.name.data);

    const mapTrack: MapTrack = {
        color: trk.extensions?.['gpxx:TrackExtension']['gpxx:DisplayColor'].data || 'red',
        name,
        gpxVersion: gpx.version,
        version: MapTrackVersion,
        trkSegs,
        totalLengthKilometers,
    };
    console.log(`mapTrack - ${mapTrack.name} - ${mapTrack.color} - ${mapTrack.gpxVersion}`);

    return mapTrack;
}

function getTrks(trksegs: TrackPoint[]): TrackSeg[] {
    const mappedSegs = trksegs.map(({ trkpt }) => ({
        elevation: Number(trkpt.ele),
        lat: Number(trkpt.lat),
        long: Number(trkpt.lon),
        time: trkpt.time?.data ?? '',
    }));
    // Adds the start at the end to end the loop
    return mappedSegs.concat(mappedSegs.slice(0));
}

function isTrack(x: any): x is Track {
    return x?.trkseg || x?.trk?.trkseg;
}

function isWpt(x: any): x is Wpt {
    return (
        x?.extensions?.['gpxx:WaypointExtension'] || x?.wpt?.extensions?.['gpxx:WaypointExtension']
    );
}

function mapToTrack(x: any): Track {
    return x.trk ?? x;
}

function mapToWpt(x: any): Wpt {
    return x.wpt ?? x;
}

function getName(name: string) {
    return name; // name.substr(0, name.indexOf('-'));
}

export const config: PageConfig = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
