import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";

type SearchResult = {
    id: number;
    title: string;
    description: string;
}

const SearchResultsPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';

    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        const handleSearch = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/search-movie/${searchQuery}`); // Replace with your backend API endpoint
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        handleSearch();
    }, [searchQuery]);

    return (
        <div>
            {searchResults.length > 0 ? (
                <ul className="mt-4">
                    {searchResults.map((result) => (
                        <li key={result.id} className="bg-gray-100 p-4 rounded-md mb-2">
                            <h3 className="text-lg font-bold">{result.title}</h3>
                            <p className="text-gray-500">{result.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4 w-full text-center">No search results found.</p>
            )}
        </div>
    );
};

export default SearchResultsPage;
