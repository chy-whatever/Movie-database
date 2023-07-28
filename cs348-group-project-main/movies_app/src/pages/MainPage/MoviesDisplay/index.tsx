import { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {PageRoutes} from "../../../routes/pageRoutes";

type Movie = {
    id: string;
    title: string;
    year: string;
    runtime: string;
};

const MoviesDisplay = () => {
    const [moviesData, setMoviesData] = useState<Movie[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/movies-default/24'); // Replace with your backend API endpoint
                console.log(response.data);
                setMoviesData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    return (
        <div className="grid lg:grid-cols-4 lg:text-left lg:gap-y-16">
            {moviesData.map((item, index) => (
                <div
                    key={index}
                    className="group mx-8 my-8 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    rel="noopener noreferrer"
                    onClick={() => {navigate(`${PageRoutes.MOVIE_INFO}/${item.id}`)}}
                >
                    <h2 className="mb-3 text-2xl font-semibold text-center">
                        {item.title}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                    -&gt;</span>
                    </h2>
                    <p className="m-0 max-w-[30ch] text-sm text-gray-500">
                        <strong>Year:</strong> {item.year} <strong>Runtime:</strong>{item.runtime}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default MoviesDisplay;
