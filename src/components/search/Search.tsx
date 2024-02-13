import React, { ChangeEvent, FC, useState } from 'react';
import './SearchInput.css';

type Props = {
    onSubmit: (searchedValue: string) => void;
};

const Search: FC<Props> = ({ onSubmit }) => {
    const [searchValue, setSearchValue] = useState('');

    const handlerChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    return (
        <div className='search'>
            <input className='searchInput' type='text' onChange={handlerChange} />
            <button className='searchButton' type='submit' onClick={() => onSubmit(searchValue)}>
                Search
            </button>
        </div>
    );
};

export default Search;
