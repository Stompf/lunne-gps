export interface Gpx {
    gpx: {
        /**
         * example 'http://www.topografix.com/GPX/1/1'
         */
        xmlns: string;
        /**
         * example 'MapSource 6.16.3'
         */
        creator: string;
        /**
         * example '1.1'
         */
        version: string;
        /**
         * example 'http://www.w3.org/2001/XMLSchema-instance'
         */
        'xmlns:xsi': string;
        /**
         * example 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd'
         */
        'xsi:schemaLocation': string;
        metadata: {
            link: {
                /**
                 * example 'http://www.garmin.com'
                 */
                href: string;
                text: {
                    /**
                     * example 'Garmin International'
                     */
                    data: string;
                };
            };
            time: {
                /**
                 * example '2020-08-31T07:59:59Z'
                 */
                data: string;
            };
            bounds: {
                /**
                 * example '56.227319994941354'
                 */
                maxlat: string;

                /**
                 * example '14.36336187645793'
                 */
                maxlon: string;

                /**
                 * example '56.187472594901919'
                 */
                minlat: string;

                /**
                 * example '14.302313709631562'
                 */
                minlon: string;
            };
        };
        wpt?: Wpt;
        trk?: Track;
        array?: Wpt[] | Track[];
    };
}

interface Wpt {
    /**
     * example '56.208243370056152'
     */
    lat: string;
    /**
     * example '14.302313709631562'
     */
    lon: string;
    time: {
        /**
         * example '2020-08-31T07:59:14Z'
         */
        data: string;
    };
    name: {
        /**
         * example 'Parkering'
         */
        data: string;
    };
    cmt: {
        /**
         * example 'Unpaved Road'
         */
        data: string;
    };
    desc: {
        /**
         * example 'Unpaved Road'
         */
        data: string;
    };
    sym: {
        /**
         * example 'Parking Area'
         */
        data: string;
    };
    extensions: {
        'gpxx:WaypointExtension': {
            /**
             * example 'http://www.garmin.com/xmlschemas/GpxExtensions/v3'
             */
            'xmlns:gpxx': string;
            'gpxx:DisplayMode': {
                /**
                 * example 'SymbolAndName'
                 */
                data: string;
            };
        };
    };
}

interface Track {
    name: {
        /**
         * example 'Döda byn 2020-08-29'
         */
        data: string;
    };
    extensions: {
        'gpxx:TrackExtension': {
            /**
             * example "http://www.garmin.com/xmlschemas/GpxExtensions/v3"
             */
            'xmlns:gpxx': string;

            'gpxx:DisplayColor': {
                /**
                 * example "Blue"
                 */
                data: string;
            };
        };
    };
    trkseg: { array: TrackPoint[] };
}

interface TrackPoint {
    trkpt: {
        /**
         * example '56.208243370056152'
         */
        lat: string;
        /**
         * example '14.302313709631562'
         */
        lon: string;
        ele: {
            /**
             * example '70.959999999999994'
             */
            data: string;
        };
        time: {
            /**
             * example '2020-08-29T15:38:15Z'
             */
            data: string;
        };
    };
}
