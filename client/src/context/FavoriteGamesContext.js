import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoriteGamesContext = createContext();

export const useFavoriteGames = () => {
  return useContext(FavoriteGamesContext);
};

export const FavoriteGamesProvider = ({ children }) => {
  // Initialize the state with the values from local storage or an empty array
  const [favoriteGames, setFavoriteGames] = useState(() => {
    const storedFavorites = localStorage.getItem('favoriteGames');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  // Update local storage whenever the state changes
  useEffect(() => {
    localStorage.setItem('favoriteGames', JSON.stringify(favoriteGames));
  }, [favoriteGames]);

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
