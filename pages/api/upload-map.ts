import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';

import { gpx } from '@tmcw/togeojson';
import { DOMParser } from 'xmldom';
import { LineString } from 'geojson';
import crypto from 'crypto';
import { distance } from './services/geo-utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const obj = new DOMParser().parseFromString(req.body);

    const converted = gpx(obj);
    converted.features = converted.features.filter(
        (feat) =>
            feat.geometry.type === 'LineString' &&
            !(feat.properties?.name as string).toLowerCase().includes('-genväg')
    );

    const points: typeof converted.features = converted.features.map((feat) => {
        const totalDistance = (feat.geometry as LineString).coordinates.reduce(
            (prev, curr, index, array) => {
                if (index === 0) {
                    return 0;
                }
                const prevTrk = array[index - 1];

                return (prev += distance(prevTrk[1], prevTrk[0], curr[1], curr[0], 'K'));
            },
            0
        );

        const startPoint = (feat.geometry as LineString).coordinates[0];
        return {
            geometry: {
                coordinates: startPoint,
                type: 'Point',
            },
            type: 'Feature',
            properties: {
                name: feat.properties?.name,
                totalDistance: totalDistance.toFixed(1),
            },
        };
    });

    converted.features = converted.features.concat(points);

    const sha256 = crypto.createHash('sha256').update(req.body).digest('hex');

    res.status(200).json({ geoJson: converted, name: sha256 });
};

export const config: PageConfig = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
