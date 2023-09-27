import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [newStoryText, setNewStoryText] = useState(""); // State to hold the new story text

  const { isLoading, error, data, refetch } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => {
      return res.data;
    })
  );

  // Mutation function to create a new story
  const createStoryMutation = useMutation((newStory) =>
    makeRequest.post("/stories", { text: newStory })
  );

  const createStory = async () => {
    try {
      await createStoryMutation.mutateAsync(newStoryText);
      setNewStoryText(""); // Clear the input field
      refetch(); // Refetch stories to update the list
    } catch (error) {
      console.error("Error creating story:", error);
    }
  };

  return (
    <div className="stories">
      {/* Existing code for displaying stories */}
      
      {/* Form for creating a new story */}
      <div className="create-story">
        <input
          type="text"
          placeholder="Share your story..."
          value={newStoryText}
          onChange={(e) => setNewStoryText(e.target.value)}
        />
        <button onClick={createStory}>Share</button>
      </div>
    </div>
  );
};

export default Stories;