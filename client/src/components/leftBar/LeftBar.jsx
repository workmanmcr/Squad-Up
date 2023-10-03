import React, { useContext, useEffect, useState } from "react";
import "./leftBar.scss";
import { AuthContext } from "../../context/authContext";
import { useFavoriteGames } from "../../context/FavoriteGamesContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_KEY } from "../../Api_key";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  const { favoriteGames } = useFavoriteGames();
  const [favoritedGames, setFavoritedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoritedGames = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch details for each favorited game
        const gamesData = await Promise.all(
          favoriteGames.slice(0, 5).map(async (gameId) => {
            const response = await axios.get(`https://api.rawg.io/api/games/${gameId}`, {
              params: {
                key: API_KEY,
              },
            });
            return response.data;
          })
        );

        setFavoritedGames(gamesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorited games:", error.message);
        setError("Error fetching favorited games");
        setLoading(false);
      }
    };

    fetchFavoritedGames();
  }, [favoriteGames]);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={"/upload/" + currentUser.profilePic} alt="" className="images"/>
            <span className="left">{currentUser.name}</span>
          </div>
        </div>
        <div className="item">
          <h3>Top 5 Favorited Games</h3>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          <div className="favorited-games">
            {!loading &&
              !error &&
              favoritedGames.map((game) => (
                <div key={game.id} className="favorited-game">
                  <Link to={`/games/${game.id}`}>
                    <span className="game-name">{game.name}</span>
                    <img src={game.background_image} alt={game.name} />
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
      <hr />
      <div className="menu">{/* ... */}</div>
    </div>
  );
};

export default LeftBar;
