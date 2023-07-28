import React, {useEffect, useState} from 'react';
import {TiArrowUnsorted, TiArrowSortedUp, TiArrowSortedDown} from "react-icons/ti"
import MoviesList from './MoviesList';
import axios from 'axios';
import {MovieBasicType} from "./types";

export enum SortField {
    TITLE = 'TITLE',
    YEAR = 'YEAR',
    RATING = 'RATING',
}

const MoviesListPage: React.FC = () => {
    const [movies, setMovies] = useState<MovieBasicType[]>([]);
    const [sortType, setSortType] = useState<{type: SortField, isAsc: boolean}>();

    const renderSortButton = (type: SortField) => {
        return (
            <button
                className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
                onClick={() => {
                    if (type === sortType?.type) {
                        setSortType({type, isAsc: !sortType.isAsc});
                    } else {
                        setSortType({type, isAsc: false});
                    }
                }}
            >
                Sort By {type.substring(0, 1) + type.substring(1).toLowerCase()}
                {
                    sortType?.type === type && sortType.isAsc? (
                        <TiArrowSortedUp />
                    ) : sortType?.type === type? (
                        <TiArrowSortedDown />
                    ) : (
                        <TiArrowUnsorted />
                    )
                }
            </button>
        )
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const URL = "http://localhost:5000/movies";
                const response = await axios.get(URL, {params: sortType});
                setMovies(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    },[sortType]);

    return (
        <div className="mx-14">
            <div className="flex space-x-4 my-6">
                {Object.keys(SortField).map((item) => {
                    return renderSortButton(item as SortField);
                })}
                <button
                    className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
                    onClick={ () => {setSortType(undefined)} }
                >
                    Clear Sorting
                </button>
            </div>
            <MoviesList movies={movies} />
        </div>
    );
};

export default MoviesListPage;
