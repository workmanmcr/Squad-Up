
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import "./home.scss"
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="home">
      <Share/>
      <Posts/>
    </div>
  )
}

export default Home