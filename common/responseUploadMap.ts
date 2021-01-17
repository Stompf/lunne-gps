export interface ResponseUploadGpx {
    wpt: {
        lat: string;
        long: string;
        name: string;
    } | null;
}
