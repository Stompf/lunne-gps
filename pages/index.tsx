import React from 'react';
import dynamic from 'next/dynamic';
import UploadMap from './upload-map';

export default function Home() {
    return (
        <main>
            <div id="map">
                <MapWithNoSSR />
                <UploadMap />
            </div>
        </main>
    );
}

const MapWithNoSSR = dynamic(() => import('./map'), { ssr: false });
