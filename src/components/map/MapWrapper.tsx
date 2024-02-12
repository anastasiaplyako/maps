import React, {FC, memo} from 'react';

const MapWrapper: FC = memo(
    () => {
        return <div id="map-container" style={{ width: '100%', height: '100%' }} />;
    },
    () => true,
);

export default MapWrapper;
