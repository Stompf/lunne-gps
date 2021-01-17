export interface ResponseUploadGpx {
    wpt: {
        lat: number;
        long: number;
        name: string;
    } | null;

    trk:
        | {
              lat: number;
              long: number;
          }[]
        | null;
}
