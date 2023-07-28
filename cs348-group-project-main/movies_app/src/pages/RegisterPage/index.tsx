import React, { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {PageRoutes} from "../../routes/pageRoutes";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const config = {
            method: 'post',
            url: 'http://localhost:5000/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data : {
                "name": username,
                "password": password
            }
        };
        const response = await axios(config)
        if (response.status === 200) {
            navigate(PageRoutes.LOGIN);
        } else {
            alert(response.data.message);
        }
        console.log(`Username: ${username} | Password: ${password}`);
        // Reset form fields
        setUsername('');
        setPassword('');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    className="border border-gray-300 px-4 py-2 rounded-md"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="border border-gray-300 px-4 py-2 rounded-md"
                />
                <button
                    type="submit"
                    className="bg-gray-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
