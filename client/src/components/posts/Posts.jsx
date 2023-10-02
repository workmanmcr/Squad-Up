import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { serverRequest } from "../../axios"; // Import serverRequest instead of makeRequest

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery(["posts"], () =>
    serverRequest.get("/posts?userId=" + userId).then((res) => {
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
