import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { parseXML } from '../../common/parseXML';
import { ResponseUploadGpx } from '../../common/upload-gpx.response';
import { Gpx } from './models/gpx';
import { distance } from './services/geo-utils';

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

    const length = response.trk?.reduce((prev, curr, index) => {
        if (index === 0) {
            return 0;
        }

        const prevTrk = response.trk![index - 1];
        return prev + distance(prevTrk.lat, prevTrk.long, curr.lat, curr.long, 'K');
    }, 0);

    console.log('length', length);

    res.status(200).json(response);
};

export const config: PageConfig = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
