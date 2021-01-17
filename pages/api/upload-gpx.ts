import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { parseXML } from '../../common/parseXML';
import { ResponseUploadGpx } from '../../common/responseUploadMap';
import { Gpx } from './models/gpx';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const obj: Gpx = parseXML('upload', req.body);

    const { wpt } = obj.gpx;

    const response: ResponseUploadGpx = {
        wpt: wpt
            ? {
                  lat: wpt.lat,
                  long: wpt.lon,
                  name: wpt.name.data,
              }
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
