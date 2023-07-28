import { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import {PageRoutes} from "../../routes/pageRoutes";
import { PersonInfoType } from './types';

const PersonInfoPage = () => {
    const { id } = useParams<{ id: string }>();
    const [personInfo, setPersonInfo] = useState<PersonInfoType>()
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/person-data/${id}`); // Replace with your backend API endpoint
                setPersonInfo(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div className="bg-gray-100">
            <div className="max-w-xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                        <h1 className="text-2xl font-bold mb-2">{personInfo?.name}</h1>
                        <p className="text-gray-700 mb-4">{personInfo?.birthYear} - {personInfo?.deathYear || 'Current'}</p>
                        <p className="mt-8 text-gray-700 mb-4">Profession: {personInfo?.profession}</p>
                        <p className="text-gray-700 mb-4">Works: {
                            personInfo?.works && personInfo.works.map((work, index) => (
                                <span className="hover:text-blue-800" key={index} onClick={() => navigate(`${PageRoutes.MOVIE_INFO}/${work.id}`)}>{work.title} </span>
                            ))
                        }</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonInfoPage;
