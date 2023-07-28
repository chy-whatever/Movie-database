import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {PageRoutes} from "../../routes/pageRoutes";

type SearchBarProps = {
    onSearch: (searchTerm: string) => void;
}

type ResultList = {
    id: number;
    title: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [resultList, setResultList] = useState<ResultList[]>([]);
    const navigate = useNavigate();

    const handleSearch = () => {
        setResultList([]);
        onSearch(searchTerm);
    };

    const fetchData = async (value : string) => {
        if (value === '') {
            setResultList([])
        }
        try {
            const response = await axios.get(`http://localhost:5000/search-movie/${value}`); // Replace with your backend API endpoint
            setResultList(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleChange = (value : string) => {
        setSearchTerm(value)
        fetchData(value)
    }

    const handleClick = (id : number) => {
        setSearchTerm('')
        setResultList([])
        navigate(`${PageRoutes.MOVIE_INFO}/${id}`)
    }

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event : MouseEvent) => {
          if (ref.current && !ref.current.contains(event.target as Node)) {
            setSearchTerm('')
            setResultList([])
          }
        };
    
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, []);

    return (
        <div className="" ref={ref}>
            <div className="flex items-center w-full">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => handleChange(e.target.value)}
                    className="flex-grow mr-2 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                >
                    Search
                </button>
            </div>
            {resultList.length > 0 && (
            <div className="absolute mt-2 max-h-80 w-72 overflow-y-auto overflow-x-hidden border border-gray-300 bg-white rounded-md shadow-md">
                <ul className="px-1 py-1 pr-2">
                    {resultList.map((item, index) => (
                        <li
                            key={index}
                            className="px-1 py-2 hover:bg-gray-100 rounded-md"
                            onClick={() => handleClick(item.id)}
                        >
                            <p className="text-sm text-gray-700 mb-2">
                                {item.title}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>)}
        </div>
    );
};

export default SearchBar;
