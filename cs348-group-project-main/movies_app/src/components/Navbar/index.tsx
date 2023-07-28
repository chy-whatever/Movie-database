import React from 'react';
import {useNavigate} from "react-router-dom";
import {PageRoutes} from "../../routes/pageRoutes";
import SearchBar from "../SearchBar";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const user = localStorage.getItem('user');

    const handleSearch = (searchTerm: string) => {
        navigate(`/search?query=${searchTerm}`);
    };

    return (
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-white text-lg font-bold">MDB</h1>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-8 mr-4 flex items-baseline space-x-4">
                                <a
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-center"
                                    onClick={() => {navigate(PageRoutes.HOME)}}
                                >
                                    Home
                                </a>
                                <a
                                    className="w-24 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-center"
                                    onClick={() => {navigate(PageRoutes.MOVIE_LIST)}}
                                >
                                    All Movies
                                </a>
                                <a
                                    className="w-24 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-center"
                                    onClick={() => {navigate(PageRoutes.GENRE_LIST)}}
                                >
                                    All Genres
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center w-full px-3 relative">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                    <div className="flex items-center mr-auto">
                        {user ?
                            <div className="hidden md:block flex items-baseline space-x-4">
                                <a
                                    className="leading-10 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-center"
                                    onClick={() => {navigate(`${PageRoutes.USER_PROFILE}/${user}`)}}
                                >
                                    {user}
                                </a>
                            </div>
                            :
                            <button
                                onClick={() => {
                                    navigate(PageRoutes.LOGIN)
                                }}
                                className="bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                            >
                                Login
                            </button>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
