import React, { createContext, useContext, useState } from 'react';

const FavoriteGamesContext = createContext();

export const useFavoriteGames = () => {
  return useContext(FavoriteGamesContext);
};

export const FavoriteGamesProvider = ({ children }) => {
  const [favoriteGames, setFavoriteGames] = useState([]);

  const addFavoriteGame = (gameId) => {
    setFavoriteGames((prevFavorites) => [...prevFavorites, gameId]);
  };

  const removeFavoriteGame = (gameId) => {
    setFavoriteGames((prevFavorites) => prevFavorites.filter((id) => id !== gameId));
  };

  return (
    <FavoriteGamesContext.Provider value={{ favoriteGames, addFavoriteGame, removeFavoriteGame }}>
      {children}
    </FavoriteGamesContext.Provider>
  );
};
