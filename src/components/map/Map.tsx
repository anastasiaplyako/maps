import React, { useEffect, useState, useRef, FC } from 'react';
import { load } from '@2gis/mapgl';
import MapWrapper from './MapWrapper';
import Search from '../search/Search';
import Clusters from './Clusters';
import { INITIAL_COORDINATE, INITIAL_ZOOM, TOKEN } from './const';
import { Marker } from '@2gis/mapgl/types';
import { Map as MapType } from '@2gis/mapgl/global';
import { TMarkersItems } from '../types/types';

const Map: FC = () => {
    const [mapInstance, setMapInstance] = useState<MapType | null>(null);

    const [zoom, setZoom] = useState(INITIAL_ZOOM);
    const clusterRef = useRef<Clusters | null>(null);
    const markersRef = useRef<Marker[] | undefined>([]);

    const drawMarkers = async () => {
        if (mapInstance) {
            const mapglAPI = await load();
            markersRef.current?.forEach((marker) => {
                marker.destroy();
            });
            const calculatedClusters = clusterRef.current?.calculate();
            markersRef.current = calculatedClusters?.map(
                (cluster) =>
                    new mapglAPI.Marker(mapInstance, {
                        coordinates: cluster.geometry.coordinates,
                    }),
            );
        }
    };

    const handleReset = () => {
        mapInstance && mapInstance.off('zoomend', () => {});
        markersRef.current = [];
        clusterRef.current = null;
    };

    useEffect(() => {
        drawMarkers().then();
    }, [zoom]);

    useEffect(() => {
        let map: MapType;

        load().then((mapglAPI) => {
            map = new mapglAPI.Map('map-container', {
                center: INITIAL_COORDINATE,
                zoom: INITIAL_ZOOM,
                key: TOKEN,
            });
            map.on('zoomend', async () => {
                setZoom(map.getZoom());
            });
            setMapInstance(map);
        });

        return () => {
            handleReset();
            setMapInstance(null);
            map && map.destroy();
        };
    }, [setMapInstance]);

    const createMarkers = async (items?: TMarkersItems[]) => {
        markersRef.current?.forEach((marker) => {
            marker.destroy();
        });
        if (items && mapInstance) {
            const mapglAPI = await load();
            const coordinates = items.map((item) => ({ coordinates: [item.lon, item.lat] }));
            const clusters = new Clusters(coordinates, mapInstance);
            const calculatedClusters = clusters.calculate();
            markersRef.current = calculatedClusters?.map(
                (cluster) =>
                    new mapglAPI.Marker(mapInstance, {
                        coordinates: cluster.geometry.coordinates,
                    }),
            );
            clusterRef.current = clusters;
        }
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Search onReset={handleReset} createMarkers={createMarkers} />
            <MapWrapper />
        </div>
    );
};

export default Map;
