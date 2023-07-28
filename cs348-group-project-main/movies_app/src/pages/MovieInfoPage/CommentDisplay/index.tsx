import { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {PageRoutes} from "../../../routes/pageRoutes";
import {isTokenValid} from "../../../utils/authenticationUtil";
import { AiFillLike, AiFillDislike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai"

type Props = {
    id : string;
};

type Comment = {
    comment_id : number;
    username : string;
    comment : string;
    num_like : number;
    num_dislike : number;
    like : boolean;
    neither: boolean;
};

const CommentDisplay = ({ id } : Props) => {
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const [refresh, setRefresh] = useState(false);
    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };
    const [commentData, setCommentData] = useState<Comment[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = localStorage.getItem('user');
                const response = await axios.get('http://localhost:5000/comment_display/' + id + '/5/' + username); // Replace with your backend API endpoint
                console.log(response.data);
                setCommentData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refresh, id]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const username = localStorage.getItem('user');
        if (!username || !isTokenValid()) {
            localStorage.clear();
            navigate(PageRoutes.LOGIN);
            return;
        }
        const config = {
            method: 'post',
            url: 'http://localhost:5000/comment',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "name": username,
                "movie_id": id,
                "comment": comment
            }
        };
        const response = await axios(config)
        if (response.status === 200) {
            setRefresh(!refresh);
        } else {
            alert(response.data.message);
        }
        setComment('');
    };

    const handleCommentLike = async (comment_id:number, like_comment:boolean) => {
        const username = localStorage.getItem('user');
        if (!username || !isTokenValid()) {
            localStorage.clear();
            navigate(PageRoutes.LOGIN);
            return;
        }
        const config = {
            method: 'post',
            url: 'http://localhost:5000/like_comment', 
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "name": username, 
                "comment_id": comment_id, 
                "like_comment": like_comment
            }
        };
        const response = await axios(config);
        if (response.status === 200) {
            setRefresh(!refresh);
        } else {
            alert(response.data.message);
        }
    };

    const handleRemoveCommentLike = async (comment_id:number) => {
        const username = localStorage.getItem('user');
        if (!username || !isTokenValid()) {
            localStorage.clear();
            navigate(PageRoutes.LOGIN);
            return;
        }
        const config = {
            method: 'post',
            url: 'http://localhost:5000/remove_like_comment', 
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "name": username, 
                "comment_id": comment_id
            }
        };
        const response = await axios(config);
        if (response.status === 200) {
            setRefresh(!refresh);
        } else {
            alert(response.data.message);
        }
    };
    
    return (
        <div className="bg-gray-100">
            <div className="max-w-xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                        <form onSubmit={handleSubmit} className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Enter your thoughts..."
                                value={comment}
                                onChange={handleCommentChange}
                                className="flex-grow border border-gray-300 px-4 py-2 rounded-md"
                            />
                            <button
                                type="submit"
                                className="bg-gray-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                            >
                                Post
                            </button>
                        </form>
                        <div className="">
                            <h2 className="text-lg font-bold mb-2 mt-4"> Comments </h2>
                            <ul className="flex flex-col divide-y">
                                {commentData && commentData.length > 0 && commentData.map((item, index) => (
                                    <li key={index} className="py-2 flex">
                                        <div className="flex-1">
                                            <h2 className="mb-2">{item.username}</h2>
                                            <p className="text-sm text-gray-700 mb-2">{item.comment}</p>
                                        </div>
                                        <div className="flex items-end">
                                            {item.like ? (
                                                <AiFillLike onClick={() => {handleRemoveCommentLike(item.comment_id)}}/>) : (
                                                <AiOutlineLike onClick={() => {handleCommentLike(item.comment_id, true)}}/>)
                                            }
                                            <p>{item.num_like}</p>
                                            {!item.like && !item.neither ? (
                                                <AiFillDislike onClick={() => {handleRemoveCommentLike(item.comment_id)}}/>) : (
                                                <AiOutlineDislike onClick={() => {handleCommentLike(item.comment_id, false)}}/>
                                                )
                                            }
                                            <p>{item.num_dislike}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentDisplay;
