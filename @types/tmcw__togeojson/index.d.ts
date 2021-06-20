declare module '@tmcw/togeojson' {
    import {
        Feature,
        FeatureCollection,
        GeoJsonObject,
        GeoJsonProperties,
        GeoJsonTypes,
        Geometry,
    } from 'geojson';
    export function kml(doc: Document): FeatureCollection;

    export function kml<TProperties extends GeoJsonProperties>(
        doc: Document
    ): FeatureCollection<Geometry, TProperties>;

    export function* kmlGen(doc: Document): Generator<Feature, void, boolean>;
    export function* kmlGen<TProperties extends GeoJsonProperties>(
        doc: Document
    ): Generator<Feature<Geometry, TProperties>, void, boolean>;

    export function gpx(doc: Document): FeatureCollection;
    export function gpx<TProperties extends GeoJsonProperties>(
        doc: Document
    ): FeatureCollection<TProperties>;

    export function* gpxGen(doc: Document): Generator<Feature, void, boolean>;
    export function* gpxGen<TProperties extends GeoJsonProperties>(
        doc: Document
    ): Generator<Feature<Geometry, TProperties>, void, boolean>;

    export function tcx(doc: Document): FeatureCollection;
    export function tcx<TProperties extends GeoJsonProperties>(
        doc: Document
    ): FeatureCollection<Geometry, GeoJsonProperties>;
}
