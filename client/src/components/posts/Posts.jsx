// import Post from "../post/Post";
// import "./posts.scss";
// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../../context/authContext";

// const Posts = () => {
//   const { currentUser } = useContext(AuthContext);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [posts, setPosts] = useState([]);
//   useEffect(() => {
//     const fetchPosts = async () => {
//       setIsLoading(true);
//       setError(null);
  
//       try {
//         const response = await fetch("http://localhost:8800/api/posts", {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${currentUser.accessToken}`,
//           },
//         });
  
//         if (!response.ok) {
//           throw new Error("Failed to fetch posts.");
//         }
  
//         const data = await response.json();
//         setPosts(data);
//       } catch (error) {
//         setError(error.message || "An error occurred while fetching posts.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     if (currentUser.accessToken) {
//       fetchPosts();
//     }
//   }, [currentUser.accessToken]);
  
//   return (
//     <div className="posts">
//       {error ? (
//         <div>Something went wrong!</div>
//       ) : isLoading ? (
//         <div>Loading...</div>
//       ) : (
//         <div>
//           {posts.map((post) => (
//             <Post post={post} key={post.id} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Posts;
import Post from "../post/Post";
import "./posts.scss";
import { useEffect, useState } from "react";

const Posts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8800/api/posts", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message || "An error occurred while fetching posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  return (
    <div className="posts">
      {error ? (
        <div>Something went wrong!</div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;

