import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { parseXML } from '../../common/parseXML';
import { ResponseUploadGpx } from '../../common/responseUploadMap';
import { Gpx } from './models/gpx';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const obj: Gpx = parseXML('upload', req.body);

    const { wpt, trk } = obj.gpx;

    const response: ResponseUploadGpx = {
        wpt: wpt
            ? {
                  lat: Number(wpt.lat),
                  long: Number(wpt.lon),
                  name: wpt.name.data,
              }
            : null,
        trk: trk
            ? trk.trkseg.array.map((seg) => ({
                  lat: Number(seg.trkpt.lat),
                  long: Number(seg.trkpt.lon),
              }))
            : null,
    };
    res.status(200).json(response);
};

export const config: PageConfig = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
