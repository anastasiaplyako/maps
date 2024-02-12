export const createUrl = (searchValue: string, page_size: number = 1000) => {
    return `https://catalog.api.2gis.ru/3.0/markers?q=${searchValue}&page_size=${page_size}&region_id=32&key=6aa7363e-cb3a-11ea-b2e4-f71ddc0b6dcb`;
};
