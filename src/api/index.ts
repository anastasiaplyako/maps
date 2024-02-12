import {TMarkers} from "../components/types";

// @ts-ignore todo!
export const getRequest = async (url: string): Promise<TMarkers> => {
    try {
        const data = await fetch(url);
        return await data.json();
    } catch (e) {
        console.error(e);
    }
};
