import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './games.scss';
import { useFavoriteGames } from '../../context/FavoriteGamesContext';
import { API_KEY } from '../../Api_key';
import { AuthContext } from '../../context/authContext';
import { DarkModeContext } from '../../context/darkModeContext';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { favoriteGames, addFavoriteGame, removeFavoriteGame } = useFavoriteGames();
  const { currentUser } = useContext(AuthContext);
  const { darkMode, toggle } = useContext(DarkModeContext);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFavorite = async (gameId) => {
    try {
      if (favoriteGames.includes(gameId)) {
        removeFavoriteGame(gameId);
      } else {
        addFavoriteGame(gameId);
      }
  
      // Save the updated favorite games to the user profile
      await axios.post(`/users/${currentUser.id}/favoriteGames`, { favoriteGames });
  
    } catch (error) {
      console.error('Error updating favorite games:', error.message);
    }
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('https://api.rawg.io/api/games', {
          params: {
            key: API_KEY,
            ordering: '-rating',
            page_size: 100,
            search: searchQuery,
          },
        });

        setGames(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching games:', error.message);
      }
    };

    fetchGames();
  }, [searchQuery]);

  return (
    <div className='body'>
      <div className='neong'> 
      <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
         {/* Search Bar */}
         <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={handleSearch}
          />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {games.map((game) => (
              <li key={game.id}>
                <h3>{game.name}</h3>
                <p>Released: {game.released}</p>
                <p>Rating: {game.rating}</p>

                <Link to={`/games/${game.id}`}>
                  <img
                    src={game.background_image}
                    alt={game.name}
                    style={{ maxWidth: '200px', cursor: 'pointer' }}
                  />
                </Link>

                <button className='neong' onClick={() => handleFavorite(game.id)}>
                  {favoriteGames.includes(game.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
    </div>
  );
};

export default GameList;