import { useContext, useState, useEffect } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import moment from "moment";

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
        const response = await fetch(`/api/comments?postId=${postId}`);
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const data = await response.json();
        setComments(data);
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
      const response = await fetch("/api/comments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ desc, postId }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      // Clear the input field and refresh comments
      setDesc("");
      const newComment = await response.json();
      setComments((prevComments) => [...prevComments, newComment]);
    } catch (err) {
      setError(err.message || "Something went wrong");
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
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
