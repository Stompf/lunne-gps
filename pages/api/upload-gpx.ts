import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { parseXML } from '../../common/parseXML';
import { ResponseUploadGpx } from '../../common/upload-gpx.response';
import { MapTrack, MapTrackVersion, TrackSeg } from './models/database/map-track';
import { Gpx, GpxRoot, Track, TrackPoint, Wpt } from './models/gpx';
import { LatLong } from './models/lat-long';
import { distance } from './services/geo-utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const obj: GpxRoot = parseXML('upload', req.body);

    const mapTracks = getMapTracks(obj.gpx);
    const response: ResponseUploadGpx = {
        mapTracks,
    };

    res.status(200).json(response);
};

function getMapTracks(gpx: Gpx) {
    const { trk, array = [] } = gpx;

    if (trk) {
        return [mapTrk(trk, gpx)];
    }

    return array
        .filter(isTrack)
        .map(mapToTrack)
        .map((track) => mapTrk(track, gpx));
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

    console.log(`name ${name}`);

    const mapTrack: MapTrack = {
        color: trk.extensions['gpxx:TrackExtension']['gpxx:DisplayColor'].data,
        name,
        gpxVersion: gpx.version,
        version: MapTrackVersion,
        trkSegs,
        totalLengthKilometers,
        parking: getParking(name, gpx),
    };
    return mapTrack;
}

function getTrks(trksegs: TrackPoint[]): TrackSeg[] {
    return trksegs.map(({ trkpt }) => ({
        elevation: Number(trkpt.ele),
        lat: Number(trkpt.lat),
        long: Number(trkpt.lon),
        time: trkpt.time?.data ?? '',
    }));
}

function getParking(name: string, gpx: Gpx): LatLong {
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
            .map(mapToWpt)
            .find(
                (x) =>
                    getName(x.name.data).toLowerCase() === name.toLowerCase() &&
                    isParkingArea(x.sym.data)
            );

    if (!wpt) {
        throw new Error(`Could not find parking for: ${name}`);
    }

    return {
        lat: Number(wpt.lat),
        long: Number(wpt.lon),
    };
}

function isParkingArea(symData: string) {
    return symData === 'Trail Head' || symData === 'Parking Area';
}

function isWpt(x: any): x is Wpt {
    return (
        x?.extensions?.['gpxx:WaypointExtension'] || x?.wpt?.extensions?.['gpxx:WaypointExtension']
    );
}

function isTrack(x: any): x is Track {
    return x?.extensions?.['gpxx:TrackExtension'] || x?.trk?.extensions?.['gpxx:TrackExtension'];
}

function mapToTrack(x: any): Track {
    return x.trk ?? x;
}

function mapToWpt(x: any): Wpt {
    return x.wpt ?? x;
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
