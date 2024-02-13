import React, { useEffect, useState, useRef, FC, useCallback } from 'react';
import { load } from '@2gis/mapgl';
import MapWrapper from './MapWrapper';
import Search from '../search/Search';
import { INITIAL_COORDINATE, INITIAL_ZOOM, TOKEN } from './const';
import { Marker } from '@2gis/mapgl/types';
import { Map as MapType } from '@2gis/mapgl/global';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'workerize-loader!./worker';
import { PointFeature } from 'supercluster';
import { TPoint } from '../types/types';

const Map: FC = () => {
    const [mapInstance, setMapInstance] = useState<MapType | null>(null);
    const [workerInstance, setWorkerInstance] = useState<Worker>();

    const [zoom, setZoom] = useState(INITIAL_ZOOM);
    const markersRef = useRef<Marker[] | undefined>([]);

    const handleReset = () => {
        mapInstance && mapInstance.off('zoomend', () => {});
        markersRef.current = [];
    }

    useEffect(() => {
        workerInstance?.postMessage({
            zoom,
            bounds: mapInstance?.getBounds(),
        });
    }, [zoom, mapInstance]);

    useEffect(() => {
        let map: MapType;
        const worker = new Worker();

        load().then((mapglAPI) => {
            map = new mapglAPI.Map('map-container', {
                center: INITIAL_COORDINATE,
                zoom: INITIAL_ZOOM,
                key: TOKEN,
            });
            map.on('zoomend', async () => {
                setZoom(map.getZoom());
            });
            worker.onmessage = function (event: MessageEvent) {
                const clustersFromWorker = event.data.clusters;
                if (clustersFromWorker.length) {
                    markersRef.current?.forEach((marker) => {
                        marker.destroy();
                    });
                    markersRef.current = clustersFromWorker?.map(
                        (cluster: PointFeature<TPoint>) =>
                            new mapglAPI.Marker(map, {
                                coordinates: cluster.geometry.coordinates,
                            }),
                    );
                }
            };
            setMapInstance(map);
            setWorkerInstance(worker);
        });

        return () => {
            handleReset();
            setMapInstance(null);
            map && map.destroy();
            worker.terminate();
        };
    }, [setMapInstance]);

    const handleSubmit = (searchedValue: string) => {
        handleReset();
        workerInstance?.postMessage({
            searchedValue,
            maxZoom: mapInstance?.getMaxZoom(),
            zoom,
            bounds: mapInstance?.getBounds(),
        });
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Search onSubmit={handleSubmit} />
            <MapWrapper />
        </div>
    );
};

export default Map;
