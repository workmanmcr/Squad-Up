import "./navbar.scss"
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useQuery } from "@tanstack/react-query";
import { API_KEY } from "../../Api_key";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext"; // Update the path

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { darkMode, toggle } = useContext(DarkModeContext); // Add this line

  const { data: searchResults, isLoading } = useQuery(
    ["search", searchQuery],
    async () => {
      try {
        // Search for both users and games
        const usersPromise = axios.get(`/users?search=${searchQuery}`);
        const gamesPromise = axios.get(
          `https://api.rawg.io/api/games?key=${API_KEY}&search=${searchQuery}`
        );

        const [usersResponse, gamesResponse] = await Promise.all([
          usersPromise,
          gamesPromise,
        ]);

        // Extract data from the responses
        const users = usersResponse.data;
        const games = gamesResponse.data.results;

        // Combine and return the results
        return { users, games };
      } catch (error) {
        console.error("Error fetching search results:", error.message);
      }
    },
    {
      enabled: isSearching, // Only fetch when isSearching is true
    }
  );

  const handleSearch = () => {
    // Start searching
    setIsSearching(true);
  };

  return (
    <div className="navbar">
      <div className="right">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Squad Up</span>
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          <HomeOutlinedIcon />
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <Link to="/games" style={{ textDecoration: "none" }}>
          <GridViewOutlinedIcon />
        </Link>
      </div>
      <div className="right">
        <div className="user">
          <img src={"/upload/" + currentUser.profilePic} alt="" className="images" />
          <span>{currentUser.name}</span>
        </div>
      </div>
      {/* Display search results */}
      {isSearching && (
        <div className="search-results">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Display user results */}
              {searchResults && searchResults.users && (
                <div>
                  <h2>Users</h2>
                  <ul>
                    {searchResults.users.map((user) => (
                      <li key={user.id}>{user.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Display game results */}
              {searchResults && searchResults.games && (
                <div>
                  <h2>Games</h2>
                  <ul>
                    {searchResults.games.map((game) => (
                      <li key={game.id}>{game.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
