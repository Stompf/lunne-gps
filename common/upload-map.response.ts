import { GeoJsonObject } from 'geojson';

export interface ResponseUploadMap {
    geoJson: GeoJsonObject;
    name: string;
}
