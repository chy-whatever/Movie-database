import React, { useEffect, useState } from 'react';
import { isTokenValid } from "../../utils/authenticationUtil";
import {useNavigate} from "react-router-dom";
import {PageRoutes} from "../../routes/pageRoutes";
import axios from 'axios';

const UserProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<string>();
    const [likes, setLikes] = useState<{user: string, comment: string}[]>();

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/like-list/${user}`);
                setLikes(response.data);
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        }
        const user = localStorage.getItem('user');
        if (user && isTokenValid()) {
            setUser(user);
            fetchLikes();
        } else {
            localStorage.clear();
            navigate(PageRoutes.LOGIN);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate(PageRoutes.HOME);
    };

    if (!user) {
        return <p>Loading user profile...</p>;
    }

    return (
        <div className="container mx-auto mt-8">
            {isTokenValid() ? (
                <>
                    <h1 className="text-3xl font-bold ml-10">User Profile</h1>
                    <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-6 mt-4">
                        <div className="mb-4">
                            <label className="text-xl block text-gray-700 font-bold mb-2">Name:</label>
                            <p className="text-gray-800">{user}</p>
                        </div>
                        <h2 className="font-bold mb-2">Comments Liked</h2>
                        <ul className="divide-y divide-gray-400">
                            {likes && likes.map((like, index) => (
                            <li key={index} className="py-2">
                                <strong>{like.user}</strong> liked your comment: "{like.comment}"
                            </li>
                            ))}
                        </ul>
                        <button
                            className="mt-4 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </>
            ) : (
                <span>Token expired. Please login again</span>
            )}
        </div>
    );
};

export default UserProfilePage;
