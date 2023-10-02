import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link
import './rightBar.scss';
import { serverRequest } from "../../axios";

const RightBar = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await serverRequest.get("/users?userId=");
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {users.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                {/* Make the profile image and username clickable */}
                <Link to={`/profile/${user.id}`}>
                  <img src={user.profileImageUrl} alt={`Profile of ${user.username}`} />
                  <span>{user.username}</span>
                </Link>
              </div>
              <div className="buttons">
                <button>follow</button>
                <button>dismiss</button>
              </div>
            </div>
          ))}
        </div>
        {/* Add other sections as needed */}
      </div>
    </div>
  );
};

export default RightBar;
