import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import {MovieBasicInfo} from "../../types";
import { PageRoutes } from '../../routes/pageRoutes';

const GenrePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [movies, setMovies] = useState<MovieBasicInfo[]>([]);
    const [genreName, setGenreName] = useState<string>();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch movies based on the genre
        // Replace this with your actual API call or data retrieval logic
        const fetchMovies = async () => {
            try {
                // Example API call
                const response = await axios.get(`http://localhost:5000/genre/${id}`);
                setMovies(response.data.movies);
                setGenreName(response.data.genre);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, [id]);

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold my-6 text-center">Movies - {genreName} Genre</h1>
            {movies.length > 0 ? (
                <ul className="grid grid-cols-2 gap-4">
                    {movies.map((movie) => (
                        <li key={movie.id} className="bg-white p-4 rounded-md shadow-md" onClick={() => navigate(`${PageRoutes.MOVIE_INFO}/${movie.id}`)}>
                            <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                            <p className="text-gray-500">Year: {movie.year}</p>
                            {/* Render other movie details as needed */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No movies found for the {genreName} genre.</p>
            )}
        </div>
    );
};

export default GenrePage;
