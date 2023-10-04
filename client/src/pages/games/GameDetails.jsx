// GameDetails.jsx
import "./gameDetails.scss";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_KEY } from '../../Api_key';

const GameDetails = () => {
  const { gameId } = useParams();
  const [gameDetails, setGameDetails] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`https://api.rawg.io/api/games/${gameId}`, {
          params: {
            key: API_KEY,
          },
        });

        setGameDetails(response.data);
      } catch (error) {
        console.error('Error fetching game details:', error.message);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  return (
    <div className='body'>
    <div className="">
      <div className="neong">
      {gameDetails ? (
        <>
          <h2>{gameDetails.name}</h2>
          <p>Released: {gameDetails.released}</p>
          <p>Rating: {gameDetails.rating}</p>
          <p>Description: {gameDetails.description_raw}</p>
          {/* Add more details you want to display */}
         
          <img
            src={gameDetails.background_image}
            alt={gameDetails.name}
            style={{ maxWidth: '400px' }} className="image"
          />
        </>
        
      ) : (
        <p>Loading...</p>
      )}
       </div>
    </div>
    </div>
  );
};

export default GameDetails;
