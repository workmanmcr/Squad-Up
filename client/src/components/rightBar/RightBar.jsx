import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './rightBar.scss';
import { serverRequest } from '../../axios';

const RightBar = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await serverRequest.get('/users/all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
        setError('Failed to fetch users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFollow = async (userId) => {
    try {
      // Send a request to your server to follow the user
      await serverRequest.post(`/relationship/${userId}`);

      // Update the local state or refetch the data to reflect the follow action
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, isFollowed: true } : user
      );
      console.log(`Following user with ID ${userId}`);
    } catch (error) {
      console.error('Error following user:', error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rightBar">
      <div className="container">
        {/* Search bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search squad..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Display search results or suggested users */}
        <div className="item">
          <div className='squad'><span>{searchQuery ? 'Search Results' : 'Your Squad'}</span>
          </div>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading &&
            !error &&
            (searchQuery ? (
              filteredUsers.map((user) => (
                <div className="user" key={user.id}>
                  <div className="userInfo">
                    <Link to={`/profile/${user.id}`}>
                      <span>{user.username}</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              users.map((user) => (
                <div className="user" key={user.id}>
                  
                    <div className='right'>
                    <Link to={`/profile/${user.id}`}>
                      <span>{user.username}</span>
                      <img src={"/upload/" + user.profilePic} alt="" className='images'/>
                    </Link>
                    </div>
                  </div>
                
              ))
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
