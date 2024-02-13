import { TMarkers } from '../components/types/types';

export const getRequest = async (url: string): Promise<TMarkers | undefined> => {
    try {
        const data = await fetch(url);
        return await data.json();
    } catch (e) {
        console.error(e);
    }
};
