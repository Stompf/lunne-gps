import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { SaveGpxTracksRequest } from '../../common/save-gpx-tracks.request';
import { getDB } from './services/database-connector';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const obj: SaveGpxTracksRequest = req.body;

    // const mapTracks: MapTrack[] = obj.mapTracks.map((trk) => ({
    //     ...trk,
    //     collection: obj.collectionName,
    // }));

    const db = await getDB();

    const result = await db.collection('tracks').insert(obj.mapTracks);
    console.log(`Insert result`, result);

    res.status(200).json(result);
};

export const config: PageConfig = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
