import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { SaveGpxTracksRequest } from '../../common/save-gpx-tracks.request';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const obj: SaveGpxTracksRequest = req.body;

    console.log('map', obj);

    res.status(200).json(obj);
};

export const config: PageConfig = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
