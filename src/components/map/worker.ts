import { createUrl } from '../../api/utils';
import { getRequest } from '../../api';
import Clusters from './Clusters';
import { TMarkerCoordinates, TPoints } from '../types/types';

let clusters: Clusters;

function calculateClusters(e: MessageEvent): { clusters: TPoints } {
    const zoom = e.data?.zoom;
    const bounds = e.data?.bounds;
    return { clusters: clusters.calculate(zoom, bounds) };
}

/* eslint-disable-next-line no-restricted-globals */
self.onmessage = async function (e) {
    const searchedValue = e.data?.searchedValue;
    if (Boolean(searchedValue)) {
        const url = createUrl(searchedValue, 1500);
        const data = await getRequest(url);
        const maxZoom = e.data.maxZoom;
        const resultItems = data?.result?.items;
        if (resultItems?.length) {
            const coordinates: TMarkerCoordinates = resultItems.map((item) => ({
                coordinates: [item.lon, item.lat],
            }));
            clusters = new Clusters(coordinates, maxZoom);
        }
    }
    postMessage(calculateClusters(e));
};
