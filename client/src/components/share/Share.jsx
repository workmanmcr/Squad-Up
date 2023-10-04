import "./share.scss";
import Image from "../../assets/img.png";
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
console.log(currentUser)
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/upload/" + currentUser.profilePic} alt="" className="images"/>
            <input className="neon3"
              type="text"
              placeholder={`share with the squad`}
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
                <div className="">
                <img src={Image} alt="" />
                <span className="neon">Add Image</span>
                </div>
              </div>
            </label> 
          </div>
          <div className="right">
            <button className="neon2" onClick={handleClick}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
