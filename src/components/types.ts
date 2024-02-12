export type TMarkersItems = {
    geometry_id: string;
    id: string;
    is_advertising: boolean;
    lat: number;
    lon: number;
    match_type: number;
    rubr: number;
    source_type: number;
    type: number;
    vital: number;
}
export type TMarkers = {
    meta: {
        api_version: string;
        code: number;
        issue_date: string
    };
    result: {
        items: TMarkersItems[];
    }
}

export type TMarkerCoordinates = Array<{
    coordinates:  number[];
}>;