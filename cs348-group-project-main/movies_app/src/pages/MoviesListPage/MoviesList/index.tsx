import React, { useState } from 'react';
import {MovieBasicType} from "../types";
import {useNavigate} from "react-router-dom";
import {PageRoutes} from "../../../routes/pageRoutes";

const MoviesList: React.FC<{ movies: MovieBasicType[] }> = ({ movies }) => {
    const itemsPerPage = 100; // Number of movies to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination values
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentMovies = movies.slice(firstIndex, lastIndex);

    const navigate = useNavigate();

    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Generate pagination buttons
    const paginationButtons = [];
    const pageCount = Math.ceil(movies.length / itemsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        paginationButtons.push(
            <button
                key={i}
                className={`px-3 py-2 rounded-md mx-1 ${
                    i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}
                onClick={() => handlePageChange(i)}
            >
                {i}
            </button>
        );
    }

    return (
        <div>
            <ul className="flex flex-col divide-y">
                {currentMovies.map((movie, index) => (
                    <li
                        key={index}
                        className="py-2 hover:bg-gray-100 w-full"
                        onClick={() => {navigate(`${PageRoutes.MOVIE_INFO}/${movie.id}`)}}
                    >
                        {movie.title}
                    </li>
                ))}
            </ul>

            {paginationButtons.length > 1 && (
                <div className="flex justify-center mt-4">
                    {paginationButtons}
                </div>
            )}
        </div>
    );
};

export default MoviesList;
