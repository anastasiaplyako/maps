import React, { ChangeEvent, FC, useState } from 'react';
import './SearchInput.css';
import { getRequest } from '../../api';
import { createUrl } from '../../api/utils';
import { TMarkersItems } from '../types/types';

type Props = {
    createMarkers: (markers?: TMarkersItems[]) => Promise<void>;
    onReset: () => void;
};

const Search: FC<Props> = ({ createMarkers, onReset }) => {
    const [searchValue, setSearchValue] = useState('');

    const handlerChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handlerSubmit = async () => {
        onReset();
        const url = createUrl(searchValue);
        const data = await getRequest(url);
        await createMarkers(data?.result?.items);
    };

    return (
        <div className='search'>
            <input className='searchInput' type='text' onChange={handlerChange} />
            <button className='searchButton' type='submit' onClick={handlerSubmit}>
                Search
            </button>
        </div>
    );
};

export default Search;
