import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './rightBar.scss';
import { serverRequest } from "../../axios";

const RightBar = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call the getAllUsers endpoint
        const response = await serverRequest.get("/users/all");
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
      // Implement logic to handle the follow action
      // For example, you can send a request to the server to update the follow status
      // await serverRequest.post(`/follow/${userId}`);
      console.log(`Following user with ID ${userId}`);
    } catch (error) {
      console.error('Error following user:', error.message);
    }
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && users.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <Link to={`/profile/${user.id}`}>
                  <img src={user.profileImageUrl} alt={`Profile of ${user.username}`} />
                  <span>{user.username}</span>
                </Link>
              </div>
              <div className="buttons">
                <button onClick={() => handleFollow(user.id)}>follow</button>
                <button>dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
