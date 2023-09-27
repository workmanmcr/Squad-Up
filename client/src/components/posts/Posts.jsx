import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

const Posts = ({userId}) => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts?userId="+currentUser.id).then((res) => {
      return res.data;
    })
  );

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;