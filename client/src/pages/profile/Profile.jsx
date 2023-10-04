import "./profile.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { serverRequest } from "../../axios"; 
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

// ... (other imports)

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [aboutMe, setAboutMe] = useState("");
  const [username, setUserName] = useState(""); // Add userName state
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  // Fetch user data including userName
  const { isLoading, error, data, refetch } = useQuery(["user"], () => {
    const url = `/users/find/${userId}`;
    return serverRequest.get(url).then((res) => {
      setAboutMe(res.data.about || "");
      setUserName(res.data.username || ""); // Set userName
      return res.data;
    });
  });

  const { isLoading: aboutMeLoading, data: aboutMeData } = useQuery(["aboutMe"], () => {
    const url = `/users/about/${userId}`;
    return serverRequest.get(url).then((res) => res.data.about);
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      serverRequest.get(`/relationships?followedUserId=${userId}`).then((res) => {
        return res.data;
      })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return serverRequest.delete(`/relationships?userId=${userId}`);
      return serverRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  const renderUserName = () => {
    return <span>{username}</span>;
  };

  useEffect(() => {
    refetch();
  }, [userId, refetch]);

  return (
    <div className="profile">
      {isLoading || aboutMeLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={`/upload/${data.coverPic}`} alt="" className="cover" />
            <img src={`/upload/${data.profilePic}`} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
              </div>
              <div className="center">
                {renderUserName()}
                <div className="neon">
                <div className="GT"><p> {username} </p></div>
                <div className="about">
                  <p> About me: </p>
                  <p> {aboutMe} </p>
                  </div>
                </div>
                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                {/* Remove Email icon */}
                {/* <EmailOutlinedIcon /> */}
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} aboutMe={aboutMe} setAboutMe={setAboutMe} />}
    </div>
  );
};

export default Profile;
