import "./share.scss";
import Image from "../../assets/img.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();

    const newPost = {
      desc,
      img: imgUrl,
      taggedUsers: taggedUsers.map(user => user.id),
    };

    mutation.mutate(newPost);

    // Reset states
    setDesc("");
    setFile(null);
    setTaggedUsers([]);
  };

  const handleTagUser = (selectedUser) => {
    // Check if the user is already tagged
    if (!taggedUsers.some(user => user.id === selectedUser.id)) {
      setTaggedUsers(prevUsers => [...prevUsers, selectedUser]);
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
              {/* Display tagged users */}
              <div className="taggedUsers">
                {taggedUsers.map(user => (
                  <span key={user.id} className="taggedUser">{user.name}</span>
                ))}
              </div>
              {/* Placeholder for user search or dropdown */}
              <input
                type="text"
                placeholder="Search users"
                onChange={(e) => {
                  // Placeholder for handling user search or dropdown
                  // For simplicity, you can fetch users from the server and filter based on input
                  // Set the selected user to taggedUsers using handleTagUser
                }}
              />
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>SquadUp</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
