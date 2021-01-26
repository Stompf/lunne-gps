import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import UploadMap from './upload-map';
import { ResponseUploadGpx } from '../common/upload-gpx.response';

export default function Home() {
    const [map, setMap] = useState<ResponseUploadGpx | null>(null);
    return (
        <main>
            <div id="map">
                <MapWithNoSSR map={map} />
                <UploadMap setMap={setMap} currentMap={map} />
            </div>
        </main>
    );
}

const MapWithNoSSR = dynamic(() => import('./map'), { ssr: false });
