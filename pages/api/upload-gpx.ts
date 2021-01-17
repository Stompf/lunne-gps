import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { parseXML } from '../../common/parseXML';
import { Gpx } from './models/gpx';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const obj: Gpx = parseXML('upload', req.body);

    console.log(obj.gpx.array);

    res.status(200).json({ status: 'ok' });
};

export const config: PageConfig = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
