import SuperCluster from 'supercluster';
import { TMarkerCoordinates, TPoints } from '../types/types';
import * as GeoJSON from 'geojson';
import { DEFAULT_RADIUS } from './const';

class Clusters {
    private coordinates: TMarkerCoordinates;
    private superCluster: SuperCluster;

    constructor(coordinates: TMarkerCoordinates, maxZoom: number) {
        this.coordinates = coordinates;
        this.superCluster = new SuperCluster({
            maxZoom,
            radius: DEFAULT_RADIUS,
        });
    }

    calculate(zoom: number, bounds: { southWest: number[]; northEast: number[] }): TPoints {
        const bbox = [...bounds.southWest, ...bounds.northEast];
        const points: TPoints = this.coordinates.map((coordinate) => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinate.coordinates,
            },
            properties: { coordinate },
        }));
        this.superCluster.load(points);
        return this.superCluster.getClusters(bbox as GeoJSON.BBox, zoom);
    }
}

export default Clusters;
