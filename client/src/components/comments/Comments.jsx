// Comments.jsx
import { useContext, useState, useEffect } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import moment from "moment";
import axios from "axios";
import { makeRequest } from "../../axios";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await makeRequest.get(`/comments?postId=${postId}`);
        console.log(response)
        setComments(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await makeRequest.post(
        "/comments",
        { desc, postId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Clear the input field and refresh comments
      setDesc("");
      const newComment = response.data;
      setComments((prevComments) => [...prevComments, newComment]);
    } catch (err) {
      setError(err.message || "Something went wrong");
      console.log(err)
    }
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={`/upload/${currentUser.profilePic}`} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error ? (
        <div>Something went wrong</div>
      ) : isLoading ? (
        <div>Loading</div>
      ) : (
        comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={`/upload/${comment.profilePic}`} alt="" />
            <div className="info">
              <span className="neong">{comment.name}</span>
              <p className="neong">{comment.dsec}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
