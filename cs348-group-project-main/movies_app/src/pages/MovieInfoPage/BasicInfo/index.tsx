import { useEffect, useState } from 'react';
import axios from 'axios';
import {MovieInfoType} from "./types";
import {useNavigate} from "react-router-dom";
import {PageRoutes} from "../../../routes/pageRoutes";

type Props = {
    id: string
};

const BasicInfo = ({ id }: Props) => {
    const [movieInfo, setMovieInfo] = useState<MovieInfoType>();
    const [userRating, setUserRating] = useState<number>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/movie-data/${id}`); // Replace with your backend API endpoint
                setMovieInfo(response.data);
                if (localStorage.getItem('user')) {
                    const userResponse = await axios.get(
                        `http://localhost:5000/user-rating/${localStorage.getItem('user')}/${id}`
                    );
                    setUserRating(userResponse.data.userRating);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refresh, id]);

    const submitRating = async () => {
        if (!localStorage.getItem('user')) {
            navigate(PageRoutes.LOGIN);
        }
        const response = await axios.post(
            `http://localhost:5000/rating`,
            {
                'user_name': localStorage.getItem('user'),
                'movie_id': id,
                'rating': userRating ? userRating.toFixed(1) : movieInfo?.averageRating
            }
        );
        if (response.status === 200) {
            setShowModal(false);
            setRefresh(!refresh);
        } else {
            alert('Error, please try again');
            console.log(response.data.message);
        }
    }

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="bg-gray-100">
            <div className="max-w-xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                        <h1 className="text-2xl font-bold mb-2">{movieInfo?.title}</h1>
                        <div className="mt-4" onClick={() => {setShowModal(true)}}>
                            <h2 className="text-lg font-bold mb-2">Average Rating:</h2>
                            <p className="text-3xl font-display text-purple-600">{movieInfo?.averageRating}</p>
                            <p className="text-xs font-display text-gray-600">Number of votes: {movieInfo?.numVotes}</p>
                        </div>
                        {showModal && (
                            <div className="fixed inset-0 flex">
                                <div className="bg-white rounded-lg p-8 shadow-lg">
                                    <h2 className="text-xl font-bold mb-4">Rate the Movie</h2>
                                    <p className="mb-2">Average Rating: {movieInfo?.averageRating}/10</p>
                                    <p className="mb-4">
                                        Your Rating: {userRating ? userRating: 'Not Rated'}
                                    </p>
                                    <input
                                        type="range"
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        value={userRating ? userRating : ''}
                                        onChange={(e) => setUserRating(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-end mt-4">
                                        <button
                                            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                                            onClick={submitRating}
                                        >
                                            Rate
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                                            onClick={closeModal}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <p className="mt-8 text-gray-700 mb-4">Year: {movieInfo?.year}</p>
                        <p className="text-gray-700 mb-4">Runtime: {movieInfo?.runtime}</p>
                        <p className="text-gray-700 mb-4">{`Director${(movieInfo?.directors && movieInfo?.directors.length > 1) ? 's' : ''}`}: {
                            movieInfo?.directors && movieInfo.directors.map((director, index) => (
                                <span className="hover:text-blue-800" key={index} onClick={() => navigate(`${PageRoutes.PERSON_INFO}/${director.id}`)}>{director.directorName} </span>
                            ))
                        }</p>
                        <p className="text-gray-700 mb-4">Actors: {
                            movieInfo?.actors && movieInfo.actors.map((actor, index) => (
                                <span className="hover:text-blue-800" key={index} onClick={() => navigate(`${PageRoutes.PERSON_INFO}/${actor.id}`)}>{actor.actorName} </span>
                            ))
                        }</p>
                        <p className="text-gray-700 mb-4">Genres: {
                            movieInfo?.genres && movieInfo.genres.map((genre, index) => (
                                <span className="hover:text-blue-800" key={index} onClick={() => navigate(`${PageRoutes.GENRE_INFO}/${genre.id}`)}>{genre.genreName} </span>
                            ))
                        }</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;
