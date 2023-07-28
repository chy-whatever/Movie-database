import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../../routes/pageRoutes';

type Genre = {
  id: number;
  name: string;
  movieCount: number;
}

const GenreListPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:5000/genres');
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold m-4">Genre List</h1>
      <div className="grid grid-cols-3 gap-4">
        {genres.map((genre, index) => (
          <div key={genre.id} className="p-4 border rounded shadow-md" onClick={() => navigate(`${PageRoutes.GENRE_INFO}/${genre.id}`)}>
            <h2 className="text-xl font-semibold mb-2">{genre.name}</h2>
            <p>{genre.movieCount} movies</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreListPage;
