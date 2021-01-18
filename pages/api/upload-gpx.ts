import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { parseXML } from '../../common/parseXML';
import { ResponseUploadGpx } from '../../common/upload-gpx.response';
import { MapTrack, MapTrackVersion, TrackSeg } from './models/database/map-track';
import { Gpx, TrackPoint, Wpt } from './models/gpx';
import { LatLong } from './models/lat-long';
import { distance } from './services/geo-utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const obj: Gpx = parseXML('upload', req.body);

    const mapTracks = getMapTracks(obj.gpx);

    const response: ResponseUploadGpx = {
        mapTracks,
    };

    res.status(200).json(response);
};

function getMapTracks(gpx: Gpx['gpx']) {
    const { trk, version } = gpx;

    if (trk) {
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
            color: trk.extensions['gpxx:TrackExtension']?.['gpxx:DisplayColor']?.data ?? 'red',
            name,
            gpxVersion: version,
            version: MapTrackVersion,
            trkSegs,
            totalLengthKilometers,
            parking: getParking(name, gpx),
        };
        return [mapTrack];
    }

    throw new Error(`Not supported`);
}

function getTrks(trksegs: TrackPoint[]): TrackSeg[] {
    return trksegs.map(({ trkpt }) => ({
        elevation: Number(trkpt.ele),
        lat: Number(trkpt.lat),
        long: Number(trkpt.lon),
        time: trkpt.time.data,
    }));
}

function getParking(name: string, gpx: Gpx['gpx']): LatLong {
    if (gpx.wpt) {
        return {
            lat: Number(gpx.wpt.lat),
            long: Number(gpx.wpt.lon),
        };
    }

    const wpt =
        gpx.array &&
        gpx.array
            .filter(isWpt)
            .find((x) => getName(x.name.data) === name && x.sym.data === 'Parking Area');

    if (!wpt) {
        throw new Error(`Could not find parking for: ${name}`);
    }

    return {
        lat: Number(wpt.lat),
        long: Number(wpt.lon),
    };
}

function isWpt(x: any): x is Wpt {
    return x.extensions['gpxx:WaypointExtension'];
}

function getName(name: string) {
    return name.substr(0, name.indexOf('-'));
}

export const config: PageConfig = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
