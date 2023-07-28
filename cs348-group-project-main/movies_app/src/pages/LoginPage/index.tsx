import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {PageRoutes} from "../../routes/pageRoutes";

const LoginPage: React.FC = () => {
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
        console.log(username, password);
        const config = {
            method: 'post',
            url: 'http://localhost:5000/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "username": username,
                "password": password
            }
        };
        const response = await axios(config)
        if (response.status === 200) {
            localStorage.setItem('user', response.data.user);
            localStorage.setItem('token', response.data.token);
            navigate(PageRoutes.HOME);
        } else {
            alert(response.data.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
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
                    Sign In
                </button>
            </form>
            <p>
                Don't have an account?{' '}
                <button onClick={() => navigate('/register')}>
                    Register
                </button>
            </p>
        </div>
    );
};

export default LoginPage
