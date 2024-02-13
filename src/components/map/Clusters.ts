import SuperCluster, { PointFeature } from 'supercluster';
import { Map  } from '@2gis/mapgl/global'
import {TMarkerCoordinates} from "../types";
import * as GeoJSON from "geojson";

class Clusters {
    markers;
    map;
    superCluster: SuperCluster;

    constructor(markers: TMarkerCoordinates, map: Map | null | undefined) {
        this.markers = markers;
        this.map = map;
        this.superCluster = new SuperCluster({
            maxZoom: map?.getMaxZoom(),
            radius: 60,
        });
    }

    calculate() {
        if (this.map) {
            const zoom = this.map.getZoom();
            const bounds = this.map.getBounds();

            const bbox = [...bounds.southWest, ...bounds.northEast];
            const points = this.markers.map((marker) => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: marker.coordinates,
                },
                properties: { marker },
            }));
            this.superCluster.load(points as any); // todo - delete
            return this.superCluster.getClusters(bbox as GeoJSON.BBox, zoom);
        }
    }
}

export default Clusters;
