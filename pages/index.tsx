import React from 'react';
import dynamic from 'next/dynamic';

export default function Home() {
    return (
        <main>
            <div id="map">
                <MapWithNoSSR />
            </div>
        </main>
    );
}

const MapWithNoSSR = dynamic(() => import('./map'), { ssr: false });
