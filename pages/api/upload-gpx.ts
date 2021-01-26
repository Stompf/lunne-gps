import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { isNotNullOrUndefined } from '../../common/isNotNullOrUndefined';
import { parseXML } from '../../common/parseXML';
import { ResponseUploadGpx } from '../../common/upload-gpx.response';
import { MapTrack, MapTrackVersion, TrackSeg } from './models/database/map-track';
import { Waypoint, WaypointVersion } from './models/database/waypoint';
import { Gpx, GpxRoot, Track, TrackPoint, Wpt } from './models/gpx';
import { LatLong } from './models/lat-long';
import { distance } from './services/geo-utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const obj: GpxRoot = parseXML('upload', req.body);

    const mapTracks = getMapTracks(obj.gpx).filter(isNotNullOrUndefined);

    const response: ResponseUploadGpx = {
        mapTracks,
    };

    res.status(200).json(response);
};

function getMapTracks(gpx: Gpx): (MapTrack | undefined)[] {
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
        sym: wpt.sym?.data ?? '',
    };
}

function mapTrk(trk: Track, gpx: Gpx): MapTrack | undefined {
    const trkSegs = getTrks(trk.trkseg.array);

    const totalLengthKilometers = Number(
        trkSegs
            .reduce((prev, curr, index) => {
                if (index === 0) {
                    return 0;
                }

                const prevTrk = trkSegs[index - 1];
                return prev + distance(prevTrk.lat, prevTrk.long, curr.lat, curr.long, 'K');
            }, 0)
            .toFixed(1)
    );

    const name = getName(trk.name.data);

    const parking = getParking(name, getWaypoints(gpx)) ?? {
        lat: trkSegs[0].lat,
        long: trkSegs[0].long,
    };

    const mapTrack: MapTrack = {
        color: trk.extensions?.['gpxx:TrackExtension']['gpxx:DisplayColor'].data || 'red',
        name,
        gpxVersion: gpx.version,
        version: MapTrackVersion,
        trkSegs,
        totalLengthKilometers,
        parking: {
            lat: Number(parking.lat.toFixed(4)),
            long: Number(parking.long.toFixed(4)),
        },
    };

    return mapTrack;
}

function getParking(name: string, wayPoints: Waypoint[]): LatLong | undefined {
    if (wayPoints.length === 1) {
        return wayPoints[0];
    }

    const parking = wayPoints.find(
        (wp) => isParking(wp) && getName(wp.name).toLowerCase() === name.toLowerCase()
    );

    return parking;
}

function isParking(wp: Waypoint) {
    return (
        wp.name.toLowerCase().includes('start') ||
        wp.sym.toLowerCase() === 'parking area' ||
        wp.sym.toLowerCase() === 'trail head'
    );
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
    return x?.wpt || x?.extensions?.['gpxx:WaypointExtension'];
}

function mapToTrack(x: any): Track {
    return x.trk ?? x;
}

function mapToWpt(x: any): Wpt {
    return x.wpt ?? x;
}

function getName(name: string) {
    let fixedName = name
        .toLowerCase()
        .replace('tracks-', '')
        .replace('walk-', '')
        .replace('walks-', '');

    fixedName = fixedName.includes('-') ? fixedName.substr(0, fixedName.indexOf('-')) : fixedName;

    return fixedName.charAt(0).toUpperCase() + fixedName.slice(1);
}

export const config: PageConfig = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
