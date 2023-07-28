import {useParams} from "react-router-dom";
import BasicInfo from "./BasicInfo";
import CommentDisplay from "./CommentDisplay"
import MovieRecommendations from "./MovieRecommendations";

const MovieInfoPage = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div>
            <BasicInfo id={id || ''} />
            <MovieRecommendations id={id || ''} />
            <CommentDisplay id={id || ''} />
        </div>
    );
};

export default MovieInfoPage;
