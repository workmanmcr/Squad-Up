import "./leftBar.scss";
import Messages from "../../assets/10.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from 'react-router-dom';

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img
              src={"/upload/" + currentUser.profilePic}
              alt=""
            />
            <span className="left">{currentUser.name}</span>
          </div>
        </div>
        <Link to="../pages/gameHome/HomePage">Go to GameList</Link>
        <div className="item">
          <img src={Messages} alt="" />
        </div>
      </div>
      <hr />
      <div className="menu">
        {/* ... */}
      </div>
    </div>
  );
};

export default LeftBar;