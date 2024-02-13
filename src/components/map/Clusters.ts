import SuperCluster from 'supercluster';
import { Map } from '@2gis/mapgl/global';
import { TMarkerCoordinates, TPoints } from '../types/types';
import * as GeoJSON from 'geojson';
import { DEFAULT_RADIUS } from './const';

class Clusters {
    private markers;
    private readonly map;
    private superCluster: SuperCluster;

    constructor(markers: TMarkerCoordinates, map: Map | null | undefined) {
        this.markers = markers;
        this.map = map;
        this.superCluster = new SuperCluster({
            maxZoom: map?.getMaxZoom(),
            radius: DEFAULT_RADIUS,
        });
    }

    calculate() {
        if (this.map) {
            const zoom = this.map.getZoom();
            const bounds = this.map.getBounds();

            const bbox = [...bounds.southWest, ...bounds.northEast];
            const points: TPoints = this.markers.map((marker) => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: marker.coordinates,
                },
                properties: { marker },
            }));
            this.superCluster.load(points);
            return this.superCluster.getClusters(bbox as GeoJSON.BBox, zoom);
        }
    }
}

export default Clusters;
