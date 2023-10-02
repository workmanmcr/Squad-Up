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

  useEffect(() => {
    const fetchFavoritedGames = async () => {
      try {
        const gamesPromises = favoriteGames.map(async (gameId) => {
          const response = await axios.get(`https://api.rawg.io/api/games/${gameId}`, {
            params: {
              key: API_KEY,
            },
          });
          return response.data;
        });

        const favoritedGamesData = await Promise.all(gamesPromises);
        setFavoritedGames(favoritedGamesData);
      } catch (error) {
        console.error("Error fetching favorited games:", error.message);
      }
    };

    fetchFavoritedGames();
  }, [favoriteGames]);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <span className="left">{currentUser.name}</span>
          </div>
        </div>
        <div className="item">
          <h3>Favorited Games</h3>
          <ul>
            {favoritedGames.map((game) => (
              <li key={game.id}>
                <Link to={`/games/${game.id}`}>{game.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <hr />
      <div className="menu">{/* ... */}</div>
    </div>
  );
};

export default LeftBar;
