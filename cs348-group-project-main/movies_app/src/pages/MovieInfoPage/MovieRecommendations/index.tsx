import axios from 'axios';
import React, { useState, useEffect } from 'react';

type Movie = {
  id: number;
  title: string;
  rating: number;
}

type MovieRecommendationsProps = {
  id: string;
}

const MovieRecommendations: React.FC<MovieRecommendationsProps> = ({ id }) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Replace the API URL with your actual endpoint to fetch movie recommendations
        const response = await axios.get(`http://localhost:5000/movies-similar/${id}`);
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [id]);

  return (
      <div className="bg-gray-100">
          <div className="max-w-xl mx-auto p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <h2 className="text-xl font-bold m-4">Movie Recommendations</h2>
                  <div className="grid grid-cols-3 gap-4">
                      {recommendations.map((recommendedMovie) => (
                          <div key={recommendedMovie.id} className="p-4 border rounded shadow-md">
                              <h3 className="text-lg font-semibold mb-2">{recommendedMovie.title}</h3>
                              <p>Rating: {recommendedMovie.rating}/10</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );
};

export default MovieRecommendations;
