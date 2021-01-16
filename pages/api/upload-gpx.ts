import type { NextApiRequest, NextApiResponse } from 'next';
import { parseXML } from '../../common/parseXML';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const obj = parseXML('upload', req.body);

    console.log(obj.gpx);

    res.status(200).json({ status: 'ok' });
};

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
