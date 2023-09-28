import { useContext, useState, useEffect } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [newStoryText, setNewStoryText] = useState("");
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8800/api/stories", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.accessToken}`, // Include your authentication token here
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stories.");
        }

        const data = await response.json();
        setStories(data);
      } catch (error) {
        setError(error.message || "An error occurred while fetching stories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [currentUser.accessToken]); // Include currentUser.accessToken in the dependency array
console.log(currentUser.accessToken)
  // const createStory = async () => {
  //   try {
  //     const response = await fetch("http://localhost:8800/api/stories", {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${currentUser.accessToken}`, // Include your authentication token here
  //       },
  //       body: JSON.stringify({ text: newStoryText }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to create a story.");
  //     }

  //     // Clear the input field
  //     setNewStoryText("");

  //     // Refetch stories to update the list
  //     const updatedStories = await response.json();
  //     setStories(updatedStories);
  //   } catch (error) {
  //     console.error("Error creating story:", error);
  //   }
  // };
  const createStory = async () => {
    try {
      const response = await fetch("http://localhost:8800/api/stories", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        body: JSON.stringify({ text: newStoryText }),
      });
  
      if (!response.ok) {
        const responseData = await response.json(); // Read the error response body
        throw new Error(`Failed to create a story: ${responseData.error}`);
      }
  
      // Clear the input field
      setNewStoryText("");
  
      // Refetch stories to update the list
      const updatedStories = await response.json();
      setStories(updatedStories);
    } catch (error) {
      console.error("Error creating story:", error.message);
    }
  };

  return (
    <div className="stories">
      {/* Existing code for displaying stories */}
      {isLoading ? (
        "Loading..."
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          {stories.map((story) => (
            <div key={story.id}>{story.text}</div>
          ))}
        </div>
      )}

      {/* Form for creating a new story */}
      <div className="create-story">
        {/* <input
          type="text"
          placeholder="Share your story..."
          value={newStoryText}
          onChange={(e) => setNewStoryText(e.target.value)}
        />
        <button onClick={createStory}>Share</button> */}
      </div>
    </div>
  );
};

export default Stories;
